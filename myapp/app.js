var express = require("express");
var http = require("http");

app.get("/", function(req, res) {
    res.render('/splash')
});


var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);