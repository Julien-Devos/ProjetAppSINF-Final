const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Game = require('../models/Game');
const User = require('../models/User');
const Comment = require('../models/Comment');
const utils = require('../utils/utils');

router.get('/', async (req, res) => {
    try{
        let post = await Post.find({"_id":req.query.id});

        // complete the posts with date, username and game
        await utils.completePost(post, req.session.user_id, function (result){
            post = result;
        });

        console.log(post);

        let comments = await Comment.find({'post_id': req.query.id});

        // get all the comments for the post and complete them with author and date
        await utils.addPostComments(comments, req.session.user_id, function (result){
            comments = result;
        });

        // find all the games for the navbar game filter
        const games = await Game.find();

        let logged = false;
        if(req.session.username !== undefined){
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
        if (err) throw err;
    }
});

router.post('/add', async (req,res) => {
    const post = new Post({
        game_id: req.body.game_id,
        author_id: req.session.user_id,
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedPost = await post.save();
        res.redirect('/post?id='+savedPost["_id"])
    } catch (err) {
        res.json({ message:err });
    }
});

router.post('/like', async (req,res) => {
    try {

        if (req.session.user_id !== undefined) {
            const user = await User.findOne({"_id":req.session.user_id})

            let userLiked = user["liked"];
            let indexOf = userLiked.indexOf(req.query.id)
            if (indexOf > -1){

                userLiked.splice(indexOf, 1);
                await Post.updateOne({"_id": req.query.id}, {$inc: {"likes": -1}})
            }
            else {

                userLiked.push(req.query.id)
                await Post.updateOne({"_id": req.query.id}, {$inc: {"likes": 1}})
            }

            await User.updateOne({"_id": req.session.user_id}, {$set: {"liked": userLiked}})
            res.redirect('/post?id='+req.query.id)
        }
        else{
            res.redirect('/login');
        }

    } catch (err) {
        if (err) throw err;
    }
});

router.post('/likeComm', async (req,res) => {
    try {

        if (req.session.user_id !== undefined) {
            const user = await User.findOne({"_id":req.session.user_id});

            let userLiked = user["liked"];
            let indexOf = userLiked.indexOf(req.query.id);
            if (indexOf > -1){

                userLiked.splice(indexOf, 1);
                await Comment.updateOne({"_id": req.query.id}, {$inc: {"likes": -1}});
            }
            else {

                userLiked.push(req.query.id)
                await Comment.updateOne({"_id": req.query.id}, {$inc: {"likes": 1}});
            }

            await User.updateOne({"_id": req.session.user_id}, {$set: {"liked": userLiked}});
            const comm = await Comment.findOne({"_id": req.query.id});

            res.redirect('/post?id='+comm["post_id"])
        }
        else{
            res.redirect('/login');
        }

    } catch (err) {
        if (err) throw err;
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

            await Post.updateOne({"_id":req.body.post_id},{$inc:{"comments":1}});
            res.redirect("/post?id="+req.body.post_id);
        }
        else{
            res.redirect("/login");
        }


    } catch (err) {
        if (err) throw err;
    }
});

router.delete('/delComment', async (req,res) => {
    try {
        await Post.updateOne({"_id":req.body.post_id},{$inc:{"comments":-1}});
        await Comment.remove({"post_id":req.body.id});

        res.json(savedComment);
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;