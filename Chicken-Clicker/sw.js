const cacheName = 'chicken-clicker' + '0.3';

self.importScripts('idb/idb.js', 'idb/database.js');

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);

    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
            'idb/idb.js',
            'idb/database.js',
            'index.html',
            'main.js',
            'content.json',
            'assets'
        ])
        .then(console.log('cache initialisé'))
        .catch(console.err);
    });

    evt.waitUntil(cachePromise);

});

self.addEventListener('activate', (evt) => {
    console.log(`sw activé à ${new Date().toLocaleTimeString()}`);   
    
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

    // 5.3 Stratégie de network first with cache fallback
        // On doit envoyer une réponse
        evt.respondWith(
            // on doit d'abord faire une requête sur le réseau de ce qui a été intercepté
            fetch(evt.request).then(res => {
                console.log("url récupérée depuis le réseau", evt.request.url);
                // mettre dans le cache le résultat de cette réponse : en clef la requête et en valeur la réponse
                caches.open(cacheName).then(cache => cache.put(evt.request, res));
                // quand on a la réponse on la retourne (clone car on ne peut la lire qu'une fois)
                return res.clone();
            })
            // Si on a une erreur et que l'on arrive pas à récupérer depuis le réseau, on va chercher dans le cache
            .catch(err => {
                console.log("url récupérée depuis le cache", evt.request.url);
                return caches.match(evt.request);
            })
        );
});

self.addEventListener('sync', (event) => {
    console.log('sync event', event);
    if (event.tag === 'sync-save') {
        console.log('syncing', event.tag);
        event.waitUntil(updateSavePromise);
    }
})

const updateSavePromise = new Promise(function(resolve, reject) {

    getAllSaves().then(saves => {
        console.log('Les saves récupérées par la sync callback', saves);
        
        saves.map(save => {
            console.log('Attempting fetch', save);
            fetch('https://us-central1-pwa-chicken-clicker.cloudfunctions.net/addSave', {
                    method: 'POST', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(save)
                })
                .then(resp => {
                    if(resp.status == 200){
                        console.log("sauvegarde réussie et synchronisée");
                        resolve(deleteSave(save.id));
                    }
                    else{
                        console.log(resp.status);
                    }
                })
                .catch(err => {
                    console.log("Erreur, la synchronisation n'a pas marché", err);
                    reject(err);
                })
        })
 
    })
});

/*
self.registration.showNotification("Notification du SW", {
    body:"Si le jeu vous plaît, pensez à télécharger l'application",
   
    actions:[
        {action:"accept", title:"accepter"},
        {action: "refuse", title: "refuser"}
    ]
})*/

/*
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
*/