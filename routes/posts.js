const express = require('express');
const router = express.Router();
const utils = require("../utils/utils");
const Post = require('../models/Post');
const Game = require("../models/Game");

router.get('/', async (req, res) => {
    try{
        let search = "Posts";

        // create the filter for the db search
        let filter = "";
        await utils.createSearchFilter(req,function (result) {
            filter = result;
        });

        // get the page nbr of the request and if none page = 1
        let { page = 1 } = req.query;
        page = parseInt(page);


        let posts = await Post.find(filter).sort({ "date" : -1});
        let noPosts = false;
        if (posts.length === 0){
            noPosts = true;
        }


        let orderedResults = [];
        if (req.query.search !== "" && req.query.search !== undefined){
            await utils.orderResults(posts,req, (result) => {
                orderedResults = result;
            });
            search = req.query.search;
        }
        else {
            orderedResults = posts;
        }


        // make orderedResults array contains correct posts for pagination
        orderedResults = utils.correctPosts(orderedResults,page);


        // complete the post with the the displayed date, the author username and the game name
        await utils.completePost(posts, req.session.user_id, function (result){
            posts = result;
        });

        let nbrPosts = posts.length;

        // text to say how many posts were found according to the search request
        let searchResults = utils.searchResults(req, nbrPosts);

        // used for the pagination
        let pageNav = utils.pagination(req, page, posts, nbrPosts);


        // find all the games for the navbar game filter
        const games = await Game.find().sort({"name":1});

        let logged = false;
        if(req.session.username !== undefined){
            logged = true;
        }
        let data = {
            "logged" : logged,
            "user_id" : req.session.user_id,
            "search": search,
            "games" : games,
            "posts" : orderedResults,
            "searchResults" : searchResults,
            "previous": pageNav[0],
            "pagination": pageNav[1],
            "next": pageNav[2],
            "noPosts": noPosts
        }

        res.render('posts.html',data);

    } catch (err) {
        console.log("Error: "+err);
        res.render("error.html");
    }
});

module.exports = router;