const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {execMap} = require("nodemon/lib/config/defaults");


router.get('/profile', async (req, res) => {
    try{

        res.render('profile.html');

    } catch (err) {
        if (err) throw err;
    }
});


router.post('/add', async (req,res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        mail: req.body.mail
    });

    try {
        const addedUser = await user.save();
        res.json(addedUser);
        // res.redirect('login');
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;