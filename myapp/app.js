var express = require("express");
var http = require("http");

app.get("/test", function(req, res) {
    res.render('splash.html')
});


var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);