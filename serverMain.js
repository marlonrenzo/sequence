const ENDPOINT = "/sequence_server/v2";

const app = require('./modules/appSetup');
app.set('views', __dirname + '/views/pages');
const db = require('./modules/db');

// --- Routing ---


// Render documentation page
app.get(ENDPOINT + "/docs", function (req, res) {
    res.render("documentation.html");
});

// Get leaderboard of top 10 scores
app.get(ENDPOINT + '/scores', function(req, res) {
    let sql = "SELECT * FROM get_scores";
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/scores';
    let method = "GET";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Get the high scores for a user for all game modes
app.get(ENDPOINT + '/scores/:username/', function(req, res) {
    let name = req.params.username;
    let mode = req.params.gameMode;
    let sql = `CALL get_user_score_placing('${name}')`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/scores/username';
    let method = "GET";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Get the high scores for a user for a game mode
app.get(ENDPOINT + '/scores/:username/', function(req, res) {
    let name = req.params.username;
    let mode = req.params.gameMode;
    let sql = `CALL get_user_score_placing('${name}')`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/scores/username';
    let method = "GET";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Get the list of users
app.get(ENDPOINT + '/users', function(req, res) {
    let sql = "SELECT username FROM users;";
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users';
    let method = "GET";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking " + request);
        }
    });
});

// Upload a new entry into the scores table
app.put(ENDPOINT + '/scores/:username/:score/:mode', function(req, res) {
    let name = req.params.username;
    let value = req.params.score;
    let mode = req.params.mode;
    let sql = `CALL add_score_with_gamemode('${name}', ${value}, '${mode}');`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/scores/username/score';
    let method = "PUT";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Adds a new entry into the user table
app.put(ENDPOINT + '/users/:username', function(req, res) {
    let name = req.params.username;
    let sql = `CALL add_user('${name}');`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users/username';
    let method = "PUT";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Check existence in database, then login
app.post(ENDPOINT + '/users/:username', function(req, res) {
    let name = req.params.username;
    let sql = `SELECT user_exists('${name}') AS user_exists;`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users/username';
    let method = "POST";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Change the name of a stored user.
app.post(ENDPOINT + '/users/change/:username/:newname', function(req, res) {
    let name = req.params.username;
    let newName = req.params.newname;
    let sql = `CALL change_name('${name}', '${newName}');`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users/change/username/newname';
    let method = "POST";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Authenticates credentials, and displays stats for all endpoints
app.post(ENDPOINT + '/users/authenticate/:username/:pw', function(req, res) {
    let name = req.params.username;
    let password = req.params.pw;
    let sql = `SELECT authenticate('${name}', '${password}');`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users/authenticate/username/pw';
    let method = "POST";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Delete a user and all its scores from the tables
app.delete(ENDPOINT + '/users/:username', function(req, res) {
    let name = req.params.username;
    let sql = `CALL delete_user('${name}');`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/users/username';
    let method = "DELETE";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// Delete a score from the database
app.delete(ENDPOINT + '/scores/:scoreID', function(req, res) {
    let scoreID = req.params.scoreID;
    let sql = `CALL delete_score(${scoreID});`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });

    let request = ENDPOINT + '/scores/scoreID';
    let method = "DELETE";
    let sql2 = `CALL track_request('${request}', '${method}');`; 
    db.query(sql2, function (err, result) {
        if (err) throw err;
        if (result[0]["ROW_COUNT()"]) {
            console.log("Successful");
        } else {
            console.log("Error tracking" + request);
        }
    });
});

// See the stats
app.get(ENDPOINT + '/stats', function(req, res) {
    let sql = "SELECT * FROM stats";
    db.query(sql, function (err, result) {
        if (err) throw err;
        let resultText = JSON.stringify(result);
        res.end(resultText);
    });
});

app.listen();
