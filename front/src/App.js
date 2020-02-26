import React, { useState, useEffect } from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import {motion} from "framer-motion"

import fetchers from "./Controller";

import './App.css';


const Button = (props) => {

    return(
      <>    
        <div id="button-container" onClick={props.onClick}>     
          <motion.div whileTap={{ y: 30 }} id="button-top" className={props.topColor} onAnimationComplete={props.onAnimationComplete}/>   
          <div id="button-bottom"></div>
        </div>   
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
  return(
    <div>
      <motion.div
      animate={{ scale: 1.5, rotate: 360 }}
      transition={{ duration: 1.0, flip:Infinity }}
      style={{height: "5em", width: "5em", background: "white", borderRadius: "10px", position: "relative", margin: "5em 5em 5em 5em"}} 
    />
    </div>
  )
}


const App = () => {
  const [score, setScore] = useState(1);
  const [winScore, setWinScore] = useState(0);
  const [nextClicks, setNextClicks] = useState(0);
  const [status, setStatus] = useState("");
  const [buttonUsable, setButtonUsable] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Effect Test");
    fetchers
      .fetchScore()
      .then(data => {
        console.log(data);
        setScore(data.score);
        setButtonUsable(true);
        setIsLoading(false);
      });
  }, []);

  const handleClick = () => {
    console.log("Click", count);
    setCount(count + 1);
    setButtonUsable(false);

    if (score <= 0) {
      setIsLoading(true);
      fetchers
        .fetchReset()
        .then((data)=>{
          setScore(data.score); setWinScore(0); setNextClicks(0); setStatus("");
          setIsLoading(false);
        });
      return;
    }
    
    if(!buttonUsable) {
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
    setButtonUsable(true);
  }


  return (
    <div className="App">
      <h1>Nappula</h1>
      {isLoading &&
        <LoadingIcon/>
      }

      {!isLoading &&
        <>
        <Button onClick={handleClick} topColor={buttonColor()} onAnimationComplete={activateButton}/>
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
