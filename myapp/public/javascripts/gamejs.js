var name = prompt("enter a name")
var socket = new WebSocket("ws://localhost:80")
var game
var playernr
var otherplayernr
socket.onopen = function (event) {
	generateBoard()
	// change the messages received for mat to {type:" ", game}
	socket.onmessage = function (event) {
		let data = JSON.parse(event.data)
		switch (data.message) {
			case "name":
				playernr = data.playernr
				socket.send(JSON.stringify({message: "name", name: name, id: data.id, playernr: playernr}))
				break
			case "game-start":
				console.log("start")
				game = data.game
				$("#players").html(getPlayer(playernr).name+"(you) vs "+getPlayer(otherplayernr).name)
				draw()
				break
			case "game-move":
				game = data.game
				draw()
				break
			default:
				break
		}
		// if (typeof (data[0]) != "undefined") {
		// 	game = data[0]
		// 	playernr = data[1]
		// 	if(game.player2 == null){
		// 		game.player1.name = name
		// 	}else{
		// 		game.player2.name = name
		// 	}
		// } else {
		// 	game = data
		// }
		// draw()
	}
}

function getPlayer(playernr) {
	if (playernr == 1) {
		return game.player1
	} else {
		return game.player2
	}
}

function generateBoard() {
	for (var y = 0; y < 8; y++) {
		$("#board-table").append("<tr id=row" + y + "" + "><tr")
		for (var x = 0; x < 8; x++) {
			$("#row" + y).append("<td id=cell_" + x + "" + y + "></td>")
			$("#cell_" + x + "" + y).append("<canvas height=100% onclick=handleclick(" + x + "," + y + ") onmouseover=handlehover(" + x + "," + y + ") width =100% id=canv_" + x + "" + y + "></canvas>")
		}
	}
}

function draw() {
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			var canvas = $("#canv_" + x + "" + y)[0]
			var ctx = canvas.getContext("2d")
			if (game.board[x][y] == 1) {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, 100, 100)
				ctx.beginPath()
				ctx.fillStyle = "white"
				ctx.arc(50, 50, 50, 0, 2 * Math.PI)
				ctx.fill()
			} else if (game.board[x][y] == 2) {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, 100, 100)
				ctx.beginPath()
				ctx.fillStyle = "black"
				ctx.arc(50, 50, 50, 0, 2 * Math.PI)
				ctx.fill()
			} else {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, 100, 100)
			}
		}
	}
}

function handleclick(x, y) {
	if (game == null) return alert("waiting for second player")
	if (game.board[x][y] !== 0) return alert("learn how to play the game dumbass")
	if (getPlayer(playernr).turn == true) {
		socket.send(JSON.stringify([game.id, [x, y], playernr]))
	} else {
		alert("not ur turn")
	}
}

function handlehover(x, y){
	// $("#cell_" + x + "" + y + "").effect("highlight",{color : "white"},100)
}