var name
var first_time
var socket = new WebSocket("ws://192.168.0.199:80")
var game
var playernr
var otherplayernr
var minutes = 0;
var seconds = 0;


socket.onopen = function (event) {
	generateBoard()
	// change the messages received for mat to {type:" ", game}
	socket.onmessage = function (event) {
		let data = JSON.parse(event.data)
		switch (data.message) {
			case "name-invalid":{
				setName("name allready taken, enter new name")
				socket.send(JSON.stringify({
					first_time : first_time,
					message: "name",
					name: name,
					id: data.id,
					playernr: playernr
				}))

			}
			case "name":
				setName("enter a screen ")
				playernr = data.playernr
				otherplayernr = 3 - playernr
				socket.send(JSON.stringify({
					first_time : first_time,
					message: "name",
					name: name,
					id: data.id,
					playernr: playernr
				}))
				break
			case "game-start":
				console.log("start")
				Timer();
				playercolor();
				game = data.game
				$("#players").html(getPlayer(playernr).name + "(you) vs " + getPlayer(otherplayernr).name)
				if (getPlayer(playernr).turn) $("#turn").html("your turn")
				else $("#turn").html(getPlayer(otherplayernr).name + "'s turn")
				draw()
				pieces();
				break
			case "game-move":
				game = data.game
				if (getPlayer(playernr).turn) $("#turn").html("your turn")
				else $("#turn").html(getPlayer(otherplayernr).name + "'s turn")
				draw()
				pieces();
				break
			case "move-skip":
				game = data.game
				if (data.playernr == playernr) $("#turn").html(getPlayer(otherplayernr).name + "'s turn, you had no moves available")
				else $("#turn").html("your turn," + getPlayer(otherplayernr).name + " had no moves available")
				draw()
				pieces();
				break
			case "nomove-end":
				clearTimeout(timer);
				game = data.game
				if (getPlayer(playernr).winner) $("#turn").html("you win, there are no more moves available")
				else $("#turn").html("you lose, there are no more moves available")
				draw()
				pieces();
				break
			case "nomove-tie":
				clearTimeout(timer);
				game = data.game
				$("#turn").html("it's a tie, there are no more moves available")
				draw()
				pieces();
				break
			case "game-end":
				console.log("end")
				clearTimeout(timer);
				game = data.game
				if (getPlayer(playernr).winner) $("#turn").html("you win")
				else $("#turn").html("you lose")
				draw()
				pieces();
				break
			case "game-tie":
				clearTimeout(timer);
				game = data.game
				$("#turn").html("it's a tie")
				draw()
				pieces();
				break
			case "aborted":
				pieces();
				clearTimeout(timer);
				$("#turn").html("the other player has aborted")
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
			$("#cell_" + x + "" + y).append("<canvas  onclick=handleclick(" + x + "," + y + ") onmouseover=handlehover(" + x + "," + y + ")  id=canv_" + x + "" + y + "></canvas>")
		}
	}
}

function draw() {
	var size = $('#board-table').height();
	console.log(size)
	var square = (1 / 8) * size;
	console.log(square)
	var half = (1 / 2) * square;
	console.log(half)
	for (var y = 0; y < 8; y++) {
		for (var x = 0; x < 8; x++) {
			var canvas = $("#canv_" + x + "" + y)[0]
			canvas.setAttribute('width', square);
			canvas.setAttribute('height', square);
			var ctx = canvas.getContext("2d")
			if (game.board[x][y] == 1) {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, square, square)
				ctx.beginPath()
				ctx.fillStyle = "white"
				ctx.arc(half, half, half, 0, 2 * Math.PI)
				ctx.fill()
			} else if (game.board[x][y] == 2) {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, square, square)
				ctx.beginPath()
				ctx.fillStyle = "black"
				ctx.arc(half, half, half, 0, 2 * Math.PI)
				ctx.fill()
			} else {
				ctx.fillStyle = "green"
				ctx.fillRect(0, 0, square, square)
			}
		}
	}
}

function handleclick(x, y) {
	if (socket.readyState == 3) return
	if (game == null) return alert("waiting for second player")
	if (getPlayer(playernr).turn == true) {
		if (!gameex.valid_move(game, x, y, playernr)) return alert("invalid move")
		socket.send(JSON.stringify([game.id, [x, y], playernr]))
	} else {
		alert("not ur turn")
	}
}

function handlehover(x, y) {
	// $("#cell_" + x + "" + y + "").effect("highlight",{color : "white"},100)
}

function Timer() {
	timer = setTimeout(function () {
		seconds++;
		if (seconds > 59) {
			seconds = 0;
			minutes++;

			if (minutes < 10) {
				$('#minutes').text('0' + minutes + ':');
			} else $('#minutes').text(minutes + ':');
		}

		if (seconds < 10) {
			$('#seconds').text('0' + seconds);
		} else {
			$('#seconds').text(seconds);
		}
		Timer();
	}, 1000);
}

function playercolor() {
	if (playernr == 1) {
		$('#player_color').text('Your color is white');
	} else $('#player_color').text('Your color is black');
}

function forfeit_button() {
	if (socket.readyState == 3) {
		alert("The game is over or you forfeitted. Please click the home button to go back to the homescreen.");
	} else
		var r = confirm("Are you sure you want to forfeit?");
	if (r == true) {
		console.log("Closing socket");
		socket.close();
		clearTimeout(timer);
		$('#turn').text("You forfeitted the game.");
	} else {
		console.log("Nothing");
	}
};

function home_button() {
	if (socket.readyState == 3) {
		document.location.href = "/";
	} else
		alert("The game is still going on. You can only go to the homescreen if the game is over, or if you forfeit the ongoing game.");
};

function pieces() {
	var count = gameex.count_pieces(game);
	if (playernr == 1) {
		var first = getPlayer(playernr).name;
		var second = getPlayer(otherplayernr).name;
	} else {
		var second = getPlayer(playernr).name;
		var first = getPlayer(otherplayernr).name;
	}
	$('#player1_pieces').text(first + ' pieces: ' + count[0]);
	$('#player2_pieces').text(second + ' pieces: ' + count[1]);
}

function setName(message) {
	console.log(document.cookie.length)
	if (document.cookie.length == 0) {
		first_time = true
		name = prompt(message)
		document.cookie = "name=" + name + "; max-age=" +1000000000
		document.cookie = "times_accessed=1; max-age=" + 1000000000
	} else {
		first_time=false
		let cookie = document.cookie.split(";")
		name = cookie[0].split("=")[1]
		let times_accessed = parseInt(cookie[1].split("=")[1], 10) + 1
		document.cookie = "name=" + name + ";max-age=" + 1000000000
		document.cookie = "times_accessed=" + times_accessed + ";max-age=" + 1000000000

	}
}