const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const {execMap} = require("nodemon/lib/config/defaults");

router.get('/', async (req, res) => {
    try{
        let posts = await Post.find({});

        console.log(posts)

        let data = {
            "logged" : false,
            "posts" : posts,
            "games" : false
        }

        console.log(posts)
        res.render('all_posts.html',data);
    } catch (err) {
        if (err) throw err;
    }
});

module.exports = router;