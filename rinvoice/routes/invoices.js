
// ==== ======= [ invoices after login ] ======= ====

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
