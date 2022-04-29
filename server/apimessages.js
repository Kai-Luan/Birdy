const express = require("express");
const Users = require("./entities/users.js");
const Messages = require("./entities/messages.js");

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const messages = new Messages.default(db);
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
    router.route("/user/:user_id/messages")
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
    return router;
}
exports.default = init;

