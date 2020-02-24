import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6


import logo from './logo.svg';
import './App.css';


class Button extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = props.onClick;
  }

  render() {
    return(
      <div>
      {/*<button onClick={() => this.onClick()}>{this.props.text}</button>*/}

      <div id="button-container" onClick={() => this.onClick()}>       
        <div id="button-top" className={this.props.topColor}></div>
        <div id="button-bottom"></div>
      </div>

      </div>
    )
  }


}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {score: 0, status: "", winAmount: 0, buttonDisabled: true};

    this.buttonColor = "red";
    this.handleButtonPress = this.handleButtonPress.bind(this);

  }

  handleButtonPress() {
    this.state.score <= 0 ? this.resetGame() : this.spendScore();
  }

  render() {

    const buttonColor = this.state.score <= 0 ? "green" : "red";
      
    return (
      <div className="App">
        {/*<button onClick={()=>this.spendScore()} disabled={this.state.buttonDisabled}>Pay</button>*/}
        <h1>Nappula</h1>
        <Button onClick={this.handleButtonPress} text="Spend points" topColor={buttonColor}/>
        {this.state.score > 0 &&
        <div>
          <p>Sinun saldo {this.state.score}</p>
          <p>Tuliko voittoa? {this.state.status}</p>
          <p>Voitit {this.state.winAmount}</p>
        </div>
        }

        {this.state.score <= 0 &&
          <div>
            <p>Voi Voi! Pisteet loppu!</p>
          </div>
        }
        {this.state.status === "Gameover" &&
         <p>Pelin pistetilanne {this.state.winAmount}</p> 
        }
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
    console.log(token);
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
        console.log(res);
        return res.json();
      }   
    }).then(data =>{
      console.log(data);
      window.localStorage.token = data.token;
      this.setState({score: data.score, buttonDisabled: false});
    });
  }

  spendScore() {
    console.log("Score spend stuff");
    let token = window.localStorage.token;
    console.log(token);
    let url = "/spendScore";

    //this.setState({buttonDisabled: true});

    fetch(url, {
      method: 'POST', mode: "cors", credentials: "same-origin",
      headers: {
        "Authorization": "Bearer "+token,
        "Content-Type" : "application/json"
      },
    })
    .then( (res)=>{
      if(!res.ok) {
        throw Error(res.statusText);
      } else {
        console.log(res);
        return res.json();
    }})
    .then(data =>{  
      console.log(data);
      this.setState({score: data.score, status: data.status.state, winAmount: data.status.score, buttonDisabled: false});

    });    
  }

}

export default App;
