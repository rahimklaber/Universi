var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/splash", function (req, res) {
    res.sendFile("splash.html", {root: "./myapp"});
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
    res.sendFile("game.html", {root: "./myapp"});
});

module.exports = router;
