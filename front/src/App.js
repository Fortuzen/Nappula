import React, { useState, useEffect } from 'react';
import {motion} from "framer-motion"

import fetchers from "./Controller";

import './App.css';


const Button = (props) => {
    const gameOver = props.status.points > 0 ? false : true;
    const color = !props.enabled ? "green" : "red";
    const animXPos = -40;
    const onclick = props.enabled ? props.onClick : null;
    return(
      <>
        {gameOver &&
          <motion.div id="button-container"
              animate={{ x: [0, animXPos, 0, -animXPos, 0] }}
              transition={{duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1], loop: 2}}>
            <motion.div whileTap={{ y: 30 }} id="button-top" className={color} onClick={onclick}/>
            <div id="button-bottom"></div>
          </motion.div>
        }
        {!gameOver &&
          <motion.div id="button-container">
            <motion.div whileTap={{ y: 30 }} id="button-top" className={color} onClick={onclick}/>
            <motion.div id="button-bottom" />
          </motion.div>
        }

      </>
    )
}

const GameStatus = (props) => {
  const status = props.status;
  const gameOver = status.points > 0 ? false : true;
  return(
    <>
      {!gameOver &&
        <>
          Saldosi: {status.points} <br/>
          Voittosumma: {status.pointsWon} <br/>           
          Pisteitä seuraavaan voittoon: {status.pointsToNextWin} <br/>
        </>
      }
      {gameOver &&
        <>
          Pisteet loppu! Yritä uudelleen painamalla nappia! <br/>
        </>
      }
    </>
  )
}

const LoadingIcon = (props) => {
  const animate = props.isLoading ? { scale: 1.5, rotate: 360, display: "inline-block"} : { scale: 1, rotate: 0, display: "inline-block"};
  const style = {height: "1em", width: "1em", background: "white", borderRadius: "10px"};
  const loop = props.isLoading ? Infinity : null;
  const transition = {duration: 1.0, flip:loop };
  return(
      <>
      <motion.div
        animate={animate}
        transition={{transition}}
        style={style}
      />
    </>
  )
}

const App = () => {
  const [points, setPoints] = useState(20);
  const [pointsWon, setPointsWon] = useState(null);
  const [pointsToNextWin, setPointsToNextWin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonEnabled, setButtonEnabled] = useState(true);


  // Fetch points from the server. Token created automatically if it doesnt exist.
  useEffect(() => {
    console.log("Effect");
    setLoading(true);
    fetchers
      .fetchRequest()
      .then(data => {
        console.log(data);
        setPoints(data.points);
        //setLoading(false);
        artificialDelay();
      });
  }, []);

  // Spend user's points and update state
  function spendPoint() {
    fetchers
      .fetchSpend()
      .then(data => {
        console.log(data);
        setPoints(data.points);
        setPointsWon(data.pointsWon);
        setPointsToNextWin(data.pointsToNextWin);
        // If game over, then disable button for a short amount of time
        if(data.points <= 0) {
          setButtonEnabled(false);
          setTimeout( ()=>{setButtonEnabled(true)}, 1000);
        }
      });
  }  

  // Reset the game if game over
  function handleGameOver() {
    setLoading(true);
    fetchers
      .fetchReset()
      .then((data)=>{
        setPoints(data.points);
        setPointsWon(0);
        setPointsToNextWin(data.pointsToNextWin);
        setButtonEnabled(false);
        setTimeout( ()=>{setButtonEnabled(true)}, 1000);
        artificialDelay();
      });
  }

  const handleClick = () => {
    console.log("Click");
    if (points > 0 && !loading) {
      spendPoint();
    } else {
      handleGameOver();
    }   
  }

  const gameAreaHide = () => {
    //console.log("Loading",loading);
    return loading ? "div-hide" : "div-show";
  };

  // Slow things down so eveything doesnt happen instantly.
  function artificialDelay() {
    setTimeout(()=>{
      setLoading(false);
    }, 1000);
  }

  const gameStatusData = {points: points, pointsWon: pointsWon, pointsToNextWin: pointsToNextWin};

  return (
    <div className="App">
      <h1>Nappula <LoadingIcon isLoading={loading}/></h1>
        <div id="game-area" className={gameAreaHide()}>
          <Button onClick={handleClick} status={gameStatusData} enabled={buttonEnabled}/>
          {!loading && <GameStatus status={gameStatusData}/>}
        </div>
    </div>
  ) 
}

export default App;
