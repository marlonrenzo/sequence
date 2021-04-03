const USER_ENDPOINT = "/sequence/users";
const app = require('../modules/appSetup');
const db = require('../modules/db');

// --- Routing ---

// Get the list of users
app.get(USER_ENDPOINT, function(req, res) {
    db.connect(function (err) {
        if (err) throw err;
        let sql = "SELECT username FROM users;";
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Adds a new entry into the user table
app.put(USER_ENDPOINT + '/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL add_user('${name}');`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Check existence in database, then login
app.post(USER_ENDPOINT + '/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `SELECT user_exists('${name}');`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Change the name of a stored user.
app.post(USER_ENDPOINT + '/change/:username/:newname', function(req, res) {
    let name = req.params.username;
    let newname = req.params.newname;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL change_name('${name}', '${newName}');`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
})

// Authenticates credentials, and displays stats for all endpoints
app.post(USER_ENDPOINT + '/authenticate/:username/:pw', function(req, res) {
    let name = req.params.username;
    let password = req.params.pw;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `SELECT authenticate('${name}', '${password}');`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

// Delete a user and all its scores from the tables
app.delete(USER_ENDPOINT + '/:username', function(req, res) {
    let name = req.params.username;
    db.connect(function (err) {
        if (err) throw err;
        let sql = `CALL delete_user('${name}');`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            let resultText = JSON.stringify(result);
            res.end(resultText);
        });
    });
});

app.listen();
