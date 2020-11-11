//** divs web */
var egg_Elem = document.getElementById("eggs");
var eggps_Elem = document.getElementById("eggsPerSecond");
var buildings_Elem = document.getElementById("buildings");
var myBuildings_Elem = document.getElementById("myBuildings");
var myRewards_Elem = document.getElementById("myRewards");
var ameliorations_Elem = document.getElementById("ameliorations");

//** vars utilisateur */
var playerID;
var eggs = 0; 
var clics = 0; 
var eggsOnClick = 1;
var secondPassed  = 0; 
var myBuildings = []; 
var myBuildingsBoost = [];
var myUpgrades = [];
var myRewards = [];
//var prices = [];

//** content.json */
var data = []; 
var save = [];

//** vars jeu */
var timer;
var eggsThisSecond;
var currentMultiplier = 1;


if(navigator.serviceWorker) {
    navigator.serviceWorker
        .register('sw.js')
}


function initGame(){
    
   // getPlayerData();
    loadContent();
    initClicker();
    initGameTimer();

    if(localStorage.getItem("playerID")== "" || localStorage.getItem("playerID")==null){
        playerID = "id"+Date.now();
        console.log(playerID);
        localStorage.setItem("playerID", playerID);
    }
    playerID = localStorage.getItem("playerID");
}

            //////////////////////////////////
            // ************FRONT************//
            //////////////////////////////////

function initBuildings(){
    var result = "<ul class=\"list-group\">";
    for(var i =0; i<data[1].length;i++){
        result += "<li class=\"list-group-item\"><div>"+ data[1][i]["nom"]  +"</div> <div>( "+data[1][i]["production"]
        + " <img src='assets/egg.png' width=15> par secondes )</div> <div class=\"btn-group\"><button id=\"buyer_"
        + data[1][i]['id'] + "\" type=\"button\" class=\"btn btn-outline-info btn-sm\" id='"+data[1][i]['id']
        + "' onclick='buyItem("+i+","+data[1][i]["prix"]+", 1)'>"+data[1][i]["prix"]
        + " <img src='assets/egg.png' width=15></button></div></li><br>";
    }
    result += "</ul>";
    buildings_Elem.innerHTML = result;
}

function showUpgrades(){
    var result = "<ul class=\"list-group\">";

    data[0]["clics"].forEach( c => {
        if(!myUpgrades.includes(c["id"])) {
            result += "<li class=\"list-group-item\"><div>" + c["nom"]+" : "+ c["desc"]
            +"</div> <div><button class=\"btn btn-outline-info btn-sm\" id='"+c['id']  +"' onclick='buyUpgrade("+c["id"]+","+c["prix"]
            +',"clic",'+c["multiplicateur"]+",-1)'>"+c["prix"] + " <img src='assets/egg.png' width=15></button></div></li><br>";
        }
    });
    data[0]["buildings"].forEach( b => {
        if(!myUpgrades.includes(b["id"])) {
            result += "<li class=\"list-group-item\"><div>" + b["nom"]+" : "+ b["desc"]
            +"</div> <div><button class=\"btn btn-outline-info btn-sm\" id='"+b['id'] +"' onclick='buyUpgrade("+b["id"]+","+b["prix"]
            +',"building",'+b["multiplicateur"]+","+(b["building_id"]-1)+")'>"+b["prix"] + " <img src='assets/egg.png' width=15></button></div></li><br>";
        }
    });
    result += "</ul>";
    ameliorations_Elem.innerHTML = result;
}

function updateRewards(){
    text = "";
    for(var i=0; i<myRewards.length ; i++){
        text += '<div style="background-color: #FBF9C3;margin-right: 50px;" class="myTooltipRight list-group-item list-group-item-secondary">'+ data[2][myRewards[i][0]][myRewards[i][1]]["title"] +'<span class="tooltiptextRight">'+data[2][myRewards[i][0]][myRewards[i][1]]["desc"]+'</span></div><br>';     
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
        for(var i =0; i<data[1].length;i++){
            var totalcost =0;
            for (var j=0;j<currentMultiplier;j++) totalcost +=Math.round(data[1][i]["prix"]*Math.pow(1.05, myBuildings[i]+j));
            document.getElementById("buyer_" + (i+1) ).innerHTML =  totalcost  + " <img src='assets/egg.png' width=15>";
            document.getElementById("buyer_" + (i+1)).setAttribute("onclick", "buyItem("+i+","+totalcost+","+currentMultiplier+")");    
        }
}

function updateMyBuildings(){
    text = "";
    for(var i=0; i<myBuildings.length ; i++){
        if(myBuildings[i]!=0){
            var production = myBuildings[i] * myBuildingsBoost[i] * data[1][i]["production"];
            var bonus = "total: "+(data[1][i]["production"]*myBuildings[i])+"<br>"+((myBuildingsBoost[i]==1)? "aucun bonus": "x "+myBuildingsBoost[i]) +"<br>= "+production;
            text += '<div class="myTooltipRight">'+data[1][i]["nom"] + " x " + myBuildings[i] + " ( "+ (production)+"/s )" +'<span class="tooltiptextRight">'+bonus+'</span> </div><br>';
        }
        
    }
    myBuildings_Elem.innerHTML = text;
}

function updateEggs(){
    egg_Elem.innerHTML = Math.round(eggs);
}

function updateEggsPerSec(){
    eggps_Elem.innerHTML = eggsThisSecond+" oeufs par secondes";
}

            //////////////////////////////////
            // *************BACK************//
            //////////////////////////////////

function getPlayerData(){ // Il faudra passer le bon ID par paramètres

    fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/getSave?id='+playerID) // --> firebase
        .then(response => {
            response.json()
                .then(result => { 
                    save = Array(result)[0];
                    console.log("Get By id returns : ")
                    console.log(save)
                    console.log("Récupère la save sur Firebase")

                    eggs = parseInt(save[1]);
                    updateEggs();
                    clics = parseInt(save[0]);
                    secondPassed = parseInt(save[6]);
                    console.log(save[3].toString())
                    myBuildings = save[3].toString().split(',').map(b=>parseInt(b));
                    myUpgrades = save[5].toString().split(',').map(b=>parseInt(b));

                    myBuildingsBoost.fill(1);
                    eggsOnClick = 1;
                    //load les upgrades et les applique
                    if(isNaN(myUpgrades[0])) { myUpgrades = []};
                    myUpgrades.forEach(u => fetchUpgrade(u));
                    showUpgrades();
                    
                    //load les batiments sur l'app
                    updateMyBuildings();

                    //load les rewards et les applique
                    var temp = save[4].toString().split(',');
                    if(temp[0]=="") { temp = []};
                    myRewards = [];
                    for(var i = 0; i<temp.length;i=i+2)  myRewards.push([temp[i], +temp[i+1]]);
                    updateRewards();
                });
        })
        .catch(() => {
            eggs = parseInt(localStorage.getItem("eggs"));
            updateEggs();
            clics = parseInt(localStorage.getItem("clics"));
            secondPassed = parseInt(localStorage.getItem("secondes"));
            myBuildings = localStorage.getItem("myBuildings").split(',').map(b=>parseInt(b));
            myUpgrades = localStorage.getItem("myUpgrades").split(',').map(b=>parseInt(b));

            console.log("Récupère la save dans le local storage")

            myBuildingsBoost.fill(1);
            eggsOnClick = 1;
            //load les upgrades et les applique
            if(isNaN(myUpgrades[0])) { myUpgrades = []};
            myUpgrades.forEach(u => fetchUpgrade(u));
            showUpgrades();
            
            //load les batiments sur l'app
            updateMyBuildings();

            //load les rewards et les applique
            var temp = localStorage.getItem("myRewards").split(',');
            if(temp[0]=="") { temp = []};
            myRewards = [];
            for(var i = 0; i<temp.length;i=i+2)  myRewards.push([temp[i], +temp[i+1]]);
            updateRewards();
        });

}

function savePlayerData(){ // Il faudra passer le bon ID dans le json
    //deletePlayerData();
    localStorage.setItem("eggs", eggs.toString());
    localStorage.setItem("myBuildings", myBuildings.toString());
    localStorage.setItem("clics", clics);
    localStorage.setItem("secondes", secondPassed);
    localStorage.setItem("myRewards", myRewards.toString());
    localStorage.setItem("myUpgrades", myUpgrades.toString());

    saveCloudData();
}

function deletePlayerData(){
    localStorage.removeItem("eggs");
    localStorage.removeItem("myBuildings");
    localStorage.removeItem("clics");
    localStorage.removeItem("secondes");
    localStorage.removeItem("myRewards");
    localStorage.removeItem("myUpgrades");

    deleteCloudData();
}

function saveCloudData(){
    var playerSave = {
        id: playerID, 
        eggs: eggs,
        myBuildings: myBuildings.toString(),
        clics: clics,
        seconds: secondPassed,
        myRewards: myRewards.toString(),
        myUpgrades: myUpgrades.toString()
    }
    fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/addSave', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerSave)
        })
        .then(resp => {
            if(resp.status == 200){
                console.log("sauvegarde réussie");
            }
            else{
                console.log(resp.status);
            }
        })
}

function getCloudData(){
    /*fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/getSave/'+playerID) 
        .then(response => {
            response.json()
                .then(result => { 
                });
        })
        .catch(console.error);*/
}

function deleteCloudData(){
    
    fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/deleteSave?id='+playerID, {
        method: 'DELETE'
        }).then(response => {
            if(response.status == 200){
                console.log("suppression réussie");
            }
            else{
                console.log(response.status);
            }
        })
        .catch(console.error);
}

function loadContent() {
    fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/getDatas') // --> firebase
        .then(response => {
            response.json()
                .then(result => { 
                    data = Array(result)[0];
                    //console.log(data)
                    //console.log(data[2]["temps"])
                    //console.log(data[1].length)
                    if(myBuildings.length==0){ 
                        for(var i =0; i<data[1].length;i++) {
                            myBuildings.push(0); 
                            myBuildingsBoost.push(1);
                        }
                    }

                    initBuildings();
                    showUpgrades();
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
        //console.log(myBuildings[i]+ " * "+ myBuildingsBoost[i]+" * "+data["buildings"][i]["production"]);
        eggsThisSecond += myBuildings[i] * myBuildingsBoost[i] * data[1][i]["production"];
    }
    eggs += eggsThisSecond;
    updateEggsPerSec();
    updateEggs();
    addSecond();
    //console.log("1 seconde ("+secondPassed+"), oeufs produits = "+eggsThisSecond);  
}


function buyItem(i, prix, nb){
    if(eggs - prix >= 0){
        myBuildings[i] += nb; 
        eggs -= prix;
        updateEggs();
        updateMyBuildings();
        applyMultiplier(); //increaseBuildingCost(i, nb);
        console.log(myBuildings); 
        console.log(myBuildingsBoost);
    }
    else {
        //console.log("pas assez d'oeufs")
    }   
}

function buyUpgrade(i, prix, type, effect, b_id){
    if(eggs - prix >= 0){
        myUpgrades.push(i);
        eggs -= prix;
        updateEggs();
        if(type=="clic"){
            eggsOnClick*= effect;
        }
        else if(type=="building"){
            myBuildingsBoost[b_id]*= effect;
            updateMyBuildings();
        }
        else if(type=="other"){

        }
        showUpgrades();
    }
    else{
        console.log("pas assez d'oeufs")
    }
}

function fetchUpgrade(i){
    console.log("fetching upgrade id"+i);
    
    data[0]["clics"].forEach(upgrade => {
        if(upgrade["id"] == i){
            console.log(upgrade["nom"]+ "  "+upgrade["multiplicateur"]);
            eggsOnClick*= upgrade["multiplicateur"];
        }
    });

    data[0]["buildings"].forEach(upgrade => {
        if(upgrade["id"] == i){
            console.log(upgrade["nom"]+ "  "+upgrade["multiplicateur"]);
            myBuildingsBoost[upgrade["building_id"]-1]*= upgrade["multiplicateur"];
        }
    });
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
    data[2]["clic"].forEach(palier => {
        if(palier["requirement"] == clics){
            showNotification(palier["title"], palier["desc"], palier["img"]);
            myRewards.push(["clic", palier["id"]-1]);
            updateRewards();
        }
    });
}

function addSecond(){
    secondPassed +=1;
    data[2]["temps"].forEach(palier => {
        if(palier["requirement"] == secondPassed){
            showNotification(palier["title"], palier["desc"], palier["img"]);
            myRewards.push(["temps", palier["id"]-1]);
            updateRewards();
        }
    });
}

function reduceInt(){
    //big js -> transformer un grand nombre genre 900000000000 en 9.10^12 ou 9 decillions ou un truc comme ça
}


// anciennes fonctions
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

/*
function addClic2(){
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
}*/

/*
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
}*/