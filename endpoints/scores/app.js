const SCORE_ENDPOINT = "/sequence/scores";
const app = require('../modules/appSetup');
const db = require('../modules/db');

// --- Routing ---

// Get leaderboard of top 10 scores
app.get(SCORE_ENDPOINT, function(req, res) {
    db.connect(function (err) {
        if (err) throw err;
        let sql = "SELECT * FROM get_scores";
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Get the scores for a user
app.get(SCORE_ENDPOINT + '/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL get_user_scores('${name}')`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Upload a new entry into the scores table
app.put(SCORE_ENDPOINT + '/:username/:score', function(req, res) {
    let name = req.params.username;
    let value = req.params.score;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL add_score('${name}', ${value});`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Delete a score from the database
app.delete(SCORE_ENDPOINT + '/:scoreID', function(req, res) {
    let scoreID = req.params.scoreID;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL delete_score(${scoreID});`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

app.listen();
