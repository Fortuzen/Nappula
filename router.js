const express = require("express");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

const game = require("./Game.js");

const router = express.Router()

router.use(handleAuth)

function handleAuth(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    console.log("MAuth:" + token);
    if(!token) {
        // No token, create one
        console.log("No token. Create new id.");
        data = game.createUser();
        res.send(data);        
    } else {
        console.log("Token detected");
        try {
            let verifiedMessage = jwt.verify(token, process.env.SECRET);
            console.log(verifiedMessage);
            const userId = verifiedMessage._id;
            const user = game.users[userId];
            if(user) {
                res.locals.user = user;
                next();
            } else {
                console.log("No user. Create new id.");    
                data = game.createUser();
                res.send(data);
            }
        } catch(err) {
            console.log(err);
            console.log("Token invalid. Create new id.");    
            data = game.createUser();
            res.send(data);
        }
    }
}

// TODO: dont trust client header
// Send user their current score or create a new identity if
// it does not exist
router.post("/requestScore", (req, res) => {
    //console.log(req.headers);
    //console.log(req.body);
    const user = res.locals.user;
    console.log(user);
    const token = res.locals.user.token;
    console.log("rS:" + token);
    res.send({score: user.score, token: token});
 
});

// Allow user to spend and win points.
// Send user the following: score, status, points won, clicks to next win.
router.post("/spendScore", (req, res) => {
    const user = res.locals.user;

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


    
});

module.exports = router;