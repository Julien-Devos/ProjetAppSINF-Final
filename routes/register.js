const express = require('express');
const User = require("../models/User");
const router = express.Router();

router.get('/', async (req, res) => {
    try{

        res.render('register.html');

    } catch (err) {
        if (err) throw err;
    }
});

router.post('/reg', async (req, res) => {
    try {

        if(req.body.password === req.body.passwordConf){
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                mail: req.body.mail
            });

            await user.save();
            res.redirect('/login');
        }
        else{
            res.redirect('/register');
        }
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;