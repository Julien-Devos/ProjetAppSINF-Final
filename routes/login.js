const express = require('express');
const router = express.Router();
const {execMap} = require("nodemon/lib/config/defaults");
const User = require("../models/User");

router.get('/', (req, res) => {
    try{
        data = {
            "logError": {"message":"Erreur"}
        }
        res.render('login.html',data);

        res.render('login.html');

    } catch (err) {
        if (err) throw err;
    }
});

router.post('/log', async (req, res) => {
    try {
        const user = await User.findOne({'username':req.body.username})

        console.log("user "+user)

        if (!(user === null) && (user['password'] === req.body.password)){
            console.log("password correct")
            req.session.username = user["username"];
            req.session.user_id = user["_id"];

            res.redirect('/');
        }
        else{
            res.redirect("/login")
        }
    } catch (err) {
        if (err) throw err;
    }

});

router.get('/logout', async (req, res) => {
    try {

        console.log("User: "+req.session.username+" is disconnected.")
        req.session.username = undefined;
        req.session.user_id = undefined;

        res.redirect('/');
    } catch (err) {
        if (err) throw err;
    }

});

module.exports = router;