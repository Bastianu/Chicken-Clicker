// Replace "getElementById" --> "getElementByClassName"

window.addEventListener("load", function (event) {
    displayButtons()
})

window.addEventListener("resize",function(event){
    displayButtons()
})

function showShop() {
    for (let element of document.getElementsByClassName("hideWhenPhone")){
        element.hidden = true
    }
    document.getElementById("shop").hidden = false;
    document.getElementById("main").hidden = true
}

function showBoost() {
    for (let element of document.getElementsByClassName("hideWhenPhone")){
        element.hidden = true
    }
    document.getElementById("boost").hidden = false;
    document.getElementById("main").hidden = true
}

function showRewards() {
    for (let element of document.getElementsByClassName("hideWhenPhone")){
        element.hidden = true
    }
    document.getElementById("rewards").hidden = false;
    //document.getElementById("main2").hidden = true
    //document.getElementById("main2").style.transform = "scale(0)"
    //document.getElementById("main2").style.translate = ""
}

function backToGame(){
    document.getElementById("main").hidden = false;
    document.getElementById("main2").hidden = false;
    for (let element of document.getElementsByClassName("hideWhenPhone")){
        element.hidden = true
    }
}

function displayButtons(){
    if (screen.width >= 768) {
        for (let element of document.getElementsByClassName("showBtn")){
            element.hidden = true
        }
        for (let element of document.getElementsByClassName("hideWhenPhone")){
            element.hidden = false
        }
        document.getElementById("main").hidden = false;
        document.getElementById("main2").hidden = false;
        for (let element of document.getElementsByClassName("back")){
            element.hidden = true
        }

        document.getElementById("chickenButton").removeAttribute("width")
        displaySaveLoadBtnFull()
    }
    else{
        for (let element of document.getElementsByClassName("showBtn")){
            element.hidden = false
        }
        for (let element of document.getElementsByClassName("hideWhenPhone")){
            element.hidden = true
        }
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