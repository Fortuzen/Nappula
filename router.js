const express = require("express");
const jwt = require("jsonwebtoken");

const game = require("./Game.js");
const router = express.Router()

/*
    Handle game related requests
*/

// Use token handling middleware
router.use(handleAuth)

function getTokenFromHeader(headers) {
    if(headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
        return headers.authorization.split(" ")[1];
    }
    return null;
}

// Verify user's token or create a new user
function handleAuth(req, res, next) {
    const token = getTokenFromHeader(req.headers);
    //console.log("R_Auth:" + token);
    if(!token) {
        // No token, create one
        console.log("No token. Create new id.");
        data = game.createUser();
        res.send(data);        
    } else {
        console.log("Token detected");
        try {
            let verifiedMessage = jwt.verify(token, process.env.SECRET);
            //console.log(verifiedMessage);
            const userId = verifiedMessage._id;
            const user = game.users[userId];
            if(user) {
                res.locals.user = user;
                next();
            } else {
                console.log("Not current user. Create new id.");
                delete game.users[userId];
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

// Send user their current points
router.post("/requestPoints", (req, res) => {
    const user = res.locals.user;
    //console.log(user);
    const token = res.locals.user.token;
    res.send({points: user.points, token: token});
 
});

// Spend user's points.
// Send user the following: points, points won, points to next win
router.post("/spendPoints", (req, res) => {
    const user = res.locals.user;

    let winAmount = 0;
    let pointsToNext = 0;

    if (user.points > 0) {
        user.points -= 1;
        game.points += 1;
        winAmount = game.calculatePointsWon(game.points);
        user.points += winAmount;
        pointsToNext = game.pointsToNextWin(game.points);
    }  
   
    console.log("Total points " + game.points);                      
    res.send({points: user.points, pointsWon: winAmount, pointsToNextWin: pointsToNext});


    
});

module.exports = router;