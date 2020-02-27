import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import {motion} from "framer-motion"

import fetchers from "./Controller";

import './App.css';


const Button = (props) => {
    const gameOver = props.gameOver;
    const anim = -40;
    const onclick = props.enabled ? props.onClick : null;
    return(
      <>
        {gameOver &&
          <motion.div id="button-container"
              animate={{ x: [0, anim, 0, -anim, 0] }}
              transition={{duration: 0.25, times: [0, 0.25, 0.5, 0.75, 1], loop: 5}}>
            <motion.div whileTap={{ y: 30 }} id="button-top" className={"green"} onClick={onclick}/>
            <div id="button-bottom"></div>
          </motion.div>
        }
        {!gameOver &&
          <motion.div id="button-container">
            <motion.div whileTap={{ y: 30 }} id="button-top" className={"red"} onClick={onclick}/>
            <div id="button-bottom"></div>
          </motion.div>
        }

      </>
    )
}

const GameStatusText = (props) => {
  const text = props.text;
  const value = props.value;

  return(
    <>
      {text} {value} <br/>
    </>
  )
}

const GameStatus = (props) => {
  return(
    <div>
      {props.children}      
    </div>
  )
}

const LoadingIcon = (props) => {
  const animate = props.isLoading ? { scale: 1.5, rotate: 360, display: "inline-block"} : { scale: 1, rotate: 0, display: "inline-block"};
  const flip = props.isLoading ? Infinity : null;
  return(
      <>
      <motion.div
        animate={animate}
        transition={{ duration: 1.0, flip:flip }}
        style={{height: "1em", width: "1em", background: "white", borderRadius: "10px"}}
     /* style={{height: "5em", width: "5em", background: "white", borderRadius: "10px", position: "relative", margin: "5em 5em 5em 5em"}} */    
      />
    </>
  )
}


const App = () => {
  const [score, setScore] = useState(1);
  const [winScore, setWinScore] = useState(0);
  const [nextClicks, setNextClicks] = useState(0);
  const [status, setStatus] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    console.log("Effect Test");
    fetchers
      .fetchScore()
      .then(data => {
        console.log(data);
        setScore(data.score);
        setIsButtonEnabled(true);
        setIsLoading(false);
        const over = data.score > 0 ? false : true;
        setIsGameOver(over);
      });
  }, []);

  const handleClick = () => {
    console.log("Click", count);
    setCount(count + 1);
    //setButtonUsable(false);

    if (score <= 0) {
      setIsLoading(true);
      fetchers
        .fetchReset()
        .then((data)=>{
          setScore(data.score); setWinScore(0); setNextClicks(0); setStatus("");
          setIsLoading(false);
          setIsGameOver(false);
        });
      return;
    }
    
    if(!isButtonEnabled) {
      return;
    }

    fetchers
      .fetchSpend()
      .then(data => {
        console.log(data);
        setScore(data.score);
        setStatus(data.status.state);
        setWinScore(data.status.score);
        setNextClicks(data.clicksToNext);
        const over = data.score > 0 ? false : true;
        if(over) {
          setIsGameOver(true);
          setIsButtonEnabled(false);
          setTimeout(()=>{setIsButtonEnabled(true);}, 1000);
        }
        
      });
  }

  const buttonColor = () => {
    if(score > 0) {
      return "red";
    } else {
      return "green";
    }
  }

  const activateButton = () => {
    console.log("Button active");
    //setButtonUsable(true);
  }


  return (
    <div className="App">
      <h1>Nappula <LoadingIcon isLoading={isLoading}/></h1>
      {!isLoading &&
        <>
        <Button onClick={handleClick} topColor={buttonColor()} gameOver={isGameOver} enabled={isButtonEnabled} />
        <GameStatus>
          {score > 0 &&
            <>
            <GameStatusText text={"Saldosi on"} value={score} />
            <GameStatusText text={"Tuliko voittoa? "} value={status} />
            <GameStatusText text={"Voitit"} value={winScore} />
            <GameStatusText text={"Seuraava voitto on päässä"} value={nextClicks} />
            </>
          }
          {score <= 0 &&
            <>
            <GameStatusText text={"Voi Voi! Peli loppui! Haluatko yrittää uudelleen? Paina nappia!"} value={""}/>
            </>
          }
        </GameStatus>
        </>
      }
    </div>
  ) 
}



export default App;
