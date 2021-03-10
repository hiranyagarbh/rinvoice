// ==== ======= [ invoices view route ] ======= ====
exports.invoices = function (req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    // console.log('User ID = ' + userId); 
    if (userId == null) {
        res.redirect("/login");
        // return;
    }
    var sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], function (err, results) {
        res.render('pages/home/invoices.ejs', { data: results });
    });
};

// ==== ======= [ add invoice route ] ======= ==== 
exports.addInvoice = function (req, res) {
    var message = '';
    var userId = req.session.userId;
    var addinv = req.body;
    var service = addinv.service;
    var amount = addinv.amount;
    var buyer_email = addinv.buyer_email;
    // get uploaded file path
    var in_filePath = req.file.path;
    // urgent checkbox
    var checkurgent = 'n';
    if (addinv.checkurgent == 'on') { checkurgent = 'y'; }
    // invoice status (initial char) - [ nill (default value), approved, rejected ]
    var invstatus = 'n';

    var sql = "INSERT INTO invoices VALUES (?,?,?,?,?,?)";
    db.query(sql, [service, amount, buyer_email, in_filePath, checkurgent, invstatus], function(err, results){
        if (err) {
            console.log(err.message);
        } else {
            console.log('Successfully uploaded!');
            res.redirect('/home/invoices');
        }
    });
};