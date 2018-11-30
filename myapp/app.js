var express = require("express");
var http = require("http");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/splash", function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
    res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
