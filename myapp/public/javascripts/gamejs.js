function Game(id) {
    this.id = id;
    this.player1 = null;
    this.player2 = null;
    this.gamestate = 0; // 0 -- not started 1  -- ongoing 2 -- ended
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

function Player() {}
var player = new Object()
player.color = 1;
var game = new Game(1);
var board = game.board;

function checkmove(game, x, y) { //x,y ; the x y coordinates of the tile that has been clicked
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
    for (let i = 0; i < directions.length; i++) {
        tempboard = JSON.parse(JSON.stringify(game.board))
        tempboard[y][x] = player.color
        tempx = x
        tempy = y
        // console.log("tempx "+tempx)
        // console.log("tempy  "+tempy)
        while (true) {
            tempx += directions[i][1]
            tempy += directions[i][0]
            console.log("tempy  " + tempy)
            console.log("tempx  " + tempx)
            if (tempx > 7 || tempy > 7) {
                break
            }
            if (game.board[tempy][tempx] != player.color && game.board[tempy][tempx] != 0) {
                tempboard[tempy][tempx] = player.color
                console.table(tempboard)
            } else if (game.board[tempy][tempx] == player.color) {
                game.board = tempboard
                break
            } else {
                break
            }
        }
    }
    board = game.board
}



$(document).ready(function () {
    generateBoard();
    draw();
})

function generateBoard() {
    for (var i = 0; i < 8; i++) {
        $("#board-table").append("<tr id=row" + i + "" + "><tr")
        for (var j = 0; j < 8; j++) {
            $("#row" + i).append("<td id=cell_" + j + "" + i + "></td>")
            $("#cell_" + j + "" + i).append("<canvas height=100% onclick=handleclick(" + j + "," + i + ") onmouseover=handlehover(i,j) width =100% id=canv_" + j + "" + i + "></canvas>")
        }
    }
}

function draw() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var canvas = $("#canv_" + j + "" + i)[0]
            var ctx = canvas.getContext("2d")
            if (board[i][j] == 1) {
                ctx.fillStyle = "green"
                ctx.fillRect(0, 0, 100, 100)
                ctx.beginPath()
                ctx.fillStyle = "white"
                ctx.arc(50, 50, 50, 0, 2 * Math.PI)
                ctx.fill()
            } else if (board[i][j] == 2) {
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
    checkmove(game, x, y)
    draw()
    // var canvas = $("#canv_"+x+""+y)[0]
    // var ctx = canvas.getContext("2d")
    // ctx.beginPath()
    // ctx.fillStyle="black"
    // ctx.arc(50,50,50,0,2*Math.PI)
    // ctx.fill()
}