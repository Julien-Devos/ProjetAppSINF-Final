const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Game = require('../models/Game');
const Comment = require('../models/Comment');
const utils = require('../utils/utils');

router.get('/', async (req, res) => {
    try{
        let post = await Post.find({"_id":req.query.id});

        // complete the posts with date, username and game
        await utils.completePost(post,function (result){
            post = result;
        });

        let comments = await Comment.find({'post_id': req.query.id});

        // get all the comments for the post and complete them with author and date
        await utils.addPostComments(comments,function (result){
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
            res.redirect("/post?id="+req.body.post_id);
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