const express = require("express");
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");
const Friends = require("./entities/friends.js");

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('APIMESSAGES: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const messages = new Messages.default(db);
    const friends = new Friends.default(db);
    const users = new Users.default(db);
    // Create Message
    router
        .route("/user/messages")
        .post(async (req, res) => {
        try {
            if (!req.session){
                res.status(401).json({
                    status: 401,
                    message: "Permission denied: user not connected"
                });
                return;
            }
            const { text } = req.body;
            if (!text){ // On verifie les paramètres
                res.status(400).send("Missing fields");
                return;
            }
            // On stocke le message dans la base de donnnées
            const message  = await messages.create(req.session.userid, req.session.username, text);
            if (!message) res.status(500).send("erreur interne");
            else{
                res.status(200).json({
                    status: 200,
                    "id": message._id
                });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    router.route("/user/:user_id/messages")
        // Get Messages from user
        .get(async (req, res) => {
            try {
                const list = await messages.getListMessageFromUser(req.params.user_id);
                if (!list){
                    res.sendStatus(500);
                }
                else{
                    res.status(200);
                    res.send(list);
                }
            }
            catch (e) {
                res.status(500).send(e);
            }
        })
        // Create New Message From user
        .put(async (req, res) => {
            try {
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Permission denied: user not connected"
                    });
                    return;
                }
                const { new_message, old_message, date } = req.body;
                if (!new_message || !old_message){ // On verifie les paramètres
                    res.status(400).send("Missing fields");
                    return;
                }
                // On stocke le message dans la base de donnnées
                const message  = await messages.setMessage(req.session.userid, req.session.username, date, new_message, old_message);
                if (!message) res.status(500).send("erreur interne");
                else{
                    res.status(200).json({
                        status: 200,
                        message: new_message
                    });
                }
            }
            catch (e) {
                res.status(500).send(e);
            }
        })
    // Delete a Message 
    router.delete("/user/:user_id/messages/:message_id", async (req, res) => {
            try {
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Permission denied: user not connected"
                    });
                    return;
                }
                // On stocke le message dans la base de donnnées
                const r  = await messages.removeMessage(req.params.message_id);
                if (!r) res.status(500).send("erreur interne");
                else{
                    res.status(200).json({
                        status: 200,
                        message: `message ${req.params.message_id} deleted`
                    });
                }
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Get All Messages From user Friends
        router.get("/user/:user_id/messages/friends", async (req, res) => {
            try {
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Permission denied: user not connected"
                    });
                    return;
                }
                console.log("\tGet Friend List")
                let listFriends = await friends.getListFriend(req.session.userid)
                console.log("\tFriends: ", listFriends)
                listFriends = listFriends.map(({friend_id}) => friend_id)
                const list  =  await messages.getListMessageFromAllFriend(listFriends)
                console.log("\tMessages: ", list)
                if (!list) res.status(500).send("erreur interne");
                else{
                    res.status(200).json({
                    status: 200,
                    messages: list
                    });
                }

            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Recherche de Messages selon des mots-clés, seulement avec les personnes suivies par user
        router.get("/messages/filter/friends/:keywords", async (req, res) => {
            try {
                if (!req.session.userid){
                    res.status(401).json({
                        status: 401,
                        message: "Permission denied: user not connected"
                    });
                    return;
                }
                const keywords = req.params.keywords.split(' ')
                const listFriends = await friends.getListFriend(req.session.userid)
                console.log("Friends: ", listFriends)
                const list = await messages.getFilteredListMessage(keywords, listFriends)
                console.log("Friends: ", list)
                if (!list) res.status(500).send("erreur interne");
                else{
                    res.status(200).json({
                    status: 200,
                    messages: list
                    });
                }
                return
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Recherche de Messages selon des mots-clés
        router.get("/messages/filter/:keywords", async (req, res) => {
            try {
                if (!req.params.keywords) {
                    res.status(400).json({
                        status: 400,
                        "message": "Requête invalide : mot-clés nécessaires"
                    });
                    return;
                }
                const keywords = req.params.keywords.split(' ')
                console.log("\tGet Filtered list - keywords: ", keywords)
                const list = await messages.getFilteredListMessage(keywords)
                console.log("\tDone: list = ", list)
                if (!list) res.status(500).send("erreur interne");
                else{
                    res.status(200).json({
                    status: 200,
                    messages: list
                    });
                }
                return
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Get Messages Count
        router.get("/messages/infos", async (req, res) => {
            try{
                const v = await messages.getInfoAllMessage();
                if (!v) res.status(500).send("Erreur Interne");
                res.status(200).json({
                    status: 200,
                    count: v
                });
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Get Messages User Count
        router.get("/user/:userid/infos", async (req, res) => {
            try{
                console.log("1")
                const v = await messages.getInfoMessageUser(req.params.userid);
                console.log("1")
                if (!v) res.status(500).send("Erreur Interne");
                res.status(200).json({
                    status: 200,
                    count: v
                });
                return
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
        // Get All Messages from BD
        router.get("/messages", async (req, res) => {
            try {
                const list = await messages.getListMessage();
                if (!list){
                    res.sendStatus(500);
                }
                else{
                    res.status(200);
                    res.send(list);
                }
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    return router;
}
exports.default = init;