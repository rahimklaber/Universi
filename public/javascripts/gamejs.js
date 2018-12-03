var socket = new WebSocket("ws://localhost:80")
var game
var playernr
socket.onmessage = function (event) {
	let data = JSON.parse(event.data)
	if (typeof (data[0]) != "undefined") {
		game = data[0]
		playernr = data[1]
	}else{
		game = data
	}
	draw()
}
$(document).ready(function () {
	generateBoard()
})

function getPlayer() {
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
			$("#cell_" + x + "" + y).append("<canvas height=100% onclick=handleclick(" + x + "," + y + ") onmouseover=handlehover(i,j) width =100% id=canv_" + x + "" + y + "></canvas>")
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
	if(game.board[x][y] !== 0){
		alert("learn how to play the game dumbass")
		return
	}
	if (getPlayer().turn == true) {
		socket.send(JSON.stringify([game.id, [x, y],playernr]))
	} else {
		alert("not ur turn")
	}
}