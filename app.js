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

// Get leaderboard of top 10 scores
app.get('/scores', function(req, res) {
    db.connect(function (err) {
        if (err) throw err;
        let sql = "SELECT * FROM get_scores"
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Get the scores for a user
app.get('/scores/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL get_user_scores(${name})`
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Get the list of users
app.get('/users', function(req, res) {
    db.connect(function (err) {
        if (err) throw err;
        let sql = "SELECT username FROM users;"
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Upload a new entry into the scores table
app.put('/scores/:username/:score', function(req, res) {
    let name = req.params.username;
    let value = req.params.score;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL add_score(${name}, ${value});`
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Adds a new entry into the user table
app.put('/users/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL add_user(${name});`
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Check existence in database, then login
app.post('/users/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `SELECT user_exists(${name});`
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Change the name of a stored user.
app.post('/users/change/:username/:newname', function(req, res) {
    let name = req.params.username;
    let newname = req.params.newname;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL change_name(${name}, ${newName});`
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
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
