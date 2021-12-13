const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post')
const utils = require("../utils/utils");
const Game = require("../models/Game");


router.get('/', async (req, res) => {
    try{
        const user = await User.findOne({"_id":req.query.id})

        let userPosts = await Post.find({"author_id":req.query.id});

        let likes = 0;
        let comments = 0;
        for (i in userPosts){
            likes += userPosts[i]["likes"];
            comments += userPosts[i]["comments"];
        }



        // complete the posts with date, username and game
        await utils.completePost(userPosts, req.session.user_id, function (result){
            userPosts = result;
        });

        let description = "Cet utilisateur n'a aucune description.";
        if (user["desc"] !== ""){
            description = user["desc"];
        }

        // find all the games for the navbar game filter
        const games = await Game.find().sort({"name":1});

        let logged = false;
        if(req.session.username !== undefined) {
            logged = true;
        }
        let data = {
            "logged": logged,
            "games": games,
            "user_id": req.session.user_id,
            "id": user["_id"],
            "name": user["username"],
            "description": description,
            "likes": likes,
            "comments": comments,
            "postNbr": userPosts.length,
            "posts" : userPosts
        }
        res.render("user.html",data)

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});


router.get('/profile', async (req, res) => {
    try{
        let logged = false;
        if(req.session.username !== undefined){
            logged = true;

            const user = await User.findOne({"_id":req.session.user_id})

            const posts = await Post.find({"author_id":req.session.user_id})

            let likes = 0;
            let comments = 0;
            for (i in posts){
                likes += posts[i]["likes"];
                comments += posts[i]["comments"];
            }

            let description = "Vous n'avez aucune description.";
            if (user["desc"] !== ""){
                description = user["desc"];
            }

            // find all the games for the navbar game filter
            const games = await Game.find().sort({"name":1});

            let data = {
                "logged" : logged,
                "user_id" : req.session.user_id,
                "games": games,
                "user": {
                    "id": req.session.user_id,
                    "name": req.session.username,
                    "password": user["password"],
                    "mail": user["mail"],
                    "likes" : likes,
                    "comments" : comments,
                    "posts": posts.length,
                    "desc": description
                }
            }
            res.render('profile.html',data);
        }
        else{
            res.redirect("/login");
        }

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
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
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/profile/updateDesc', async (req, res) => {
    try{

        await User.updateOne({"_id":req.session.user_id},{$set:{"desc":req.body.desc}});

        res.redirect('/user/profile');

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

module.exports = router;