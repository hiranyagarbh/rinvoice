// ==== ======= [ invoices view route ] ======= ====
exports.invoices = function(req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    // console.log('User ID = ' + userId); 
    if (userId == null) {
        res.redirect("/login");
        // return;
    } else {
        var get_acctype = 'SELECT acctype FROM users WHERE id = ?'; // get account type from userId
        db.query(get_acctype, [userId], function(err, results) {

            var res_acctype = JSON.parse(JSON.stringify(results))[0].acctype;

            // check if account type is merchant or buyer
            // left join handles the case - if the returned results arr is empty
            if (res_acctype == 'm') {
                var get_data = 'SELECT name, acctype, service, amount, buyeremail, invoiceId, filepath, urgent, status FROM users LEFT JOIN invoices ON users.id = invoices.m_uid WHERE id = ? ORDER BY dateadded desc;';
                db.query(get_data, [userId], function(err, results) {
                    // add error handler here
                    console.log(results);
                    res.render('pages/home/invoices.ejs', { data: results });
                });

            } else if (results[0].acctype == 'b') {
                var get_data = 'SELECT name, acctype, m_uid, m_email, service, amount, invoiceId, filepath, urgent, status FROM users LEFT JOIN invoices ON users.email = invoices.buyeremail WHERE id = ? ORDER BY dateadded desc;';
                db.query(get_data, [userId], function(err, results) {
                    // add error handler here
                    // console.log(results);
                    res.render('pages/home/invoices.ejs', { data: results });
                });

            } // elseif

        }); // db.query
    }


};

// ==== ======= [ add invoice route ] ======= ==== 
exports.addInvoice = function(req, res) {
    var message = '';
    var userId = req.session.userId;
    var m_email = req.session.email;
    var addinv = req.body;

    var service = addinv.service;
    var amount = addinv.amount;
    var buyer_email = addinv.buyer_email;
    var invoiceId = Math.floor(Math.random() * 1000000);
    // get uploaded file path
    var in_filePath = req.file.path;

    // urgent checkbox
    var checkurgent = 'n';
    if (addinv.checkurgent == 'on') { checkurgent = 'y'; }

    // invoice status (initial char) - [ nill (default value), approved, rejected ]
    var invstatus = 'n';

    var sql = "INSERT INTO invoices (m_uid, m_email, service, amount, buyeremail, invoiceId, filepath, urgent, status) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(sql, [userId, m_email, service, amount, buyer_email, invoiceId, in_filePath, checkurgent, invstatus], function(err, results) {
        if (err) { console.log(err.message); }
        res.redirect('/home/invoices');
    });
};

// ==== ======= [ invoice action bts ] ======= ==== 

// view funct
exports.invActionView = function(req, res) {
    // console.log('view invoice');
};

// approve funct
exports.invActionApprove = function(req, res) {
    var invoiceId = req.body.apprinv;
    var approve_query = "UPDATE invoices SET status = 'a' WHERE invoiceId = ?;" ;
    db.query(approve_query, [invoiceId], (err) => {
        if (err) { 
            console.log(err.message); 
        } else {
            approveInMiningQueue(invoiceId)
        }
    });
    res.redirect('/home/invoices');
};

function approveInMiningQueue(invoiceId){
    db.query("UPDATE miningQueue SET status = 'a' WHERE invoiceId = ?",
    [invoiceId], (err)=>{
        if(err){
            console.log(err.message)
        }
    })
}

// reject funct
exports.invActionReject = function(req, res) {
    var invoiceId = req.body.rejeinv;
    var reject_query = "UPDATE invoices SET status = 'r' WHERE invoiceId = ?";
    db.query(reject_query, [invoiceId], function(err) { if (err) { console.log(err.message); } });
    res.redirect('/home/invoices');
};

// delete funct
// this funct does not delete the file yet -- add file deletion
exports.invActionDelete = function(req, res) {
    var invoiceId = req.body.deleinv;
    var delete_query = "DELETE FROM invoices WHERE invoiceId = ?";
    db.query(delete_query, [invoiceId], function(err) { if (err) { console.log(err.message); } });
    res.redirect('/home/invoices');
};