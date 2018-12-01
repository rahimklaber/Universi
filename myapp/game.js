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
	this.winnner = false
	this.name
}

module.exports.checkmove = function (game, x, y) { //x,y ; the x y coordinates of the tile that has been clicked
	var player
	if (game.player1.turn == true){
		player = game.player1
		game.player1.turn = false
		game.player2.turn = true
	}else{
		player = game.player2
		game.player2.turn = false
		game.player1.turn = true
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
	for (let i = 0; i < directions.length; i++) {
		tempboard = JSON.parse(JSON.stringify(game.board))
		tempx = x
		tempy = y
		takeover = false
		// console.log("tempx "+tempx)
		// console.log("tempy  "+tempy)
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
				}
				game.board = tempboard
				break
			} else {
				break
			}
		}
	}
}