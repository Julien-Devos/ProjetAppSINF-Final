const express = require('express');
const router = express.Router();
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{

        res.render('login.html');

    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;