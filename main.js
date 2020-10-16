//** divs web */
var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var autoC_Elem = document.getElementById("autoC");
var myAutoC_Elem = document.getElementById("myAutoC");

//** vars utilisateur */
var eggs = 0; 
var clics = 0; 
var secondPassed  = 0; 
var myAutoClickers = []; 
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
    fetch('content.json') //http://127.0.0.1:3001/autoClickers
        .then(response => {
            response.json()
                .then(result => { 
                    data = Array(result)[0];
                    if(myAutoClickers.length==0){ 
                        for(var i =0; i<data["autoClickers"].length;i++) myAutoClickers.push(0); 
                    }

                    initAutoClickers();
                });
        })
        .catch(console.error);
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
        //console.log(myAutoClickers[i]+" * "+data["autoClickers"][i]["production"]);
        eggsThisSecond += myAutoClickers[i] * data["autoClickers"][i]["production"];
    }
    eggs += eggsThisSecond;
    updateEggsPerSec();
    updateEggs();
    secondPassed += 1;
    console.log("1 seconde ("+secondPassed+"), oeufs produits = "+eggsThisSecond);  
}


function clicked(){
    clics +=1;
    eggs +=1;
    updateEggs();
   // if(clics == 1) { showNotification("Un Oeuf !", "ton premier oeuf", "assets/icon/apple-icon-72x72-dunplab-manifest-19614.png")}
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


