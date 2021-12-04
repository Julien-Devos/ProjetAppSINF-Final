const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Game = require('../models/Game');
const utils = require('../utils/utils');
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{
        const recentPosts = await Post.find().sort({ "date" : -1}).limit(5);

        for (i in recentPosts){
            const user = await User.findOne({"_id": recentPosts[i]['author_id'] });

            recentPosts[i]["displayedDate"] = utils.dateToTime(recentPosts[i]["date"]);

            recentPosts[i]['author'] = user['username'];
            const game = await Game.findOne({'_id':recentPosts[i]['game_id']});
            recentPosts[i]['game'] = game['name']

        }

        const trendingPosts = await Post.find().sort({ "likes" : 1}).limit(5);

        for (i in trendingPosts){
            const user = await User.findOne({"_id": trendingPosts[i]['author_id'] });

            trendingPosts[i]["displayedDate"] = utils.dateToTime(trendingPosts[i]["date"]);

            trendingPosts[i]['author'] = user['username'];
            const game = await Game.findOne({'_id':trendingPosts[i]['game_id']});
            trendingPosts[i]['game'] = game['name']

        }

        const games = await Game.find();
        let data = {
            "logged" : true,
            "recentPosts" : recentPosts,
            "trendingPosts" : trendingPosts,
            "games" : games
        }

        res.render('home.html',data);

    } catch (err) {
        if (err) throw err;
    }
});


router.get('/newPost', async (req, res) => {
    try{

        let data = {
            "logged" : true,
        }

        res.render('newpost.html',data);

    } catch (err) {
        if (err) throw err;
    }
});


module.exports = router;