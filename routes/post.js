const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Game = require('../models/Game');
const User = require('../models/User');
const Comment = require('../models/Comment');
const utils = require('../utils/utils');
const fs = require("fs");

router.get('/', async (req, res) => {
    try{
        let post = await Post.find({"_id":req.query.id});

        // complete the posts with date, username and game
        await utils.completePost(post, req.session.user_id, function (result){
            post = result;
        });

        let comments = await Comment.find({'post_id': req.query.id});

        // get all the comments for the post and complete them with author and date
        await utils.addPostComments(comments, req.session.user_id, function (result){
            comments = result;
        });

        // find all the games for the navbar game filter
        const games = await Game.find().sort({"name":1});

        let logged = false;
        if(req.session.username !== undefined) {
            logged = true;
        }
        let data = {
            "logged" : logged,
            "user_id" : req.session.user_id,
            "games" : games,
            "post" : post,
            "post_id": req.query.id,
            "comments": comments
        }

        res.render('post.html',data);

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});


router.post('/add', async (req,res) => {
    try {
        const user = await User.findOne({"_id":req.session.user_id});
        const game = await Game.findOne({"_id":req.body.game_id});

        let currDate = new Date().toLocaleString("fr-BE").split(',')[0];

        const post = new Post({
            game_id: req.body.game_id,
            author_id: req.session.user_id,
            title: req.body.title,
            content: req.body.content,
            subject: user["username"] + " " + game["name"] + " " + req.body.title + " " + req.body.content + " " + currDate
        });

        const savedPost = await post.save();

        await utils.updatePostsWords(savedPost);

        res.redirect('/post?id='+savedPost["_id"])

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/like', async (req,res) => {
    try {

        if (req.session.user_id !== undefined) {
            const post = await Post.findOne({"_id":req.query.id})

            let postLikes = post["like_id"];
            let indexOf = postLikes.indexOf(req.session.user_id)
            if (indexOf > -1){

                postLikes.splice(indexOf, 1);
                await Post.updateOne({"_id": req.query.id}, {$inc: {"likes": -1}, $set: {"like_id":postLikes}})
            }
            else {

                postLikes.push(req.session.user_id)
                await Post.updateOne({"_id": req.query.id}, {$inc: {"likes": 1}, $set: {"like_id":postLikes}})
            }

            res.redirect('/post?id='+req.query.id)
        }
        else{
            res.redirect('/login');
        }

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/likeComm', async (req,res) => {
    try {

        if (req.session.user_id !== undefined) {
            const comm = await Comment.findOne({"_id":req.query.id})

            let commLikes = comm["like_id"];
            let indexOf = commLikes.indexOf(req.session.user_id);
            if (indexOf > -1){
                commLikes.splice(indexOf, 1);
                await Comment.updateOne({"_id": req.query.id}, {$inc: {"likes": -1}, $set: {"like_id":commLikes}});
            }
            else {
                commLikes.push(req.session.user_id)
                await Comment.updateOne({"_id": req.query.id}, {$inc: {"likes": 1}, $set: {"like_id":commLikes}});
            }

            const comment = await Comment.findOne({"_id": req.query.id});
            res.redirect('/post?id='+comment["post_id"])
        }
        else{
            res.redirect('/login');
        }

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/addComment', async (req,res) => {
    try {
        if (req.session.user_id !== undefined){
            const comment = new Comment({
                post_id: req.body.post_id,
                author_id: req.session.user_id,
                content: req.body.content
            });
            await comment.save();

            const post = await Post.findOne({"_id":req.body.post_id});

            let newSubject = post["subject"] + " " +  req.body.content;

            await Post.updateOne({"_id":req.body.post_id},{$inc:{"comments":1},$set:{"subject":newSubject}});
            res.redirect("/post?id="+req.body.post_id);
        }
        else{
            res.redirect("/login");
        }


    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/delPost', async (req,res) => {
    try {
        const post = await Post.findOne({"_id":req.body.id});

        if (req.session.user_id === post["author_id"]){
            await Post.deleteOne({"_id":req.body.id});
            await Comment.deleteMany({"post_id":req.body.id});
        }

        await utils.deletePostWords(req.body.id);

        res.redirect("/");

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

router.post('/delComment', async (req,res) => {
    try {
        const comm = await Comment.findOne({"_id":req.body.id});

        if (req.session.user_id === comm["author_id"]){
            await Post.updateOne({"_id":req.body.post_id},{$inc:{"comments":-1}});
            await Comment.deleteOne({"_id":req.body.id});
        }

        res.redirect("/post?id="+req.body.post_id);

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

module.exports = router;