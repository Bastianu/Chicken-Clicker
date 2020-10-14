//** divs jeu */
var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var autoC_Elem = document.getElementById("autoC");
var myAutoC_Elem = document.getElementById("myAutoC");

//** vars utilisateur */
var eggs = 0; // --> cache 
var clics = 0; // --> pareil
var secondPassed  = 0; // --> pareil
var myAutoClickers = [0,0,0,0,0]; // pareil //  ## A MODIFIER
var myBonuses = []

//** const jeu */
var data = []; // récupère les données de content.json 

//** vars jeu */
var timer;
var eggsThisSecond;

if(navigator.serviceWorker) {
    navigator.serviceWorker
        .register('sw.js')
}


// **** lecture content.json
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

readTextFile("content.json", function(text){
    data = JSON.parse(text);
    console.log(data);
});
// ****


function initGame(){
    getPlayerData();
    initClicker();
    initAutoClickers();
    initGameTimer();
}

function getPlayerData(){
    //if cache != null myAutoClickers/eggs/clics/secondPassed/etc.. = cache
}


function initClicker(){
    var clicker = document.getElementById("clicker");

    clicker.onclick = clicked;
}

function initAutoClickers(){
    var result = "<div> <ul>";
    for(var i =0; i<data["autoClickers"].length;i++){
        result += "<li>"+ data["autoClickers"][i]["nom"] +" ( "+data["autoClickers"][i]["production"]+ "/s ) <button onclick='buyOne("+i+","+data["autoClickers"][i]["prix"]+")'> x1 => "+data["autoClickers"][i]["prix"]+ " <img src='assets/egg.png' height=30 width=30></button></li><br>";
    }
    result += "</div>";
    autoC_Elem.innerHTML = result;
}

function initGameTimer(){
    timer = setInterval(game_timer, 1000);
}

function game_timer(){
    eggsThisSecond = 0;
    for(var i=0; i<myAutoClickers.length ; i++){
        console.log(myAutoClickers[i]+" * "+data["autoClickers"][i]["production"]);
        eggsThisSecond += myAutoClickers[i] * data["autoClickers"][i]["production"];
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
    //console.log(clics);
    updateEggs();
}

function updateEggs(){
    egg_Elem.innerHTML = eggs;
}

function updateEggsPerSec(){
    eggps_Elem.innerHTML = "( "+eggsThisSecond+"/s )";
}

function updateAutoClickers(){
    text = "";
    for(var i=0; i<myAutoClickers.length ; i++){
        if(myAutoClickers[i]!=0){
            text += data["autoClickers"][i]["nom"] + " x " + myAutoClickers[i] + " ( "+ (data["autoClickers"][i]["production"]* myAutoClickers[i])+"/s ) <br>";
        }
        
    }
    myAutoC_Elem.innerHTML = text;
}

function buyOne(i, prix){
    if(eggs - prix >= 0){
        myAutoClickers[i] ++; 
        eggs -= prix;
        updateEggs();
        updateAutoClickers();
        console.log(myAutoClickers); 
    }
    else {
        console.log("pas assez d'oeufs")
    }   
}

function stop(){
    clearInterval(timer);   
}

