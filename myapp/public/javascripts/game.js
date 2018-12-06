(function (exports) {

	exports.game = function (id) {
		this.id = id
		this.player1 = null
		this.player2 = null
		this.gamestate = 0 // 0 -- not started 1  -- ongoing 2 -- ended
		this.board = [
			[0, 0, 0, 0, 0, 0, 0, 0], //0: green 1: white 2: black
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 2, 0, 0, 0],
			[0, 0, 0, 2, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		]

	}

	exports.player = function (socket) {
		this.socket = socket
		this.color = null
		this.turn = false
		this.moves = 0
		this.pieces = 2
		this.winnner = false
		this.name = null
	}

	exports.checkmove = function (games, game, x, y, playernr) { //x,y ; the x y coordinates of the tile that has been clicked
		var player
		if (playernr == 1) {
			player = game.player1
		} else {
			player = game.player2
		}
		var directions = [
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1]
		]
		var tempx = 0
		var tempy = 0
		var tempboard = JSON.parse(JSON.stringify(game.board))
		var takeover
		var valid = false
		for (let i = 0; i < directions.length; i++) {
			tempboard = JSON.parse(JSON.stringify(game.board))
			tempx = x
			tempy = y
			takeover = false

			while (true) {
				tempx += directions[i][1]
				tempy += directions[i][0]
				if (tempx > 7 || tempy > 7 || tempx < 0 || tempy < 0) {
					break
				}
				if (game.board[tempx][tempy] != player.color && game.board[tempx][tempy] != 0) {
					takeover = true
					tempboard[tempx][tempy] = player.color
				} else if (game.board[tempx][tempy] == player.color) {
					if (takeover == true) {
						tempboard[x][y] = player.color
						valid = true
					}
					game.board = tempboard
					break
				} else {
					break
				}
			}

		}
		if (valid == true) {
			player.moves += 1
			game.player1.turn = !game.player1.turn
			game.player2.turn = !game.player2.turn
		}
		//implement check if there are any more valid moves
		let counts = count_pieces(game)
		if (counts[0] + counts[1] == 64) { //check for game end
			if (counts[0] != counts[1]) {
				if (counts[0] > counts[1]) {
					game.player1.winner = true
				} else {
					game.player2.winner = true
				}
				game.player2.socket.send(JSON.stringify({
					message: "game-end",
					game: game,
				}))
				game.player1.socket.send(JSON.stringify({
					message: "game-end",
					game: game,
				}))
				game.player1.socket.close()
				game.player2.socket.close()
				delete games[game.id]
				return true
			} else {
				game.player1.socket.send(JSON.stringify({
					message: "game-tie",
					game: game,
				}))
				game.player2.socket.send(JSON.stringify({
					message: "game-tie",
					game: game,
				}))
				game.player1.socket.close()
				game.player2.socket.close()
				delete games[game.id]
			}
		}
		var possible1 = false
		var possible2 = false
		if (move_possible(game, 1)) possible1 = true
		if (move_possible(game, 2)) possible2 = true
		if (possible1 && !possible2 && game.player2.turn) {
			game.player1.turn = !game.player1.turn
			game.player2.turn = !game.player2.turn
			game.player1.socket.send(JSON.stringify({
				message: "move-skip",
				game: game,
				playernr: 2 //player that was skipped
			}))
			game.player2.socket.send(JSON.stringify({
				message: "move-skip",
				game: game,
				playernr: 2 //player that was skipped
			}))
			return true
		} else if (!possible1 && possible2 && game.player1.turn) {
			game.player1.turn = !game.player1.turn
			game.player2.turn = !game.player2.turn
			game.player1.socket.send(JSON.stringify({
				message: "move-skip",
				game: game,
				playernr: 1 //player that was skipped
			}))
			game.player2.socket.send(JSON.stringify({
				message: "move-skip",
				game: game,
				playernr: 1 //player that was skipped
			}))
			return true
		} else if (!possible1 && !possible2) {
			if (counts[0] != counts[1]) {
				if (counts[0] > counts[1]) {
					game.player1.winner = true
				} else {
					game.player2.winner = true
				}
				game.player1.socket.send(JSON.stringify({
					message: "nomove-end",
					game: game,
				}))
				game.player2.socket.send(JSON.stringify({
					message: "nomove-end",
					game: game,
				}))
				delete games[game.id]
				game.player1.socket.close()
				game.player2.socket.close()
			} else {
				game.player1.socket.send(JSON.stringify({
					message: "nomove-tie",
					game: game,
				}))
				game.player2.socket.send(JSON.stringify({
					message: "nomove-tie",
					game: game
				}))
				delete games[game.id]
				game.player1.socket.close()
				game.player2.socket.close()
			}
			return true
		}
		return false

	}

	exports.valid_move = valid_move
	function valid_move(game, x, y, color) {
		var directions = [
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1],
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1]
		]
		var tempx = 0
		var tempy = 0
		var takeover
		var valid = false
		if(game.board[x][y] != 0) return false
		for (let i = 0; i < directions.length; i++) {
			tempx = x
			tempy = y
			takeover = false

			while (true) {
				tempx += directions[i][1]
				tempy += directions[i][0]
				if (tempx > 7 || tempy > 7 || tempx < 0 || tempy < 0) {
					break
				}
				if (game.board[tempx][tempy] != color && game.board[tempx][tempy] != 0) {
					takeover = true
				} else if (game.board[tempx][tempy] == color) {
					if (takeover == true) {
						valid = true
						return valid
					}
					break
				} else {
					break
				}
			}

		}
		return valid
	}
	exports.move_possible = move_possible
	 function move_possible(game, color) {
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				if (valid_move(game, x, y, color)) return true
			}
		}

	}


	exports.count_pieces = count_pieces
	 function count_pieces(game) {
		var count1 = 0
		var count2 = 0
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if (game.board[x][y] == 1) {
					count1++
				} else if (game.board[x][y] == 2) {
					count2++
				}
			}
		}
		return [count1, count2]
	}



	exports.getGameIdWithWs = function (games, ws) {
		for (let i = 0; i < games.length; i++) {
			if(typeof(games[i]) == 'undefined')	continue
			if (games[i].player1.socket == ws || games[i].player2.socket == ws ) {
				return i
			}
		}
		return -1
	}

}(typeof exports === 'undefined' ? this.gameex = {} : exports));
