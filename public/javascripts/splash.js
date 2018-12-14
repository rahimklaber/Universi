$("#how-to")[0].style.display = "none"
$("#how-but").on("click", function () {
    var x = $("#how-to")[0]
    if (x.style.display == "none") {
        x.style.display = "block"
        console.log('1')
    } else {
        console.log(2)
        x.style.display = "none"
    }
})