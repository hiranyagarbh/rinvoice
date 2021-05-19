var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');

// ====== [ dev ] ======
var logger = require('morgan');
var chalk = require('chalk');
const morganMiddleware = logger(function(tokens, req, res) {
    return [
        // chalk.hex('#ff4757').bold('🍄  Morgan --> '),
        chalk.hex('#f78fb3')(tokens.method(req, res)),
        chalk.cyan(tokens.status(req, res)),
        chalk.hex('#A4A7AA')(tokens.url(req, res)),
        chalk.hex('#fffa65')(tokens['response-time'](req, res) + ' ms')
    ].join(' ');
});

var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require("body-parser");

// multer - https://www.npmjs.com/package/multer
var multer = require('multer');
// var upload_invoice = multer({dest: 'uploads/'});


// -- [BUG] duplicate name replacing files automatically
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        // cb(null, file.originalname + '-' + Date().toString() + path.extname(file.originalname)) // appending extension
        cb(null, file.originalname) // appending extension
    }
});

var upload_invoice = multer({ storage: storage });

var app = express();

// ====== [ routes ] ======
// var routes = require('./routes');
var user = require('./routes/user');
var invoices = require('./routes/invoices');
var profile = require('./routes/profile');
var auth = require('./routes/auth');
var upload_file = require('./routes/upload_file')

// ====== [ db conn ] ======
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'john',
    password: 'john123',
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


// ====== [ session ] ======
app.use(session({
    secret: 'keyboard cat', // in production - store in env variable
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true, == for production
        secure: false,
        sameSite: 'strict',
    }
}));


// ====== [ view engine setup ] ======
app.set('views', path.join(__dirname, 'views'));
// EJS - { https://ejs.co/#docs }
app.set('view engine', 'ejs');
// morgan - { https://www.npmjs.com/package/morgan }
app.use(morganMiddleware);
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

// call for register page
app.get('/register', auth.register);
app.post('/register', auth.register);

// call for login page
app.get('/login', auth.login);
app.post('/login', auth.login);

// call for home page after login
app.get('/home/dashboard', user.dashboard);
// call for logout
app.get('/home/logout', user.logout);

// ===== [ invoice page ] =====
// call for invoices page + add invoice
app.get('/home/invoices', invoices.invoices);
app.post('/home/invoices/add', upload_invoice.single("in_file"), invoices.addInvoice);
// invoice action btns
// app.post('/home/invoices/view-inv', invoices.invActionView);
app.post('/home/invoices/approve', invoices.invActionApprove);
app.post('/home/invoices/reject', invoices.invActionReject);
app.post('/home/invoices/delete', invoices.invActionDelete);

// call for profile
app.get('/home/profile', profile.profile);
app.post('/home/profile', profile.profile);

// call for upload_file
app.get('/home/upload_file', upload_file.upload_file);

// call for save_file_to_db
app.post('/home/upload_file/save_invoice_to_db', (req, res) => {

    var userId = req.session.userId;
    var m_email = req.session.user.email;

    var unminedInvoiceId = userId + "_" + req.body.dateadded

    var invoice_data = {
        m_uid: userId,
        m_email: m_email,
        service: req.body.nameOfService,
        amount: req.body.invoiceAmount,
        buyeremail: req.body.buyerEmail,
        unminedInvoiceId: unminedInvoiceId,
        urgent: req.body.checkurgent,
        ifMined: false,
        dateadded: req.body.dateadded,
        encryptedMessage: req.body.encryptedMessage
    }

    if (invoice_data.urgent === "on") {
        invoice_data.urgent = 'y'
    }

    var sql = "INSERT INTO invoices (m_uid, m_email, service, amount, buyeremail, invoiceId, filepath, urgent, status) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sql, [
        invoice_data.m_uid,
        invoice_data.m_email,
        invoice_data.service,
        invoice_data.amount,
        invoice_data.buyeremail,
        invoice_data.unminedInvoiceId,
        "kahi nahi",
        invoice_data.urgent,
        "n"
    ], function(err, results) {
        if (err) {
            console.log(err.message);
        } else {
            var sql = 'INSERT INTO miningQueue(invoiceId, encryptedData) VALUES (?,?);'
            db.query(sql, [
                invoice_data.unminedInvoiceId,
                invoice_data.encryptedMessage
            ], (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('added to mining queue')
                }
            })
        }
        res.redirect('/home/invoices');
    });
})

app.get('/viewInvoice/:invoiceId', (req, res) => {

    var invoiceId = req.params.invoiceId

    sql = 'SELECT encryptedData FROM miningQueue WHERE invoiceId=?'
    db.query(sql, [invoiceId], (err, results) => {
        if (err) {
            console.log(err)
        }
        // res.send(results[0].encryptedData)
        res.render('pages/view_invoice.ejs', { invoice: results[0] })
    })
})

app.get('/mineBlocks', (req, res) => {
    // add the code for mining here
    var sql = `
    SELECT * FROM (
        SELECT *
        FROM miningQueue
        WHERE status = 'a' 
        AND confirmations < 1
        LIMIT 1
    ) invoice,
    (
        SELECT IPFSHash as previousHash
        FROM blockchain
        ORDER BY sno DESC
        LIMIT 1
    ) blk;`
    db.query(sql, (err, result) => {
        if (err)
            console.log(err)
        res.json(result)
    })
})

app.post('/mineBlocks', (req, res) => {
    console.log(req.body);

    db.beginTransaction((err) => {
        if (err) throw err;
        db.query('INSERT INTO blockchain(IPFSHash) VALUES(?)', [req.body.IPFSHash],
            (err) => {
                if (err) {
                    db.rollback(()=>{
                        throw err
                    })
                    console.log(err.message)
                } else {
                    db.query("DELETE FROM miningQueue WHERE invoiceId = ?", [req.body.invoiceId],
                        (err) => {
                            if (err){
                                db.rollback(()=>{
                                    throw err
                                })
                                console.log("failed to delete from miningQueue. Error: " + err.message)
                            }else {
                                console.log('added node to blockchain and removed from mining queue successfully')
                                db.query('UPDATE invoices SET invoiceId = ? WHERE invoiceId = ?', [req.body.IPFSHash, req.body.invoiceId],
                                    (err) => {
                                        if (err) {
                                            db.rollback(()=>{
                                                throw err
                                            })
                                            console.log("could not update IPFS hash in invoices table")
                                        }
                                        db.commit((err)=>{
                                            if(err){
                                                console.log(err);
                                                db.rollback(()=>{
                                                    throw err
                                                })
                                            } else {
                                                console.log("Block has been commited to the blockchain");
                                            }
                                        })
                                    })
                            }
                        })

                }
            })
    })

    res.end();
})

// ====== [ error handling ] ======
// add 404 & 500 page?

app.use(function(req, res, next) {
    res.status(404).send('404: Page Not Found!');
});


// middleware
var listener = app.listen(3000, function() {
    console.log('\x1b[36m%s\x1b[0m', 'View at http://localhost:' + listener.address().port + "/login");
});

module.exports = app;