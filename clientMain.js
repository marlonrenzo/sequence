const express = require('express');
const path = require('path');
const app = express();

// Middle Ware
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://marlonfajardo.ca');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
app.use(express.urlencoded( {extended: true} ));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/script', express.static(path.join(__dirname, 'public/script')));
app.set('views', __dirname + '/views/pages');
app.engine('html', require('ejs').renderFile);


// Routing

app.get("/sequence", function(req, res) {
    res.render("index.html");
});

app.get("/sequence/game", function(req, res) {
    res.render("gamePage.html");
});

app.get("/sequence/leaderboard", function(req, res) {
    res.render("leaderboard.html");
})

app.get("/sequence/admin", function(req, res) {
    res.render("admin.html");
})

app.post("/sequence/game/:username", function(req, res) {
    let name = req.params.username;
    res.render("index.html", {name: name});
});
 
app.listen(3001);