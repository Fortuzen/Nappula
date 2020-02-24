let express = require("express");
let app = express();

const path = require('path');

let bodyparser = require("body-parser");
let cors = require("cors");

let jwt = require("jsonwebtoken");
let uniqid = require("uniqid");


app.use(cors());
app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(bodyparser.json());

let users = {};
let score = 0;

const DEFAULT_SCORE = 20;
const SECRET_KEY = "Secret";



// TODO: dont trust client header
app.post("/requestScore", (req, res)=>{
    //console.log(req.headers);
    //console.log(req.body);
    const token = req.headers.authorization.split(" ")[1];
    console.log("rS:" + token);  
    if(!token) {
        // No token, create one
        console.log("No token");
        data = createUser();
        res.send(data);
    } else {

        console.log("Token detected");
        try {
            let verifiedMessage = jwt.verify(token, SECRET_KEY);
            console.log(verifiedMessage);
            const userId = verifiedMessage._id;
            const user = users[userId];
            res.send({score: user.score, token: token});
        } catch(err) {
            console.log("Token invalid");
            data = createUser();
            res.send(data);
        }
    }
});

app.post("/spendScore", (req, res) => {
    let token = req.headers.authorization;
    console.log("sS: "+ token);
    if(token) {
        // Bad
        token = token.split(" ")[1];
        console.log(token);
        try {
            let verifiedMessage = jwt.verify(token, SECRET_KEY);
            console.log(verifiedMessage);
            const userId = verifiedMessage._id;
            const user = users[userId];
            console.log(user);

            let status = "";
            let winAmount = 0;

            if (user.score > 0) {
                user.score -= 1;
                score += 1;
                winAmount = determineWin(score);
                user.score += winAmount;
                status = winAmount > 0 ? "Win" : "Lose";

                if(user.score <= 0) {
                    status = "Gameover";
                    winAmount = score;
                }
            }

            
            console.log("Total score " + score);                      
            res.send({score: user.score, status: {state: status, score: winAmount}});

        } catch(err) {
            console.log("Error");
            res.send("Error");
        }

    } else {
        res.send("Error. No token");
    }

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/front/build/index.html'));
  });

function createUser() {
    const userId = uniqid();
    const newToken = jwt.sign({_id: userId}, SECRET_KEY);
    users[userId] = {score: DEFAULT_SCORE, token: newToken};
  
    data = {score: users[userId].score, token: users[userId].token};
    console.log(userId);
    console.log(newToken);
    return data;
}

function determineWin(s) {
    if(s <= 0) {
        return 0;
    }

    if (s % 500 === 0) {
        return 250;
    } else if(s % 100 == 0) {
        return 40;
    } else if(s % 10 == 0) {
        return 5;
    } else {
        return 0;
    }
}

app.listen(process.env.PORT || 3001 , () => {
    console.log("Server start 3001");
});


