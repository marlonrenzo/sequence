const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const app = express();

// Middle Ware
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://marlonfajardo.ca');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
app.use(express.urlencoded( {extended: true} ));
// app.use(favicon(path.join(__dirname,'public','images','favicon_io', 'favicon.ico')));
app.use(express.static(__dirname + '/public'));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));
// app.use('/script', express.static(path.join(__dirname, 'public/script')));
app.set('views', __dirname + '/views/pages');
app.engine('html', require('ejs').renderFile);


// Routing

app.get("/login", function(req, res) {
    res.render("index.html")
});

app.get("/", function(req, res) {
    res.render("gamePage.html");
});

app.get("/leaderboard", function(req, res) {
    res.render("leaderboard.html");
})

app.get("/admin", function(req, res) {
    res.render("admin.html");
})

app.get("/css/:filename", function (req, res) {
    let css = req.params.filename;
    res.sendFile(__dirname + `/public/css/${css}`);
});

app.get("/script/:filename", function (req, res) {
    let script = req.params.filename;
    res.sendFile(__dirname + `/public/script/${script}`);
});

app.get("/favicon/:filename", function (req, res) {
    let favicon = req.params.filename;
    res.sendFile(__dirname + `/public/images/favicon_io/${favicon}`);
});

app.post("/game/:username", function(req, res) {
    let name = req.params.username;
    res.render("index.html", {name: name});
});
 
app.listen(3001);