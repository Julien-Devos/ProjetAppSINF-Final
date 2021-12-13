const Game = require("../models/Game");
const User = require("../models/User");

module.exports = {

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

    createSearchFilter: async (req,f) => {
        let filter = {};

        if (! (req.query.filter === undefined) ){
            const gameFilter = req.query.filter;
            if (typeof gameFilter === "string"){
                const game = await Game.findOne({"name":gameFilter});
                filter = {"game_id":game["_id"]};
            }
            else{
                let orList = [];

                for ( let i in gameFilter){
                    const game = await Game.findOne({"name":gameFilter[i]});
                    orList.push({"game_id":game["_id"]});
                }
                filter = {$or: orList};
            }
        }
        f(filter);
    },

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

    pagination: (req,page,posts,nbrPosts) => {

        const pageNbr = Math.ceil(nbrPosts/5);

        let filterParams = "";
        if (! (req.query.filter === undefined) ){
            filterParams = "&filter="+req.query.filter;
        }
        let link = "/posts?search="+req.query.search+filterParams+"&page=";

        let pageNav = [{"disabled":"","link":link+(page-1)},[],{"disabled":"","link":link+(page+1)}];

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

        return pageNav;
    },

    searchResults: (req, nbrPosts) => {
        if (req.query.filter === undefined && req.query.search === ""){
            return "Il y a au total " + nbrPosts + " posts sur le site." // message displayed when no filter and no search
        }
        else {
            let filters = req.query.filter;
            if ( ! (typeof filters === "string") ){
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
    }
};