window.addEventListener("load", function (event) {
    displayButtons()
})

window.addEventListener("resize",function(event){
    displayButtons()
})

function showShop() {
    document.getElementById("shop").hidden = false;
    document.getElementById("rewards").hidden = true
    document.getElementById("boost").hidden = true
    document.getElementById("main").hidden = true
}

function showBoost() {
    document.getElementById("boost").hidden = false;
    document.getElementById("shop").hidden = true
    document.getElementById("rewards").hidden = true
    document.getElementById("main").hidden = true
}

function showRewards() {
    document.getElementById("rewards").hidden = false;
    document.getElementById("boost").hidden = true
    document.getElementById("shop").hidden = true
    document.getElementById("main2").hidden = true
}

function backToGame(){
    document.getElementById("main").hidden = false;
    document.getElementById("main2").hidden = false;
    document.getElementById("boost").hidden = true
    document.getElementById("shop").hidden = true
    document.getElementById("rewards").hidden = true
}

function displayButtons(){
    if (screen.width >= 768) {
        document.getElementById("shopShowBtn").hidden = true
        document.getElementById("boostShowBtn").hidden = true
        document.getElementById("rewardShowBtn").hidden = true
        document.getElementById("shop").hidden = false;
        document.getElementById("boost").hidden = false;
        document.getElementById("rewards").hidden = false;
        document.getElementById("main").hidden = false;
        document.getElementById("main2").hidden = false;
        for (let element of document.getElementsByClassName("back")){
            element.hidden = true
        }

        document.getElementById("chickenButton").removeAttribute("width")
        displaySaveLoadBtnFull()
    }
    else{
        document.getElementById("shopShowBtn").hidden = false
        document.getElementById("boostShowBtn").hidden = false
        document.getElementById("rewardShowBtn").hidden = false
        document.getElementById("shop").hidden = true;
        document.getElementById("boost").hidden = true;
        document.getElementById("rewards").hidden = true;
        for (let element of document.getElementsByClassName("back")){
            element.hidden = false
        }

        document.getElementById("chickenButton").setAttribute("width", "70%")
        displaySaveLoadBtnPhone()
        backToGame()
    }
}

function displaySaveLoadBtnFull(){
    document.getElementById("saveLoadBtnFull").innerHTML = document.getElementById("saveLoadButtons").innerHTML
    document.getElementById("saveLoadBtnPhone").innerHTML = ""
}

function displaySaveLoadBtnPhone(){
    document.getElementById("saveLoadBtnPhone").innerHTML = document.getElementById("saveLoadButtons").innerHTML
    document.getElementById("saveLoadBtnFull").innerHTML = ""
}

if("ontouchstart" in window){
    document.getElementById("clicker").addEventListener("touchend", function (event) {
        this.style.transform = "scale(1)"
    })
    document.getElementById("clicker").addEventListener("touchstart", function (event) {
        this.style.transform = "scale(1.1)"
    })
}
else{
    document.getElementById("clicker").addEventListener("mouseover", function (event) {
        this.style.transform = "scale(1.1)"
    })
    document.getElementById("clicker").addEventListener("mouseleave", function (event) {
        this.style.transform = "scale(1)"
    })
    document.getElementById("clicker").addEventListener("mousedown", function (event) {
        this.style.transform = "scale(1)"
    })
    document.getElementById("clicker").addEventListener("mouseup", function (event) {
        this.style.transform = "scale(1.1)"
    })
}