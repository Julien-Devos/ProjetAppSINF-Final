const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post')



router.get('/profile', async (req, res) => {
    try{
        const user = await User.findOne({"_id":req.session.user_id})

        const posts = await Post.find({"author_id":req.session.user_id})
        console.log(posts)

        let likes = 0;
        let comments = 0;
        for (i in posts){
            likes += posts[i]["likes"];
            comments += posts[i]["comments"];
        }
        console.log(likes,comments)

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
                "password": user["password"],
                "mail": user["mail"],
                "likes" : likes,
                "comments" : comments,
                "posts" : posts.length
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