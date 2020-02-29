const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");

/*
    Game and all game state related
*/

class Game {
    static DEFAULT_POINTS = 20;
    static users = {};
    static points = 0;

    static createUser() {
        console.log("Create new user");
        const userId = uniqid();
        const newToken = jwt.sign({_id: userId}, process.env.SECRET);
        Game.users[userId] = {points: Game.DEFAULT_POINTS, token: newToken};
  
        let data = {points: Game.users[userId].points, token: Game.users[userId].token};
        console.log(data);

        return data;
    }

    static calculatePointsWon(p) {
        if(p <= 0) {
            return 0;
        }
    
        if (p % 500 === 0) {
            return 250;
        } else if(p % 100 === 0) {
            return 40;
        } else if(p % 10 === 0) {
            return 5;
        } else {
            return 0;
        }
    }
    
    static pointsToNextWin(currentPoints) {
        const rounded = Math.ceil(currentPoints / 10) * 10;
        const points = rounded - currentPoints;
        // Dont send number zero
        return points == 0 ? 10 : points;
    }
}

module.exports = Game;