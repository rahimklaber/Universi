var express = require("express")
var http = require("http")
var websocket = require("ws")
var game = require("./public/javascripts/game").game
var player = require("./public/javascripts/game").player
var checkmove = require("./public/javascripts/game").checkmove
var valid_move = require("./public/javascripts/game").valid_move
var count_pieces = require("./public/javascripts/game").count_pieces
var move_possible = require("./public/javascripts/game").move_possible
var getGameWithIdWs = require("./public/javascripts/game").getGameIdWithWs
var port = process.argv[2]
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
	ws.on("close", function () {
		let id = getGameWithIdWs(games, ws)

		if (games[id].gamestate == 1) {
			if (games[id].player1.socket == ws) {
				games[id].player2.socket.send(JSON.stringify({
					message: "aborted"
				}))
				games[id].player2.socket.close()
			}else{
				games[id].player1.socket.send(JSON.stringify({
					message: "aborted"
				}))
				games[id].player1.socket.close()
			}

		}
		delete games[id]
	})

	ws.on("message", function (message) {

		let data = JSON.parse(message)

		if (data.message == "name") {
			if (data.playernr == 1) {
				console.log(data.name)
				games[data.id].player1.name = data.name
			} else {
				console.log("start")
				console.log(data.id)
				games[data.id].player2.name = data.name
				games[data.id].gamestate = 1
				games[data.id].player2.socket.send(JSON.stringify({
					game: games[data.id],
					message: "game-start"
				}))
				games[data.id].player1.socket.send(JSON.stringify({
					game: games[data.id],
					message: "game-start"
				}))
			}
			return
		}
		console.log(data)
		let id = data[0]
		let x = data[1][0]
		let y = data[1][1]
		let playernr = data[2]
		if (!checkmove(games,games[id], x, y, playernr)) {

			games[id].player1.socket.send(JSON.stringify({
				game: games[id],
				message: "game-move"
			}))
			games[id].player2.socket.send(JSON.stringify({
				game: games[id],
				message: "game-move"
			}))
		}

	})

	for (let i = 0; i < games.length; i++) {
		if (games[i].player2 == null) {

			games[i].player2 = new player(ws)
			games[i].player2.color = 2
			games[i].player2.socket.send(JSON.stringify({
				id: games[i].id,
				message: "name",
				playernr: 2
			}))
			return
		}
	}

	var newgame = new game(id++)
	newgame.player1 = new player(ws)
	newgame.player1.color = 1
	newgame.player1.turn = true
	newgame.player1.socket.send(JSON.stringify({
		id: newgame.id,
		message: "name",
		playernr: 1
	}))
	// newgame.player1.socket.send(JSON.stringify([newgame,1]))
	games.push(newgame)


})



server.listen(port)