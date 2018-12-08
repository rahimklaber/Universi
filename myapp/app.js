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
var getOngoingGames = require("./public/javascripts/game").getOngoingGames
var gameStats = require("./public/javascripts/game").gameStats
var leaderboardsEntry = require("./public/javascripts/game").leaderboardsEntry
// var getLeaderboards =

var port = process.argv[2]
var app = express()
var games = []
var gamesCompleted = new Object()
gamesCompleted.nr = 0
var users = new Object()
//todo add routes x
app.use(express.static(__dirname + "/public"))
var server = http.createServer(app)
const wss = new websocket.Server({
	server
})

app.get("/", function (req, res) {
	let stats = new gameStats(games,gamesCompleted,users)
	console.log(stats)
	res.sendFile("splash.html", {
		root: "./public"
	})
})

app.get("/play", function (req, res) {
	res.sendFile("game.html", {
		root: "./public"
	})
})

var id = 0
wss.on("connection", function (ws) {
	ws.on("close", function () {
		let id = getGameWithIdWs(games, ws)
		if(id == -1) return
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
				games[data.id].player1.name = data.name
				users[data.name] = new leaderboardsEntry(data.name)
			} else {
				games[data.id].player2.name = data.name
				users[data.name] = new leaderboardsEntry(data.name)
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
		if (!checkmove(games,games[id], x, y, playernr,users,gamesCompleted)) {// if checkmove has not sent any messages

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
		if(typeof(games[i])=='undefined') continue
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