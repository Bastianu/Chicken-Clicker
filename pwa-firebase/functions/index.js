/* eslint-disable no-implicit-coercion */
/* eslint-disable consistent-return */
const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.database();


//Partie qui gère la config de base de la partie


const refGame = db.ref('/game');

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from a Severless Database!");
});

const getDataFromDatabase = (res) => {
  let game = [];

  return refGame.on('value', (snapshot) => {
    snapshot.forEach((info) => {
      let objGame = info.val();
      objGame.id = info.key;
      game.push(objGame);
    });
    res.status(200).json(game);
  }, (error) => {
    res.status(500).json({
      message: `Something went wrong. ${error}`
    })
  })
};

exports.getDatas = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(500).json({
        message: 'Not allowed'
      });
    }
    getDataFromDatabase(res)
  });
});


//Partie qui gère la Save & Load du joueur


const refSave = db.ref('/save');
let refSaveById = db.ref('/save');

const getSaveFromDatabase = (res) => {
  let save = [];

  return refSave.on('value', (snapshot) => {
    snapshot.forEach((info) => {
      let objGame = info.val();
      objGame.id = info.key;
      save.push(objGame);
    });
    res.status(200).json(save);
  }, (error) => {
    res.status(500).json({
      message: `Something went wrong. ${error}`
    })
  })
};

const getSaveByIdFromDatabase = (res) => {
  let save = [];

  return refSaveById.on('value', (snapshot) => {
    snapshot.forEach((info) => {
      let objGame = info.val();
      objGame.id = info.key;
      save.push(objGame);
    });
    res.status(200).json(save);
  }, (error) => {
    res.status(500).json({
      message: `Something went wrong. ${error}`
    })
  })
};

exports.getSave = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(500).json({
        message: 'Not allowed'
      });
    }
    const id = req.query.id
    refSaveById = db.ref('/save/'+ id)
    getSaveByIdFromDatabase(res)
  });
});

exports.addSave = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    console.log(req.body);
    const data = req.body;
    refSave.child(data.id).set(data)
    getSaveFromDatabase(res);
  });
});

exports.deleteSave = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'DELETE') {
      return res.status(500).json({
        message: 'Not allowed'
      })
    }
    const id = req.query.id
    refSave.child(id).remove()
    getSaveFromDatabase(res)
  })
})


