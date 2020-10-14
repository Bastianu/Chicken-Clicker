const cacheName = 'chicken-clicker' + '0.1';

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);

    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'http://localhost:3001/autoClickers',
            'http://localhost:3001/rewards', 
            'http://localhost:3001/boosts'
        ])
        .then(console.log('cache initialisé'))
        .catch(console.err);
    });

    evt.waitUntil(cachePromise);

});

self.addEventListener('activate', (evt) => {
    console.log(`sw activé à ${new Date().toLocaleTimeString()}`);   
    
    // 5.4 Supprimer les anciennes instances de cache
    let cacheCleanPromise = caches.keys().then(keys => {
        keys.forEach(key => {          
            if(key !== cacheName){ 
                caches.delete(key);
            }
        });
    });

    evt.waitUntil(cacheCleanPromise);
});

this.addEventListener('fetch', (evt) => {
});


self.registration.showNotification("Notification du SW", {
    body:"je suis une notification dite persistante",
   
    actions:[
        {action:"accept", title:"accepter"},
        {action: "refuse", title: "refuser"}
    ]
})


self.addEventListener("notificationclose", evt => {
    console.log("Notification fermée", evt);
})

self.addEventListener("notificationclick", evt => {
    console.log("notificationclick evt", evt);
    if(evt.action === "accept"){
        console.log("vous avez accepté");
    } else if(evt.action === "refuse"){
        console.log("vous avez refusé");
    } else{
        console.log("vous avez cliqué sur la notification (pas sur un bouton)");
    }
  
    evt.notification.close();
})
