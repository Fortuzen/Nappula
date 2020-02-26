const dotenv = require('dotenv');
const express = require("express");
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
const cors = require("cors");

const gameRoutes = require("./router.js");

dotenv.config();

app.use(cors());
app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'front/build')));

app.use("/", gameRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/front/build/index.html'));
});

app.listen(process.env.PORT || 5000 , () => {
    console.log("Server start 5000");
});


