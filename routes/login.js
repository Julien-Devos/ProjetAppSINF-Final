const express = require('express');
const User = require("../models/User");
const router = express.Router();

let message = false;

/**
 * GET - root/login/
 *
 * Render login page
 *
 */
router.get('/', (req, res) => {
    try{
        let data = {
            "logError": message
        }
        res.render('login.html',data);
        message = false;

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});


/**
 * POST root/login/log
 *
 * Check if the username and password matches and if they match set session
 *
 */
router.post('/log', async (req, res) => {
    try {
        const user = await User.findOne({'username':req.body.username})

        if (!(user === null) && (user['password'] === req.body.password)){
            console.log("User: " + user["username"] + " is connected.")
            req.session.username = user["username"];
            req.session.user_id = user["_id"];

            res.redirect('/');
        }
        else if(user === null){
            message = {"message":"Ce nom d'utilisateur n'existe pas."}
            res.redirect("/login")
        }
        else{
            message = {"message":"Mot de passe incorrect."}
            res.redirect("/login")
        }
    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }

});

router.get('/logout', async (req, res) => {
    try {

        console.log("User: "+req.session.username+" is disconnected.")
        req.session.username = undefined;
        req.session.user_id = undefined;

        res.redirect('/');

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }

});

module.exports = router;