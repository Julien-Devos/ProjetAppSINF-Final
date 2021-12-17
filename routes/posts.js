const express = require('express');
const router = express.Router();
const utils = require("../utils/utils");
const Post = require('../models/Post');
const Game = require("../models/Game");
const fs = require("fs");
const e = require("express");

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


        // .limit(5).skip((page - 1) * 5) //TODO gérer la pagination avec sorted results
        let posts = await Post.find(filter).sort({ "date" : -1});

        console.log("filter:",JSON.stringify(filter));

        let orderedResults = [];
        console.log(req.query.search)
        if (req.query.search !== "" && req.query.search !== undefined){
            await utils.orderResults(posts,req, (result) => {
                orderedResults = result;
            });
        }
        else {
            orderedResults = posts;
        }


        // complete the post with the the displayed date, the author username and the game name
        await utils.completePost(posts, req.session.user_id, function (result){
            posts = result;
        });

        let allPosts = await Post.find(filter);
        let nbrPosts = allPosts.length;

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
            "games" : games,
            "posts" : orderedResults,
            "searchResults" : searchResults,
            "previous": pageNav[0],
            "pagination": pageNav[1],
            "next": pageNav[2]
        }

        res.render('posts.html',data);
        console.log("FINAL RES",orderedResults)

    } catch (err) {
        console.log("Error: "+err);
        if (err) throw err;
        // res.render("error.html");
    }
});

module.exports = router;