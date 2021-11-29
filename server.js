let express = require('express');
let consolidate = require('consolidate');
let MongoClient = require('mongodb').MongoClient;
let favicon = require('serve-favicon');
let session = require('express-session');
let bodyParser = require("body-parser");
let https = require('https');
let fs = require('fs');
const {response} = require("express");


let app = express ();
const port = 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "randompass",
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpsOnly: true,
        maxAge: 3600000
    }
}));


app.engine ( 'html', consolidate.hogan );
app.set('views', __dirname + '/private');
app.use(express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/static/img/logos/favicon.ico'));


// Connect to the db and wait for requests
MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
    if (err) throw err;

    let dataBase = db.db("finalAppSinf");


    // GET request for "/"
    app.get('/', function(req, res) {
        // let results = [];
        // let games = [];
        //
        // dataBase.collection('posts').find().toArray(function(err, db_res){
        //     if (err) throw err;
        //
        //     for (let i=0; i<db_res.length; i++){
        //         results[i] = db_res[i]
        //     }
        //
        // });
        // dataBase.collection('games').find().toArray(function(err, db_res){
        //     if (err) throw err;
        //
        //     games = db_res;
        // });
        //
        // console.log(results);
        // console.log(games);
        //
        // for (let result in results) {
        //     console.log("1")
        //     let author_id = result["author_id"];
        //     result["author_id"] = games[author_id];
        // }

        let data = {
            "logged" : false,
            // "posts" : results
        }
        res.render("home.html",data)
    });


    app.get('/add-post', function(req, res) {

        let data = {
            "logged" : true
        }
        res.render("newpost.html", data)

    });

    app.get('/post', function(req, res) {

        let data = {
            "logged" : true
        }
        res.render("post.html", data)

    });

    app.get('/posts', function(req, res) {

        let data = {
            "logged" : true
        }
        console.log(req.body.search)
        res.render("all_posts.html", data)

    });

    app.get('/user-profile', function(req, res) {

        let data = {
            "logged" : true
        }
        res.render("profile.html", data)

    });

    app.get('/log', function(req, res) {

        res.render("login.html")

    });

    app.get('/logout', function(req, res) {

        res.render("home.html")

    });

    app.post('/add-comment', function(req, res) {

        console.log(req.body.comm)
        res.redirect("post")

    });


    // GET request for "*" send message for page not found
    app.get('*', function(req, res) {
        res.status(404).render('404.html');
    });


    // Lance le server avec le protocole https sur le port, url: https://localhost:'port'
    https.createServer({
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
        passphrase: 'INGI'
    }, app).listen(port);
    console.log('Server successfully started on port ' + port + ' access with ' + 'https://localhost:' + port);

});