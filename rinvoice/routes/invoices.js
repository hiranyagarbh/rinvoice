// ==== ======= [ invoices view route ] ======= ====
exports.invoices = function (req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    // console.log('User ID = ' + userId); 
    if (userId == null) {
        res.redirect("/login");
        // return;
    }

    var get_acctype = 'SELECT acctype FROM users WHERE id = ?'; // get account type from userId
    db.query(get_acctype, [userId], function (err, results) {
        // console.log(results);

        // check if account type is merchant or buyer
        if (results[0].acctype == 'm') {

            var get_data = 'SELECT * FROM users JOIN invoices ON users.id = invoices.m_uid WHERE id = ? ORDER BY dateadded desc;';
            db.query(get_data, [userId], function (err, results) {
                // add error handler here
                console.log(results);
                res.render('pages/home/invoices.ejs', { data: results });
            });

        } else if (results[0].acctype == 'b') {

            var get_data = 'SELECT * FROM users JOIN invoices ON users.email = invoices.buyeremail WHERE id = ? ORDER BY dateadded desc;';
            db.query(get_data, [userId], function (err, results) {
                // add error handler here
                console.log(results);
                res.render('pages/home/invoices.ejs', { data: results });
            });

        }

    });



    // var sql = "SELECT acctype FROM users WHERE id = ?";
    // db.query(sql, [userId], function (err, results) {
    //     // res.render('pages/home/invoices.ejs', { data: results });
    //     console.log(results);
    //     if (results[0].acctype == 'm') {
    //         var get_invoices = 'SELECT * from users WHERE id = ?;SELECT * from invoices WHERE m_uid = ?';
    //         db.query(get_invoices, [userId, userId], function(err, results){
    //             console.log(results[0], results[1]);
    //             // res.render('pages/home/invoices.ejs', {data: results[0], invoicedata: results[1]});
    //         });
    //     } else if (results.acctype == 'b') {
    //         console.log('this is buyer account type');
    //     }
    // });

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

    var sql = "INSERT INTO invoices (m_uid, service, amount, buyeremail, filepath, urgent, status) VALUES (?,?,?,?,?,?,?)";
    db.query(sql, [userId, service, amount, buyer_email, in_filePath, checkurgent, invstatus], function (err, results) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Successfully uploaded!');
            res.redirect('/home/invoices');
        }
    });
};