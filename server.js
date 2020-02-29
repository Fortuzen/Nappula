const dotenv = require('dotenv');
const express = require("express");
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
const cors = require("cors");

const gameRoutes = require("./router.js");

/*
    Server main.
*/

// Load environment variables
dotenv.config();

app.use(cors());
app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'front/build')));

// Enable game api
app.use("/", gameRoutes);

// Direct user to main page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/front/build/index.html'));
});

// Launch server
const port = process.env.PORT || 5000;
app.listen(port , () => {
    console.log("Server start ", port);
});


