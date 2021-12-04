const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Game = require('../models/Game');
const Comment = require('../models/Comment');
const utils = require('../utils/utils');
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{
        let post = await Post.findOne({"_id":req.query.id});

        post["displayedDate"] = utils.dateToTime(post["date"]);

        let user = await User.findOne({'_id': post["author_id"]});

        post["author"] = user["username"];

        let game = await Game.findOne({'_id': post["game_id"]});

        post["game"] = game["name"];

        let comments = await Comment.find({'post_id': req.query.id});

        for (i in comments){
            let user = await User.findOne({'_id': comments[i]["author_id"]});
            comments[i]["author"] = user["username"];
            comments[i]["displayedDate"] = utils.dateToTime(comments[i]["date"]);
        }

        let data = {
            "logged" : true,
            "post" : post,
            "comments": comments,
            "games" : false
        }

        res.render('post.html',data);
    } catch (err) {
        if (err) throw err;
    }
});

router.post('/add', async (req,res) => {
    const post = new Post({
        game_id: req.body.game_id,
        author_id: req.body.author_id,
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message:err });
    }
});

router.post('/like', async (req,res) => {
    await Post.updateOne({"_id":req.query.id},{$inc:{"likes":1}})

    try {
        res.redirect('/post?id='+req.query.id)
    } catch (err) {
        res.json({ message:err });
    }
});

router.post('/addComment', async (req,res) => {
    const comment = new Comment({
        post_id: req.body.post_id,
        author_id: req.body.author_id,
        content: req.body.content
    });

    await Post.updateOne({"_id":req.body.post_id},{$inc:{"comments":1}})

    try {
        const savedComment = await comment.save();
        res.json(savedComment);
        // res.redirect("/post?id="+req.query.post_id);
    } catch (err) {
        if (err) throw err;
    }
});

router.delete('/delComment', async (req,res) => {

    await Post.deleteOne({"_id":req.body.post_id},{$inc:{"comments":1}})

    try {
        const savedComment = await comment.save();
        res.json(savedComment);
        // res.redirect("/post?id="+req.query.post_id);
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;