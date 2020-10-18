//** divs web */
var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var buildings_Elem = document.getElementById("buildings");
var myBuildings_Elem = document.getElementById("myBuildings");
var myRewards_Elem = document.getElementById("myRewards");

//** vars utilisateur */
var eggs = 1000; 
var clics = 0; 
var eggsOnclick = 1;
var secondPassed  = 0; 
var myBuildings = []; 
var myAmeliorations = [];
var myRewards = [];
//var prices = [];

//** content.json */
var data = []; 

//** vars jeu */
var timer;
var eggsThisSecond;
var currentMultiplier = 1;


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

            //////////////////////////////////
            // ************FRONT************//
            //////////////////////////////////

function initBuildings(){ // *** A REFAIRE ***
    var result = "<ul class=\"list-group\">";
    for(var i =0; i<data["buildings"].length;i++){
        result += "<li class=\"list-group-item\"><div>"+ data["buildings"][i]["nom"] +"</div> <div>( "+data["buildings"][i]["production"]+ " <img src='assets/egg.png' width=15> par secondes )</div> <div class=\"btn-group\"><button id=\"buyer_" + data['buildings'][i]['id'] + "\" type=\"button\" class=\"btn btn-outline-info btn-sm\" id='"+data['buildings'][i]['id']+ "' onclick='buyItem("+i+","+data["buildings"][i]["prix"]+", 1)'>"+data["buildings"][i]["prix"]+ " <img src='assets/egg.png' width=15></button></div></li><br>";
        //prices.push(data["buildings"][i]["prix"]);
    }
    result += "</ul>";
    buildings_Elem.innerHTML = result;
}

function updateRewards(){
    text = "";
    for(var i=0; i<myRewards.length ; i++){
        text += '<div class="myTooltip">'+ myRewards[i][0] +'<span class="tooltiptext">'+myRewards[i][1]+'</span> </div><br>';     
    }
    myRewards_Elem.innerHTML = text;
}

function changeMultiplier(){
    if(currentMultiplier == 1) currentMultiplier = 10;
    else if(currentMultiplier == 10) currentMultiplier = 100;
    else if(currentMultiplier == 100) currentMultiplier = 1;
    applyMultiplier();
}

function applyMultiplier(){
        document.getElementById("multiplier").innerText = "x"+currentMultiplier;      
        for(var i =0; i<data["buildings"].length;i++){
            var totalcost =0;
            for (var j=0;j<currentMultiplier;j++) totalcost +=Math.round(data["buildings"][i]["prix"]*Math.pow(1.05, myBuildings[i]+j));
            document.getElementById("buyer_" + (i+1) ).innerHTML =  totalcost  + " <img src='assets/egg.png' width=15>";
            document.getElementById("buyer_" + (i+1)).setAttribute("onclick", "buyItem("+i+","+totalcost+","+currentMultiplier+")");    
        }
}

function updateEggs(){
    egg_Elem.innerHTML = Math.round(eggs);
}

function updateEggsPerSec(){
    eggps_Elem.innerHTML = eggsThisSecond+" oeufs par secondes";
}

function updateMyBuildings(){
    text = "";
    for(var i=0; i<myBuildings.length ; i++){
        if(myBuildings[i]!=0){
            var bonus = "<br>aucun bonus <br>x1";
            text += '<div class="myTooltipRight">'+data["buildings"][i]["nom"] + " x " + myBuildings[i] + " ( "+ (data["buildings"][i]["production"]* myBuildings[i])+"/s )" +'<span class="tooltiptextRight"> bonus actifs :'+bonus+'</span> </div><br>';
        }
        
    }
    myBuildings_Elem.innerHTML = text;
}


            //////////////////////////////////
            // *************BACK************//
            //////////////////////////////////

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

function clicked(){
    addClic();
    eggs += eggsOnClick;
    updateEggs();
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


function buyItem(i, prix, nb){
    if(eggs - prix >= 0){
        myBuildings[i] += nb; 
        eggs -= prix;
        updateEggs();
        updateMyBuildings();
        applyMultiplier(); //increaseBuildingCost(i, nb);
        console.log(myBuildings); 
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

function reduceInt(){
    //big js -> transformer un grand nombre genre 900000000000 en 9.10^12 ou 9 decillions ou un truc comme ça
}

/*
function increaseBuildingCost(i, nbBought){
    /*var initialcost = data["buildings"][i]["prix"];
    var nbOfThisBuilding = myBuildings[i];
    var newCost = Math.round(initialcost*Math.pow(1.05, nbOfThisBuilding-1+nbBought));
    document.getElementById("buyer_" + (i+1)).innerHTML = newCost+ " <img src='assets/egg.png' width=15>";
    document.getElementById("buyer_" + (i+1)).setAttribute('onclick','buyItem('+i+','+newCost+',1)');
    prices[i] = newCost;
}
*/

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


/*
function changeMultiplier2(){
    var multiplier = document.getElementById("multiplier").innerText;
    if(multiplier === "x1"){
        document.getElementById("multiplier").innerText = "x10";
        
        for(var i =0; i<data["buildings"].length;i++){
            totalcost =0;
            for (var j=0;j<10;j++) totalcost += Math.round(prices[i]*Math.pow(1.05, myBuildings[i]+j));
            document.getElementById("buyer_" + (i+1) ).innerHTML =  totalcost  + "<img src='assets/egg.png' width=15>";
            document.getElementById("buyer_" + (i+1)).setAttribute("onclick", "buyItem("+i+","+totalcost+", 10)");    
        }
    }
    else if(multiplier === "x10"){
        document.getElementById("multiplier").innerText = "x100";

        for(var i =0; i<data["buildings"].length;i++){
            totalcost =0;
            for (var j=0;j<100;j++) totalcost += Math.round(prices[i]*Math.pow(1.05, myBuildings[i]+j));
            document.getElementById("buyer_" + (i+1) ).innerHTML = totalcost  + "<img src='assets/egg.png' width=15>"
            document.getElementById("buyer_" + (i+1)).setAttribute("onclick", "buyItem("+i+","+totalcost+"), 100")
        }
    }
    else if(multiplier === "x100"){
        document.getElementById("multiplier").innerText = "x1";

        for(var i =0; i<data["buildings"].length;i++){
            document.getElementById("buyer_" + (i+1) ).innerHTML = prices[i]  + "<img src='assets/egg.png' width=15>"
            document.getElementById("buyer_" + (i+1)).setAttribute("onclick", "buyItem("+i+","+prices[i]+",1)")
        }
    }
}
*/