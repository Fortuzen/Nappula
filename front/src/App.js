import React from 'react';
import useState from "react";
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import {motion} from "framer-motion"

import './App.css';

const TestAnim = () => <motion.div initial={{opacity: 0}} animate={{rotate: 360}} transition={{ duration: 0.5 }}/>;

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = props.onClick;
  }

  render() {
    return(
      <>
      {/*<button onClick={() => this.onClick()}>{this.props.text}</button>*/}
      
        <div id="button-container" onClick={() => this.onClick()}>     
          <motion.div whileTap={{ y: 30 }} id="button-top" className={this.props.topColor} />      
          <div id="button-bottom"></div>
          
        </div>
      
      </>
    )
  }
}

const GameStatus = (props) => {
  const score = props.score;
  const status = props.status;
  const winAmount = props.winAmount;
  const clicks = props.clicksToNext;

  return(
    <div>
      {score > 0 && 
        <>
          Saldosi on {score} <br/>
          Tuliko voittoa? {status} <br/>
          Voitit {winAmount} <br/>
          Seuraavaan {clicks} <br/>     
        </>
      }
      {score <= 0 &&
        <>
          Voi Voi! Pisteet loppu! Saat uuden mahdollisuuden painamalla nappia! <br/>
          Pelin pistetilanne {winAmount} <br/>
        </>
      }        
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {score: 0,  winAmount: 0, clicksToNext: 0,
                    status: "",
                    canPressButton: false};

    this.buttonColor = "red";
    this.handleButtonPress = this.handleButtonPress.bind(this);

  }

  handleButtonPress() {
    if(this.state.canPressButton) {
      this.setState({canPressButton: false});
      this.state.score <= 0 ? this.resetGame() : this.spendScore();
    }
  }

  render() {

    const buttonColor = this.state.score <= 0 ? "green" : "red";
      
    return (
      <div className="App">
        <h1>Nappula</h1>
        <Button onClick={this.handleButtonPress} text="Spend points" topColor={buttonColor}/>   
        <GameStatus score={this.state.score} status={this.state.status} winAmount={this.state.winAmount} clicksToNext={this.state.clicksToNext} />
      </div>
    );    
  }

  componentDidMount() {
    this.getScore();
  }

  resetGame() {
    console.log("Reset");
    window.localStorage.token = "";
    this.setState({score: 0, status: "", winAmount: 0});
    this.getScore();
  }

  getScore() {
    console.log("Get score");
    let token = window.localStorage.token;
    let url = "/requestScore";

    fetch(url, {
      method: 'POST', mode: "cors", credentials: "same-origin",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type" : "application/json"
      },
    }).then( (res)=>{
      if(!res.ok) {
        throw Error(res.statusText);
      } else {
        return res.json();
      }   
    }).then(data =>{
      console.log(data);
      window.localStorage.token = data.token;
      this.setState({score: data.score, canPressButton: true});
    });
  }

  spendScore() {
    console.log("Score spend stuff");
    let token = window.localStorage.token;
    let url = "/spendScore";

    //this.setState({buttonDisabled: true});

    fetch(url, {
      method: 'POST', mode: "cors", credentials: "same-origin",
      headers: {
        "Authorization": "Bearer "+token,
        "Content-Type" : "application/json"
      },
    }).then( (res)=>{
      if(!res.ok) {
        throw Error(res.statusText);
      } else {
        return res.json();
      }
    }).then(data =>{  
      console.log(data);
      this.setState({score: data.score, status: data.status.state, winAmount: data.status.score, canPressButton: true, clicksToNext: data.clicksToNext});
    });    
  }

}



export default App;
