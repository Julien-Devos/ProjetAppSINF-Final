const express = require('express');
const User = require("../models/User");
const router = express.Router();

let message = false;

router.get('/', async (req, res) => {
    try{

        let data = {
            "logError": message
        }
        res.render('register.html',data);
        message = false;

    } catch (err) {
        if (err) throw err;
    }
});

router.post('/reg', async (req, res) => {
    try {

        if(req.body.password === req.body.passwordConf){
            const sameUsername = await User.findOne({'username':req.body.username});

            if (sameUsername == null){

                const sameEmails = await User.findOne({'mail':req.body.mail});

                if (sameEmails == null){

                    const user = new User({
                        username: req.body.username,
                        password: req.body.password,
                        mail: req.body.mail
                    });

                    await user.save();
                    res.redirect('/login');

                }
                else{
                    message = {"message":"Cette adresse mail est déjà utilisée."}
                    res.redirect('/register');
                }

            }
            else{
                message = {"message":"Ce nom d'utilisateur existe déjà."}
                res.redirect('/register');
            }
        }
        else{
            message = {"message":"Les mots de passes ne correspondent pas."}
            res.redirect('/register');
        }
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;