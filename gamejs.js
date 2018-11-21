$(document).ready(function(){
    generateBoard();
    draw();
})

function generateBoard(){
    for(var i=0;i<8; i++){
        $("#board-table").append("<tr id=row"+i+""+"><tr")
        for(var j=0;j<8;j++){
            $("#row"+i).append("<td id=cell_"+i+""+j+"></td>")
            $("#cell_"+i+""+j).append("<canvas height=100% onclick=handleclick(i,j) onhover=handlehover(i,j) width =100% id=canv_"+i+""+j+"></canvas>")
        }
    }
}
function draw(){
    for(var i=0;i<8; i++){
        for(var j=0;j<8;j++){
            var canvas = $("#canv_"+i+""+j)[0]
            var ctx = canvas.getContext("2d")
            console.log(ctx)
            ctx.fillStyle="green"
            ctx.fillRect(0,0,100,100)
        }
    }
}