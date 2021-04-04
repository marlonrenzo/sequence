const express = require('express');
const app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://marlonfajardo.ca');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
app.use(express.urlencoded( {extended: true} ));
app.engine('html', require('ejs').renderFile);

module.exports = app;