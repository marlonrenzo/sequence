const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "diyarsal_admin",
    password: "diyarsal_admin",
    database: "diyarsal_Sequence"
});

module.exports = connection;