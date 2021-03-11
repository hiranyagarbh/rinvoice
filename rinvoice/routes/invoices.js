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

        var res_acctype = JSON.parse(JSON.stringify(results))[0].acctype;
        
        // check if account type is merchant or buyer
        // left join handles the case - if the returned results arr is empty
        if (res_acctype == 'm') {
            var get_data = 'SELECT name, acctype, service, amount, buyeremail, filepath, urgent, status FROM users LEFT JOIN invoices ON users.id = invoices.m_uid WHERE id = ? ORDER BY dateadded desc;';
            db.query(get_data, [userId], function (err, results) {
                // add error handler here
                // console.log(results);
                res.render('pages/home/invoices.ejs', { data: results });
            });

        } else if (results[0].acctype == 'b') {
            var get_data = 'SELECT name, acctype, m_uid, m_email, service, amount, filepath, urgent, status FROM users LEFT JOIN invoices ON users.email = invoices.buyeremail WHERE id = ? ORDER BY dateadded desc;';
            db.query(get_data, [userId], function (err, results) {
                // add error handler here
                // console.log(results);
                res.render('pages/home/invoices.ejs', { data: results });
            });

        } // elseif

    }); // db.query

};

// ==== ======= [ add invoice route ] ======= ==== 
exports.addInvoice = function (req, res) {
    var message = '';
    var userId = req.session.userId;
    var m_email = req.session.email;
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

    var sql = "INSERT INTO invoices (m_uid, m_email, service, amount, buyeremail, filepath, urgent, status) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sql, [userId, m_email, service, amount, buyer_email, in_filePath, checkurgent, invstatus], function (err, results) {
        if (err) {
            // add GUI err handler
            console.log(err.message);
        } else {
            console.log('Successfully uploaded!'); // remove in production
            res.redirect('/home/invoices');
        }
    });
};