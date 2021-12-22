const Game = require("../models/Game");
const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {


    /**
     * Used to transform a Date obj into a string to tell how much time has passed since the post has been posted
     *
     * @param {Date} postDate Date the post has been posted.
     * @return {string} how much time has passed since the post has been posted
     */
    dateToTime: (postDate) => {
        let currDate = new Date();
        const months = ["Janv.","Févr.","Mars","Avr.","Mai","Juin","Juil.","Août","Sep.","Oct.","Nov.","Déc."];

        const diffTime = Math.abs(currDate - postDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMin = Math.floor(diffTime / (1000 * 60));
        const diffSec = Math.floor(diffTime / 1000);

        if (diffHrs < 24){

            if (diffSec === 0){
                return "à l'instant.";
            }
            else if (diffSec < 60){
                return "Il y a " + Math.round(diffSec) + "s";
            }
            else if (diffMin < 60){
                return ("Il y a " + Math.round(diffMin) + " min.");
            }
            else {
                return ("Il y a " + Math.round(diffHrs) + "h");
            }
        }
        else if (diffDays >= 365){
            let dateString = postDate.toLocaleString('fr-BE').split(",")[0].split('/');
            let day = dateString[0];
            let month = months[dateString[1] - 1];
            let year = dateString[2];

            return (day + " " + month + " " + year);
        }
        else{
            let dateString = postDate.toLocaleString('fr-BE').split(",")[0].split('/');
            let day = dateString[0];
            let month = months[dateString[1] - 1];

            return (day + " " + month);
        }
    },


    /**
     * Create a filter for the search in the db
     *
     * @param req
     * @param f
     * @returns {Promise<void>} execute the function f with the filter created
     */
    createSearchFilter: async (req,f) => {
        let filter = {};
        let search = req.query.search;

        if (req.query.search !== undefined){
            search = module.exports.lemmatizeWordsOfString(req.query.search);
        }

        if (! (req.query.filter === undefined) ){

            let gameFilter = req.query.filter;
            if (typeof gameFilter === "string"){
                gameFilter = gameFilter.split(",");
            }
            if (gameFilter.length === 1){
                gameFilter = gameFilter[0];

                const game = await Game.findOne({"name":gameFilter});
                if (req.query.search !== ""){
                    filter = {$and: [{"game_id":game["_id"]},{$text: {$search: search}}]};
                }
                else{
                    filter = {$and: [{"game_id":game["_id"]}]};
                }
            }
            else{
                let orList = [];

                for ( let i in gameFilter){
                    const game = await Game.findOne({"name":gameFilter[i]});
                    orList.push({"game_id":game["_id"]});
                }
                if (req.query.search !== ""){
                    filter = {$and: [{$or: orList},{$text: {$search: search}}]};
                }
                else{
                    filter = {$and: [{$or: orList}]};
                }
            }
        }
        else if (req.query.search === ""){
            filter = {};
        }
        else{
            filter = {$text: {$search: search}};
        }
        f(filter);
    },


    /**
     * Complete a post with Author's username, displayedDate, game name and liked if the curr user has liked this post
     *
     * @param posts
     * @param curr_user_id
     * @param f
     * @returns {Promise<void>} execute the function f with the completed post
     */
    completePost: async (posts, curr_user_id, f) => {
        for (let i in posts){

            if(curr_user_id !== undefined){

                let indexOf = posts[i]["like_id"].indexOf(curr_user_id.toString())
                if (indexOf > -1){
                    posts[i]["liked"] = "liked";
                }


                if (posts[i]["author_id"] === curr_user_id){
                    posts[i]["postAuthor"] = true;
                }
            }

            const user = await User.findOne({"_id": posts[i]['author_id'] });

            posts[i]["displayedDate"] = module.exports.dateToTime(posts[i]["date"]);

            posts[i]['author'] = user['username'];
            const game = await Game.findOne({'_id':posts[i]['game_id']});
            posts[i]['game'] = game['name']

        }
        f(posts);
    },


    /**
     * Complete comments with Author's username, displayedDate and liked if the curr user has liked this comment
     *
     * @param comments
     * @param curr_user_id
     * @param f
     * @returns {Promise<void>} execute the function f with the completed post
     */
    addPostComments: async (comments, curr_user_id, f) => {
        for (let i in comments){

            if(curr_user_id !== undefined){

                let indexOf = comments[i]["like_id"].indexOf(curr_user_id.toString())
                if (indexOf > -1){
                    comments[i]["liked"] = "liked";
                }

                if (comments[i]["author_id"] === curr_user_id){
                    comments[i]["commentAuthor"] = true;
                }
            }

            let user = await User.findOne({'_id': comments[i]["author_id"]});

            comments[i]["author"] = user["username"];
            comments[i]["displayedDate"] = module.exports.dateToTime(comments[i]["date"]);
        }
        f(comments)
    },


    /**
     * Returns the pagination params according to the number of posts and the current page
     *
     * @param req
     * @param {number} page
     * @param {Array} posts
     * @param {number} nbrPosts
     * @returns {Array} array with pagination params
     */
    pagination: (req,page,posts,nbrPosts) => {

        const pageNbr = Math.ceil(nbrPosts/5);
        let pageNav = [false,false,false];

        if (nbrPosts > 0){
            let filterParams = "";
            if (! (req.query.filter === undefined) ){
                filterParams = "&filter="+req.query.filter;
            }
            let link = "/posts?search="+req.query.search+filterParams+"&page=";

            pageNav = [{"disabled":"","link":link+(page-1)},[],{"disabled":"","link":link+(page+1)}];

            if (page === 1){
                pageNav[0]["disabled"] = "disabled"
            }
            if (page === pageNbr){
                pageNav[2]["disabled"] = "disabled"
            }

            for (let i = 0; i<pageNbr; i++){
                let status = "";
                if (i+1 === page){
                    status = "active";
                }
                let linkParams = {"active":status,"link":"/posts?search="+req.query.search+filterParams+"&page="+(i+1),"page":i+1};
                pageNav[1].push(linkParams)
            }
        }
        return pageNav;
    },


    /**
     * Returns informations string with total found posts according to the search for the posts page
     *
     * @param req
     * @param nbrPosts
     * @returns {string}
     */
    searchResults: (req, nbrPosts) => {

        if (req.query.filter === undefined && req.query.search === ""){
            return "Il y a au total " + nbrPosts + " posts sur le site." // message displayed when no filter and no search
        }
        else {
            let filters = req.query.filter;
            if ( typeof filters === "object" ){
                filters = req.query.filter.join(", ");
            }

            if (req.query.filter === undefined) {
                return nbrPosts + ' posts trouvés contenant "' + req.query.search + '".'  // message displayed when no filter
            }
            else if (req.query.search === ""){
                return nbrPosts + ' posts trouvés pour: " ' + filters + ' ".'  // message displayed when no search
            }
            else {
                return nbrPosts + ' posts trouvés pour: " ' + filters + ' " contenant " ' + req.query.search + ' ".'  // message displayed when search and filter
            }
        }
    },


    /**
     * Remove point or comma, s if the word is in the plural and l' or s' or c' or qu'
     *
     * @param s
     * @returns {string}
     */
    lemmatisation: (s) => {
        if(s.substring(0,2) === "l'" || s.substring(0,2) === "s'" || s.substring(0,2) === "c'"){
            s = s.substring(2,s.length)
        }
        else if (s.substring(0,3) === "qu'"){
            s = s.substring(3,s.length)
        }

        if (s.substring(s.length-2,s.length) === 's.' || s.substring(s.length-2,s.length) === 's,'){
            s = s.substring(0,s.length-2);
        }
        else if (s[s.length-1] === 's' || s[s.length-1] === ',' || s[s.length-1] === '.'){
            s = s.substring(0,s.length-1);
        }
        return s;
    },


    /**
     * Returns the term frequency of the word m in document d
     *
     * @param m
     * @param d
     * @returns {number}
     */
    tfFunct: (m,d) => {
        let occurOfmInDoc = d[m];
        let numberOfWordsInDoc = 0;
        for (let word in d){
            numberOfWordsInDoc += d[word];
        }
        return Math.log10(1+(occurOfmInDoc/numberOfWordsInDoc));
    },


    /**
     * Return inverse document frequency of the docs containing the words according to all docs
     *
     * @param docsWithWord
     * @param allDocs
     * @returns {number}
     */
    idfFunct: (docsWithWord,allDocs) => {
        return Math.log10(allDocs/docsWithWord);
    },


    /**
     * Update the postsWords.json with the subject of the saved posts
     * Count occur of each word in the savedPost subject and update the json file
     *
     * @param savedPost
     * @returns {Promise<void>}
     */
    updatePostsWords: async (savedPost) => {

        await fs.readFile('./private/postsWords.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed: ", err);
                return;
            }
            let postsWords = JSON.parse(jsonString);
            let docIndex = savedPost["_id"];

            let docContent = {};
            let splittedSubject = savedPost["subject"].split(" ");

            for (let i = 0; i<splittedSubject.length; i++){
                let currWord = module.exports.lemmatisation(splittedSubject[i].toLowerCase())

                if (currWord in docContent){
                    docContent[currWord] ++;
                }
                else{
                    if (currWord !== ""){
                        docContent[currWord] = 1;
                    }
                }
            }

            postsWords[docIndex] = docContent;

            let newJson = JSON.stringify(postsWords)

            fs.writeFile('./private/postsWords.json', newJson, err => {
                if (err) {
                    console.log('Error writing file: ', err)
                }
            })

        })

    },


    /**
     * Update the postsWords.json file when a post is deleted
     *
     * @param post_id
     * @returns {Promise<void>}
     */
    deletePostWords: async (post_id) => {

        await fs.readFile('./private/postsWords.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed: ", err);
                return;
            }

            let postsWords = JSON.parse(jsonString);

            delete postsWords[post_id];

            let newJson = JSON.stringify(postsWords)

            fs.writeFile('./private/postsWords.json', newJson, err => {
                if (err) {
                    console.log('Error writing file: ', err)
                }
            })

        })

    },


    /**
     * Used to sort the searched posts according to the pertinence of each post
     *
     * @param posts
     * @param req
     * @param f
     * @returns {Promise<void>} execute the f function with the sorted posts
     */
    orderResults: async (posts,req,f) => {
        let sortedResults = [];
        await fs.readFile('./private/postsWords.json', 'utf8', (err, jsonString) => {
            let order = [];

            if (err) {
                console.log("File read failed: ", err)
                return;
            }
            let postsWords = JSON.parse(jsonString);

            let search = req.query.search.toLowerCase().split(" ");
            let tf_idf = {};
            for (let i = 0; i < posts.length; i++) {
                for (let j = 0; j < search.length; j++) {
                    let currSearchedWord = module.exports.lemmatisation(search[j].toLowerCase())
                    let tf = 0;
                    let idf = 0;
                    if (currSearchedWord in postsWords[posts[i]["_id"]]) {
                        tf = module.exports.tfFunct(currSearchedWord, postsWords[posts[i]["_id"]]);
                        idf = module.exports.idfFunct(posts.length, Object.keys(postsWords).length);
                        if (posts[i]["_id"] in tf_idf) {
                            tf_idf[posts[i]["_id"]] += tf * idf;
                        } else {
                            tf_idf[posts[i]["_id"]] = tf * idf;
                        }
                    }
                }
            }

            for (let doc in tf_idf) {
                order.push([doc, tf_idf[doc]])
            }
            order.sort(function (a, b) {
                return b[1] - a[1];
            })

            if (order.length === 0){
                sortedResults = posts;
            }
            else{
                for (let i = 0; i < order.length; i++) {
                    for (let j = 0; j < posts.length; j++) {
                        if (posts[j]["_id"].toString() === order[i][0]) {
                            sortedResults[i] = posts[j];
                        }
                    }
                }
            }
            f(sortedResults)
        });
    },


    /**
     * Used to apply the lemmatisation function to all word of a string
     *
     * @param m
     * @returns {string}
     */
    lemmatizeWordsOfString: (m) => {
        let splittedString = m.toLowerCase().split(" ");
        let finalString = "";
        for (let i=0; i<splittedString.length; i++){
            finalString += module.exports.lemmatisation(splittedString[i]) + " ";
        }
        return finalString.trimRight();
    },


    /**
     * Returns the right posts according to the current page when a search is made
     *
     * @param results
     * @param page
     * @returns {Array}
     */
    correctPosts: (results,page) => {
        let postLimit = 5;
        let posts = [];
        let index = 0;
        if (page > 1){
            index = ((page-1)*5);
        }
        let limit = postLimit*page;
        if (limit >= results.length){
            limit = results.length;
        }

        for (let i=index; i<limit; i++){
            posts.push(results[i]);
        }

        return posts;
    },


    /**
     * Returns an array with the count of likes, comment of the user and the number of post the user made
     *
     * @param id
     * @returns {Promise<(number|*)[]>}
     */
    countUserLikes_CommentsAndPosts: async (id) => {
        let userPosts = await Post.find({"author_id":id});
        let userComments = await Comment.find({"author_id":id});

        let likes = 0;
        let comments = 0;
        for (i in userPosts){
            likes += userPosts[i]["likes"];
            comments += userPosts[i]["comments"];
        }
        for (i in userComments){
            likes += userComments[i]["likes"];
        }
        return [likes,comments,userPosts.length]
    }
};