var express = require("express")
var http = require("http")
var websocket = require("ws")
var game = require("./game").game
var player = require("./game").player
var checkmove = require("./game").checkmove
// var port = process.argv[2]
var port = "80"
var app = express()
var games = []

app.use(express.static(__dirname + "/public"))
var server = http.createServer(app)
const wss = new websocket.Server({
	server
})

app.get("/", function (req, res) {
	res.sendFile("splash.html", {
		root: "./public"
	})
})

var id = 0
wss.on("connection", function (ws) {

	ws.on("message", function (message) {

		let data = JSON.parse(message)
		let id = data[0]
		let x = data[1][0]
		let y = data[1][1]
		let playernr = data[2]
		checkmove(games[id], x, y, playernr)
		games[id].player1.socket.send(JSON.stringify(games[id]))
		games[id].player2.socket.send(JSON.stringify(games[id]))

	})

	for (let i = 0; i < games.length; i++) {
		if (games[i].player2 == null) {

			games[i].player2 = new player(ws)
			games[i].player2.color = 2
			games[i].player2.socket.send(JSON.stringify([games[i],2]))
			return
		}
	}

	var newgame = new game(id++)
	newgame.player1 = new player(ws)
	newgame.player1.color = 1
	newgame.player1.turn = true
	newgame.player1.socket.send(JSON.stringify([newgame,1]))
	games.push(newgame)


})



server.listen(port)