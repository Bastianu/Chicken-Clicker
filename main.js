//** divs web */
var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var buildings_Elem = document.getElementById("buildings");
var myBuildings_Elem = document.getElementById("myBuildings");
var myRewards_Elem = document.getElementById("myRewards");

//** vars utilisateur */
var eggs = 0; 
var clics = 0; 
var secondPassed  = 0; 
var myBuildings = []; 
var myBoosts = [];
var myRewards = [];

//** content.json */
var data = []; 

//** vars jeu */
var timer;
var eggsThisSecond;


if(navigator.serviceWorker) {
    navigator.serviceWorker
        .register('sw.js')
}

function initGame(){
    
    getPlayerData();
    loadContent();
    initClicker();
    initGameTimer();
}

function getPlayerData(){
    //get vars utilisateur from cache ou from bdd
}

function loadContent() {
    fetch('content.json') // --> firebase
        .then(response => {
            response.json()
                .then(result => { 
                    data = Array(result)[0];
                    if(myBuildings.length==0){ 
                        for(var i =0; i<data["buildings"].length;i++) myBuildings.push(0); 
                    }

                    initBuildings();
                });
        })
        .catch(console.error);
}


function initClicker(){
    var clicker = document.getElementById("clicker");

    clicker.onclick = clicked;
}

function initBuildings(){ // *** A REFAIRE ***
    var result = "<div> <ul>";
    for(var i =0; i<data["buildings"].length;i++){
        result += "<li>"+ data["buildings"][i]["nom"] +" ( "+data["buildings"][i]["production"]+ "/s ) <button id='"+data['buildings'][i]['id']+ "' onclick='buyOne("+i+","+data["buildings"][i]["prix"]*Math.pow(1.05,myBuildings[i])+")'> x1 => "+data["buildings"][i]["prix"]+ " <img src='assets/egg.png' height=30 width=30></button></li><br>";
    }
    result += "</div>";
    buildings_Elem.innerHTML = result;
}

function initGameTimer(){
    timer = setInterval(game_timer, 1000);
}

function game_timer(){
    eggsThisSecond = 0;
    for(var i=0; i<myBuildings.length ; i++){
        //console.log(myBuildings[i]+" * "+data["buildings"][i]["production"]);
        eggsThisSecond += myBuildings[i] * data["buildings"][i]["production"];
    }
    eggs += eggsThisSecond;
    updateEggsPerSec();
    updateEggs();
    addSecond();
    console.log("1 seconde ("+secondPassed+"), oeufs produits = "+eggsThisSecond);  
}


function clicked(){
    addClic();
    eggs +=1;
    updateEggs();
}

function updateEggs(){
    egg_Elem.innerHTML = eggs;
}

function updateEggsPerSec(){
    eggps_Elem.innerHTML = "( "+eggsThisSecond+"/s )";
}

function updateBuildings(){
    text = "";
    for(var i=0; i<myBuildings.length ; i++){
        if(myBuildings[i]!=0){
            text += data["buildings"][i]["nom"] + " x " + myBuildings[i] + " ( "+ (data["buildings"][i]["production"]* myBuildings[i])+"/s ) <br>";
        }
        
    }
    myBuildings_Elem.innerHTML = text;
}

function updateRewards(){
    text = "";
    for(var i=0; i<myRewards.length ; i++){
        text += '<div class="tooltip">'+ myRewards[i][0] +'<span class="tooltiptext">'+myRewards[i][1]+'</span> </div><br>';     
    }
    myRewards_Elem.innerHTML = text;
}

function buyOne(i, prix){
    if(eggs - prix >= 0){
        myBuildings[i] ++; 
        eggs -= prix;
        updateEggs();
        updateBuildings();
        increaseBuildingCost(i);
        console.log(myBuildings); 
    }
    else {
        console.log("pas assez d'oeufs")
    }   
}

function buyMax(i){
    var count = 0;
    while(eggs - prix > 0){
        myBuildings[i] ++; 
        eggs -= prix;
        updateEggs();
        updateBuildings();
        increaseBuildingCost(i);
        count++;
    }
    console.log(count+ " achetés");
}

function stop(){
    clearInterval(timer);   
}

function showNotification(title, desc, img){
    if(window.Notification && window.Notification !== "denied"){ 
        Notification.requestPermission(perm => {
            if(perm === "granted"){
 
                const options = {
                    body : desc,
                    icon : img
                    //https://developer.mozilla.org/fr/docs/Web/API/notification
                }
     
                var notif = new Notification(title, options);
              
            }
            else{ 
                console.log("Notification refusée");
            }
        })
    }
}

function addEggs(nb_eggs){
    eggs += nb_eggs;
}

function addClic(){
    clics += 1;
    var i = 0;
    data["rewards"]["clics"]["requirements"].forEach(palier => {
        if(palier == clics){
            showNotification(data["rewards"]["clics"]["title"][i], data["rewards"]["clics"]["desc"][i]);
            myRewards.push([data["rewards"]["clics"]["title"][i], data["rewards"]["clics"]["desc"][i]]);
            updateRewards();
        }
        i++;
    });
}

function addSecond(){
    secondPassed +=1;
    var i = 0;
    data["rewards"]["temps"]["requirements"].forEach(palier => {
        if(palier == secondPassed){
            showNotification(data["rewards"]["temps"]["title"][i], data["rewards"]["temps"]["desc"][i]);
            myRewards.push([data["rewards"]["temps"]["title"][i], data["rewards"]["temps"]["desc"][i]]);
            updateRewards();
        }
        i++;
    });
}

function increaseBuildingCost(i){
    var initialcost = data["buildings"][i]["prix"];
    var nbOfThisBuilding = myBuildings[i];
    var newCost = Math.round(initialcost*Math.pow(1.05, nbOfThisBuilding-1));
    document.getElementById((i+1)).innerHTML =  "x1 => "+newCost+ " <img src='assets/egg.png' height=30 width=30>";
    document.getElementById((i+1)).setAttribute('onclick','buyOne('+i+','+newCost+')');
}

// **** lecture content.json
/*function readTextFile(file, callback) {
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
});*/
// ****


