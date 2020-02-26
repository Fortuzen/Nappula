const express = require("express");
const router = express.Router()

const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

const game = require("./Game.js");

// TODO: dont trust client header
router.post("/requestScore", (req, res)=>{
    //console.log(req.headers);
    //console.log(req.body);
    const token = req.headers.authorization.split(" ")[1];
    console.log("rS:" + token);  
    if(!token) {
        // No token, create one
        console.log("No token");
        data = game.createUser();
        res.send(data);
    } else {
        console.log("Token detected");
        try {
            let verifiedMessage = jwt.verify(token, process.env.SECRET);
            console.log(verifiedMessage);
            const userId = verifiedMessage._id;
            const user = game.users[userId];
            res.send({score: user.score, token: token});
        } catch(err) {
            console.log("Token invalid");
            data = game.createUser();
            res.send(data);
        }
    }
});

router.post("/spendScore", (req, res) => {
    let token = req.headers.authorization;
    console.log("/spendScore");
    console.log("sS: "+ token);
    if(!token) {
        res.status(401);
    }
    // Bad
    token = token.split(" ")[1];
    try {
        let verifiedMessage = jwt.verify(token, process.env.SECRET);           
        const userId = verifiedMessage._id;
        const user = game.users[userId];
        console.log(verifiedMessage);
        console.log(user);

        let status = "";
        let winAmount = 0;
        let clicksToNext = 0;

        if (user.score > 0) {
            user.score -= 1;
            game.score += 1;
            winAmount = game.determineWin(game.score);
            user.score += winAmount;
            status = winAmount > 0 ? "Win" : "Lose";
            clicksToNext = game.countClicksToNextWin(game.score);

            if(user.score <= 0) {
                status = "Gameover";
                winAmount = game.score;
            }
        }     
        console.log("Total score " + game.score);                      
        res.send({score: user.score, status: {state: status, score: winAmount}, clicksToNext: clicksToNext});

    } catch(err) {
        console.log("Error");
        res.status(401);
    }
    
});

module.exports = router;