var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');
var path = require('path');
var http = require('http');

var routes = require('./routes');
var user = require('./routes/user');

var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require("body-parser");

var app = express();

// ===== [ db conn ] =====
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'rinvoice'
});

conn.connect((err) => {
  if (err) {
    console.error('Error establishing a database connection. ' + err.sqlMessage + '\nError Code: ' + err.code);
    return;
  }
  console.log('Database connection successfully established!');
});

global.db = conn; //single global DB connection 


// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));


// ========== ========== ========== ========== ========== ========== ========== view engine setup
app.set('views', path.join(__dirname, 'views'));
// EJS - { https://ejs.co/#docs }
app.set('view engine', 'ejs');
// morgan - { https://www.npmjs.com/package/morgan }
app.use(logger(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length')].join(' ')}));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// static
app.use(express.static(path.join(__dirname, 'public')));


// ====== [ routes ] ======
// to add:
// s1: add route below
// s2: add render funct in /routes
// s3: add to static files in /views/pages


// homepage
app.get('/', routes.index);

// call for register page
app.get('/register', user.register);
app.post('/register', user.register);

// call for login page
app.get('/login', user.login);
app.post('/login', user.login);

// call for home page after login
app.get('/home/dashboard', user.dashboard);
// call for invoices page after login
app.get('/home/invoices', user.invoices);
// call for logout
app.get('/home/logout', user.logout);



// app.use('/home', require('./routes/home'));
// app.use('/invoices', require('./routes/invoices'));
// app.use('/profile', require('./routes/profile'));


// ====== [ error handling ] ======
// add 404 & 500 page?

app.use(function (req, res, next) {
  res.status(404).send('Not Found!');
});


// middleware
var listener = app.listen(8080, function () {
  console.log('\x1b[36m%s\x1b[0m', 'Listening on port ' + listener.address().port);
});

module.exports = app;
