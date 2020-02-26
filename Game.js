const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");

class Game {
    static DEFAULT_SCORE = 20;
    static users = {};
    static score = 0;

    static createUser() {
        console.log("Create new user");
        const userId = uniqid();
        const newToken = jwt.sign({_id: userId}, process.env.SECRET);
        Game.users[userId] = {score: Game.DEFAULT_SCORE, token: newToken};
       
        let data = {score: Game.users[userId].score, token: Game.users[userId].token};
        console.log(data);

        return data;
    }

    static determineWin(s) {
        if(s <= 0) {
            return 0;
        }
    
        if (s % 500 === 0) {
            return 250;
        } else if(s % 100 === 0) {
            return 40;
        } else if(s % 10 === 0) {
            return 5;
        } else {
            return 0;
        }
    }
    
    static countClicksToNextWin(currentScore) {
        let rounded = Math.ceil(currentScore / 10) * 10;
        return rounded - currentScore;
    }
}

module.exports = Game;