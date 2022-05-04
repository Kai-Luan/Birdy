// Import des modules 
const express = require('express');
const session = require("express-session");
const Datastore = require('nedb');
const cors = require('cors')
const path = require('path');
// Import des APIs implémentés
const api = require('./api.js');
const apimessages = require('./apimessages.js');
const apifriends = require('./apifriends.js');

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

const app = express()
api_1 = require("./api.js");

app.use(session({
    secret: "a",
}));
// Creation Base de données
let db =  {}; 
db.users = new Datastore(inMemoryOnly=true);
db.friends = new Datastore(inMemoryOnly=true);
db.messages = new Datastore(inMemoryOnly=true);

app.use(cors({
    credentials: true,
    origin: true
  }))
app.use('/api', api.default(db));
app.use('/apimessages', apimessages.default(db));
app.use('/apifriends', apifriends.default(db));

// Initialisation des databases
const pik = {
  login: "pikachu",
  password: "1234",
  lastname: "chu",
  firstname: "pika"
 };
const sasha = {
  login: "sasha",
  password: "1234",
  lastname: "chu",
  firstname: "pika"
 };
 const pokeball = {
  login: "pokeball",
  password: "1234",
  lastname: "chu",
  firstname: "pika"
 };


async function g(){
  return new Promise(resolve => db.users.insert([pik, sasha, pokeball],async function (err, newDoc){
    if (newDoc){
      console.log("Pikachu inserted")
      resolve(newDoc)
    } 
    else{
      console.log("Error: Pikachu not inserted")
      resolve()
    } 
  }))
}
g().then(docs => {
  console.log("ID pik: ",docs[0]._id)
  console.log("ID sasha: ",docs[1]._id)
  const m1 = {
    author_id: docs[0]._id,
    author_name: "pikachu",
    date: new Date(),
    text: "I am pikachu",
   };

  const m2 = {
    author_id: docs[1]._id,
    author_name: "sasha",
    date: new Date(),
    text: "Hello",
   };

  const m3 = {
    author_id: docs[2]._id,
    author_name: "pokeball",
    date: new Date(),
    text: "Catch them all"
   };
  
  const f1 = {
    userid: docs[0]._id,
    username: "pikachu",
    friend_id: docs[1]._id,
    friendname: "Sasha",
   };
   const f2 = {
    userid: docs[0]._id,
    username: "pikachu",
    friend_id: docs[2]._id,
    friendname: "pokeball",
   };
   const f3 = {
    userid: docs[1]._id,
    username: "Sasha",
    friend_id: docs[2]._id,
    friendname: "Pokeball"
   }
   // Messages
   db.messages.insert([m1, m2], function (err, newDoc){
    // Do nothing
    if (newDoc) console.log("Pikachu message inserted")
    else console.log("Error: Pikachu mesage not inserted")
  })
  // Friends
  db.friends.insert([f1, f2, f3], function (err, newDoc){
    // Do nothing
    if (newDoc) console.log("Pikachu Friend inserted")
    else console.log("Error: Pikachu Friend not inserted")
  })
})

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;
