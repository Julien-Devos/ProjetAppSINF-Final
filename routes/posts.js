const express = require('express');
const router = express.Router();
const utils = require("../utils/utils");
const Post = require('../models/Post');
const Game = require("../models/Game");

router.get('/', async (req, res) => {
    try{
        // create the filter for the db search
        let filter = "";
        await utils.createSearchFilter(req,function (result) {
            filter = result;
        });

        // get the page nbr of the request and if none page = 1
        let { page = 1 } = req.query;
        page = parseInt(page);

        let posts = await Post.find(filter).sort({ "date" : -1}).limit(5).skip((page - 1) * 5);

        // complete the post with the the displayed date, the author username and the game name
        await utils.completePost(posts,function (result){
            posts = result;
        });

        let nbrPosts = (await Post.find(filter)).length;

        // text to say how many posts were found according to the search request
        let searchResults = utils.searchResults(req, nbrPosts);

        // used for the pagination
        let pageNav = utils.pagination(req, page, posts, nbrPosts);


        // find all the games for the navbar game filter
        const games = await Game.find();

        let logged = false;
        if(req.session.username !== undefined){
            logged = true;
        }
        let data = {
            "logged" : logged,
            "games" : games,
            "posts" : posts,
            "searchResults" : searchResults,
            "previous": pageNav[0],
            "pagination": pageNav[1],
            "next": pageNav[2]
        }

        res.render('posts.html',data);
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;