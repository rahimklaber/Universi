module.exports.game = function (id) {
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

module.exports.player = function (socket) {
	this.socket = socket
	this.color = null
	this.turn = false
	this.moves = 0
	this.pieces = 2
	this.winnner = false
	this.name = null
}

module.exports.checkmove = function (game, x, y, playernr) { //x,y ; the x y coordinates of the tile that has been clicked
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

}

module.exports.valid_move = valid_move
module.exports.move_possible = move_possible
function valid_move(game, x, y){
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
			if (game.board[tempx][tempy] != player.color && game.board[tempx][tempy] != 0) {
				takeover = true
			} else if (game.board[tempx][tempy] == player.color) {
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


function move_possible(game,color){
	for(let y = 0;y<8;y++){
		for(let x = 0;x<8;x++){
			if (checkmove(x,y)) return true
		}
	}

}