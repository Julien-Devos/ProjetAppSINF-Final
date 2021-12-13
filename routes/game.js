const express = require('express');
const router = express.Router();
const Game = require('../models/Game');


router.get('/', async (req,res) => {
    try{
        const games = await Game.find().sort({"name":1});

        let logged = false;
        if(req.session.username !== undefined && req.session.username === "Admin") {
            logged = true;
            let data = {
                "logged": logged,
                "user_id": req.session.user_id,
                "games": games
            }

            res.render('game.html', data)
        }
        else{
            res.redirect('/')
        }

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});


router.post('/add', async (req,res) => {
    const game = new Game({
        name: req.body.name
    });

    try {
        await game.save();
        res.redirect('/game')

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

module.exports = router;