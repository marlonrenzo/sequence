const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "marlonfa_admin",
    password: "marlonfa_admin",
    database: "marlonfa_sequence"
});

module.exports = connection;