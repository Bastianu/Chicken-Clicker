const cacheName = 'chicken-clicker' + '0.3';

self.addEventListener('install', (evt) => {
    console.log(`sw installé à ${new Date().toLocaleTimeString()}`);

    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
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
