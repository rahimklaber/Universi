var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/splash', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});

/* After the user clicks on Play */
router.get("/play", function(req, res) {
  res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
