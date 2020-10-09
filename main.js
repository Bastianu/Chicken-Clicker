var egg_Elem = document.getElementById("eggs");
var autoC_Elem = document.getElementById("autoC");

var myAutoClickers = [0,0]; // [0 => 10, 1 => 1, 2 => 0, ...]; // mydata["myAutoClickers"]
var eggs = 0; // mydata["eggs"]
var clics = 0; // mydata["clics"]
var autoClickers = []; // content.json 


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
readTextFile("content.json", function(text){
    autoClickers = JSON.parse(text);
    console.log(autoClickers);
});

function initGame(){
    initClicker();
    initAutoClickers();
    initGameTimer();
}

function initClicker(){
    var clicker = document.getElementById("clicker");

    clicker.onclick = clicked;
}

function initAutoClickers(){
    var result = "<div> <ul>";
    for(var i =0; i<autoClickers["autoClickers"].length;i++){
        result += "<li>"+ autoClickers["autoClickers"][i]["nom"] +" " + autoClickers["autoClickers"][i]["prix"]+ " <img src='assets/egg.png' height=40 width=40> : "+myAutoClickers[i]+"</li>";
    }
    result += "</div>";
    autoC_Elem.innerHTML = result;
}

function initGameTimer(){
    var timer = setTimeout(game_timer, 1000);
}

function game_timer(){
    var eggsThisSecond = 0;
    for(var i=0; i<myAutoClickers.length ; i++){
        eggsThisSecond += myAutoClickers[i] * autoClickers["autoClickers"][i]["production"];
    }
    eggs += eggsThisSecond;
}

function clicked(){
    clics +=1;
    eggs +=1;
    console.log(clics);
    egg_Elem.innerHTML = eggs;
}



function updateAutoClickers(){
}

function test(){
    myAutoClickers[0] ++; 
    console.log(myAutoClickers[0]); 
}