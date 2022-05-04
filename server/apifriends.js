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
        console.log('APIFRIENDS: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const users = new Users.default(db);
    const friends = new Friends.default(db);
    router
        // Get FriendList from userid
        .get("/user/:user_id/friends", async (req, res) => {
        try {
            if (!req.session.userid){
                res.status(401).json({
                    status: 401,
                    message: "Permission denied: user not connected"
                });
                return;
            }
            // On stocke le message dans la base de donnnées
            let list = await friends.getListFriend(req.params.user_id);
            if (!list) res.status(500).send("erreur interne");
            else{
                res.status(200).json({
                    status: 200,
                    friends:list
                });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    });
    // DELETE Friend relationship
    router
    .route("/user/:user_id/friends/:friendid")
    .delete(async (req, res) => {
        try {
            if (!req.session.userid){
                res.status(401).json({
                    status: 401,
                    message: "Permission denied: user not connected"
                });
                return;
            }
            if (req.params.user_id!==req.params.user_id){
                res.status(401).json({
                    status: 401,
                    message: "Permission denied: user not connected with correct login"
                });
                return;
            }
            if(! await users.get(req.params.friendid)) {
                res.status(401).json({
                    status: 401,
                    message: "friendid inconnu"
                });
                return;
            }
            if (! await friends.getFriendRelationship(req.params.user_id, req.params.friendid)){
                res.status(401).json({
                    status: 401,
                    message: "user ne suit pas friend"
                });
                return
            }
            let id = await friends.deleteFriend(req.params.user_id, req.params.friendid)
            if (!id) res.status(500).send("erreur interne");
            else{
                res.status(200).json({
                    status: 200,
                    messages: `user ${req.params.user_id} unfollowed user ${req.params.friendid}`
                });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    // Create Friend Relationship
    .post(async (req, res) => {
        try {
            if (!req.session.userid){
                res.status(401).json({
                    status: 401,
                    message: "Permission denied: user not connected"
                });
                return;
            }
            if (req.session.userid === req.params.friendid){
                res.status(401).json({
                    status: 401,
                    message: "On ne peut pas se suivre soi-même"
                });
                return;
            }

            const friend = await users.get(req.params.friendid)
            if(! friend) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            // On stocke le message dans la base de donnnées
            const userid = await friends.create(req.session.userid, req.session.username, friend._id, friend.login);
            if (!userid) res.status(500).send("erreur interne");
            else{
                res.status(200).json({
                    status: 200,
                    "id": userid
                });
            }
        }
        catch (e) {
            res.status(500).send(e);
        }
    });
    // Get Friend Info
    router.get("/user/:userid/infos", async (req,res)=>{
        try{
            const v = await friends.getFriendInfo(req.params.userid);
            if (!v) res.status(500).send("Erreur Interne");
            res.status(200).json({
                status: 200,
                count: v
            });
        }
        catch (e) {
            res.status(500).send(e);
        }})
    return router;
}
exports.default = init;

