const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile', async (req, res) => {
    try{
        let logged = false;
        if(req.session.username !== undefined){
            logged = true;
        }
        let data = {
            "logged" : logged,
            "user_id" : req.session.user_id,
            "user": {
                "id": req.session.user_id,
                "name": req.session.username,
                "password": 'Mot de passe de test',
                "mail": 'test@gmail.com'
            }
        }
        res.render('profile.html',data);

    } catch (err) {
        if (err) throw err;
    }
});

router.post('/profile/update', async (req, res) => {
    try{

        let file = req.files.file;
        let filename = req.session.user_id;

        await file.mv('./static/img/users-pfp/'+filename+'.png', function (err) {
            if (err) throw err;
            res.redirect("/user/profile");
        });

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