// ==== ======= [ profile after login ] ======= ====
exports.profile = function (req, res, next) {
    var user = req.session.user; // unused variable?
    var userId = req.session.userId;
    var message = '';
    var p_flag = '';
    // console.log('User ID = ' + userId);
    if (userId == null) { res.redirect("/login"); }

    // update user data on POST req
    if (req.method == "POST") {
        var post = req.body;
        var name = post.name;
        var address = post.address;

        var sql = "UPDATE users SET name = ?, address = ? WHERE id = ?";
        db.query(sql, [name, address, userId], function (err) {
            if (err) {
                message = 'Error occured! Please try again.';
                res.redirect('/home/profile', { p_message: message, p_flag : 'error' });
            }
            else {
                message = 'Profile saved successfully!';
                var sql = "SELECT * FROM users WHERE id = ?";
                db.query(sql, [userId], function (err, results) {
                    res.render('pages/home/profile.ejs', { data: results, p_message: message, p_flag : p_flag });
                    console.log(results); //remove in production
                });
            }
        });
    } else {
        // fetch user data
        var sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [userId], function (err, results) {
            res.render('pages/home/profile.ejs', { data: results, p_message: message, p_flag : p_flag });
            console.log(results); //remove in production
        });
    }

};