const express = require("express");
const Users = require("./entities/users.js");

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

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
    const users = new Users.default(db);
    //Login
    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            if (userid) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        req.session.username = login;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            userid: userid
                        });
                        req.session.save()
                    }
                });
                return;
            }
            // destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });
    router
    // Logout
        .route("/user/logout")
        .delete((req, res) => {
        req.session.destroy((err) => { 
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne"
                });
            }
            else {
                res.status(200).json({
                    status: 200,
                    message: "Logout accepté"
                });
            }
        });
    })
    router.get("/user/infos", async (req,res)=>{
        try{
            console.log("1")
            const v = await users.getUserInfo();
            console.log("1")
            if (!v) res.status(500).send("Erreur Interne");
            res.status(200).json({
                status: 200,
                count: v
            });
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    router
    .route("/user/:user_id")
    // Get User
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            if (!user) res.sendStatus(404);
            else res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    // Delete User
    .delete((req, res, next) => {
        if (!req.session.userid){
            res.status(401).json({
                status: 401,
                message: "Permission denied: user not connected"
            });
            return;
        }
        users.deleteUser(req.session.userid)
        res.send(`delete user ${req.session.userid}`)
    });
    // Create User
    router.put("/user", (req, res) => {
        const { login, password, lastname, firstname } = req.body;
        if (!login || !password || !lastname || !firstname) {
            res.status(400).send("Missing fields");
        } else {
            users.create(login, password, lastname, firstname)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });
    return router;
}
exports.default = init;

