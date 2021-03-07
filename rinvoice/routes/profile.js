// ==== ======= [ profile after login ] ======= ====
exports.profile = function (req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    // console.log('User ID = ' + userId);
    if (userId == null) {
        res.redirect("/login");
        // return;
    }
    var sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], function (err, results) {
        res.render('pages/home/profile.ejs', { data: results });
        console.log(results);
        // console.log('Account Type = ' + results[0].acctype);
    });
};