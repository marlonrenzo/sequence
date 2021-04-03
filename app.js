const http = require('http');
const mysql = require("mysql");
const express = require('express');
const cors = require("cors");
const app = express();


// create database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "marlonfa_admin",
    password: "marlonfa_admin",
    database: "marlonfa_sequence"
});


app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.urlencoded( {extended: true} ));
app.options('*', cors());
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views/pages');

// --- Routing ---

app.get('/scores', function(req, res) {
    res.end("Get leaderboard of top 10 scores");
});

app.get('/scores/:username', function(req, res){
    res.end("Get the scores for a user");
});

app.get('/users', function(req, res) {
    res.end("Get the list of users");
});

app.put('/scores', function(req, res) {
    res.end("Upload a new entry into the scores table");
});

app.put('/users/:username', function(req, res) {
    res.end("Adds a new entry into the user table");
});

app.post('/users/:username', function(req, res) {
    res.end("Check existence in database, then login");
});

app.post('/users/change/:username/:newname', function(req, res) {
    res.end("Change the name of a stored user.");
})

app.post('/users/:username/:pw', function(req, res) {
    res.end("Authenticates credentials, and displays stats for all endpoints")
});

app.delete('/users/:username', function(req, res) {
    res.end("Delete a user and all its scores from the tables");
});

app.delete('/scores/:scoreID', function(req, res) {
    res.end("Delete a score from the database")
});

app.listen();
