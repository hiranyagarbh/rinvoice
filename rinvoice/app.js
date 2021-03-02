var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// EJS - { https://ejs.co/#docs }
app.set('view engine', 'ejs');
// morgan - { https://www.npmjs.com/package/morgan }
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// static
app.use(express.static(path.join(__dirname, 'public')));


// ====== [ routes ] ======
// to add:
// s1: add route below
// s2: add render funct in /routes (diff file for each)
// s3: add to static files in /views/pages

app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/home', require('./routes/home'));
app.use('/invoices', require('./routes/invoices'));
app.use('/profile', require('./routes/profile'));


// ====== [ error handling ] ======
// add 404 & 500 page?

app.use(function(req, res, next) {
    res.status(404).send('Not Found!');
});

module.exports = app;
