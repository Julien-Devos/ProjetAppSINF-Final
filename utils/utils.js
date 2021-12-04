const Post = require("../models/Post");
const User = require("../models/User");
const Game = require("../models/Game");


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

            if (diffSec < 60){
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
    }

};