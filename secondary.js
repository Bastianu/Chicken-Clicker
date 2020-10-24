window.addEventListener("resize",function(event){
    displayShowShopButton()
})

function showShop() {
    if(document.getElementById("shop").hidden){
        document.getElementById("shop").hidden = false;
    }
    else{
        document.getElementById("shop").hidden = true
    }
}

function displayShowShopButton(){
    if (screen.width >= 768) {
        document.getElementById("shopShow").hidden = true
    }
    else{
        document.getElementById("shopShow").hidden = false
    }
}