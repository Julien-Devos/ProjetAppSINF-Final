const express = require('express');
const router = express.Router();
const utils = require('../utils/utils');
const Post = require('../models/Post');
const Game = require('../models/Game');

router.get('/', async (req, res) => {
    try{
        let recentPosts = await Post.find().sort({ "date" : -1}).limit(5);

        // complete the posts with date, username and game
        await utils.completePost(recentPosts, req.session.user_id, function (result){
            recentPosts = result;
        });

        let trendingPosts = await Post.find().sort({ "likes" : -1}).limit(5);

        // complete the posts with date, username and game
        await utils.completePost(trendingPosts, req.session.user_id, function (result){
            trendingPosts = result;
        });
        console.log(recentPosts)

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
            "recentPosts" : recentPosts,
            "trendingPosts" : trendingPosts
        }

        res.render('home.html',data);
    } catch (err) {
        if (err) throw err;
    }
});


router.get('/newPost', async (req, res) => {
    try{

        const games = await Game.find({});

        let logged = false;
        if(req.session.username !== undefined){
            logged = true;
            let data = {
                "logged" : logged,
                "user_id": req.session.user_id,
                "games" : games
            }

            res.render('newpost.html',data);
        }
        else{
            res.redirect('/login');
        }

    } catch (err) {
        if (err) throw err;
    }
});


module.exports = router;