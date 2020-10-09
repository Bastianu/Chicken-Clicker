var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var autoC_Elem = document.getElementById("autoC");
var timer;
var eggsThisSecond;

var myAutoClickers = [0,0,0]; // [0 => 10, 1 => 1, 2 => 0, ...]; // mydata["myAutoClickers"]
var eggs = 0; // devra être enregistré en cache ou cookie
var clics = 0; // pareil
var secondPassed  = 0; //pareil
var autoClickers = []; // = content.json 


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
        result += "<li>"+ autoClickers["autoClickers"][i]["nom"] +" ( "+autoClickers["autoClickers"][i]["production"]+ "/s ) <button onclick='test("+i+","+autoClickers["autoClickers"][i]["prix"]+")'> x1 => "+autoClickers["autoClickers"][i]["prix"]+ " <img src='assets/egg.png' height=30 width=30></button></li><br>";
    }
    result += "</div>";
    autoC_Elem.innerHTML = result;
}

function initGameTimer(){
    timer = setInterval(game_timer, 3000);
}

function game_timer(){
    eggsThisSecond = 0;
    for(var i=0; i<myAutoClickers.length ; i++){
        console.log(myAutoClickers[i]+" * "+autoClickers["autoClickers"][i]["production"]);
        eggsThisSecond += myAutoClickers[i] * autoClickers["autoClickers"][i]["production"];
    }
    eggs += eggsThisSecond;
    updateEggsPerSec();
    updateEggs();
    console.log("1 seconde, oeufs produits = "+eggsThisSecond);
    secondPassed += 1;
}

function clicked(){
    clics +=1;
    eggs +=1;
    console.log(clics);
    updateEggs();
}

function updateEggs(){
    egg_Elem.innerHTML = eggs;
}

function updateEggsPerSec(){
    eggps_Elem.innerHTML = "( "+eggsThisSecond+"/s )";
}

function updateAutoClickers(){
}

function test(i, prix){
    myAutoClickers[i] ++; 
    eggs -= prix;
    updateEggs();
    console.log(myAutoClickers); 
}

function stop(){
    clearInterval(timer);   
}