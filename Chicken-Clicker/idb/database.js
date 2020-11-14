function saveDb() {
    return idb.open('save-store', 2, upgradeDB => {
        switch (upgradeDB.oldVersion) {
            case 0: upgradeDB.createObjectStore('save')
        }
    })
}

function getSave(id) {
    return saveDb().then(db => {
        return db.transaction('save')
            .objectStore('save').get(id);
    })
}

function putSave(value, key) {
    return saveDb().then(db => {
        const tx = db.transaction('save', 'readwrite');
        tx.objectStore('save').put(value, key);
        return tx.complete;
    });
}

function deleteSave(id) {
    return saveDb().then(db => {
        const tx = db.transaction('save', 'readwrite');
        tx.objectStore('save').delete(id);
        return tx.complete;
    });
}

function clearSaves() {
    return saveDb().then(db => {
        const tx = db.transaction('save', 'readwrite');
        tx.objectStore('save').clear();
        return tx.complete;
    });
}

function getAllSaves() {
    return saveDb().then(db => {
        return db.transaction('save')
            .objectStore('save').getAllKeys().then(keys => {
                return Promise.all(keys.map(id => getSave(id).then(content => (Object.assign({}, { id }, content)))))
            });
    })
}