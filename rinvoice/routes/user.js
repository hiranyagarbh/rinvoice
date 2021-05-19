// ==== ======= [ dashboard after login ] ======= ====
exports.dashboard = function (req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    var email = req.session.email;
    // console.log('User ID = ' + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM users WHERE id = ? AND email = ?";
    db.query(sql, [userId, email], function (err, results) {
        res.render('pages/home/invoices', { data: results });
    });
};

// ==== ======= [ logout ] ======= ====
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    })
};