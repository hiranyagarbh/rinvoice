// ==== ======= [ register page call ] ======= ====
exports.register = function (req, res) {
    if (req.method == "POST") {
        var post = req.body;
        var id = Math.floor(Math.random() * 1000000);
        var name = post.name;
        var email = post.email
        var password = post.password;
        var acctype = 0;
        //var acctype = document.querySelector('input[name="acctype"]:checked').value;

        var sql = "INSERT INTO users (id, name, email, password, acctype) VALUES (?)";
        var query = db.query(sql, [[id, name, email, password, acctype]], function (err, rows, fields, results) {
            res.render('pages/login.ejs');
            if (err) throw err.message;
            //    console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    else {
        res.render('pages/register.ejs');
    }
};

// ==== ======= [ login page call ] ======= ====
exports.login = function (req, res) {
    var sess = req.session;

    if (req.method = "POST") {
        var post = req.body;
        var email = post.email;
        var password = post.password;

        var sql = "SELECT id, name, email, password, acctype FROM users WHERE email = ? AND password = ?";
        db.query(sql, [email, password], function (err, results) {
            if (results.length) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                console.log('User ID = ' + results[0].id);
                res.redirect('home/dashboard');
            } else {
                // console.log(err);
                console.log('\x1b[31m', 'Error: User not found!');
                res.render('pages/login.ejs')
            }
        });
    } else {
        res.render('pages/login.ejs');
    }
};

// ==== ======= [ dashboard after login ] ======= ====
exports.dashboard = function (req, res, next) {

    var user = req.session.user;
    var userId = req.session.userId;
    console.log('User ID = ' + userId);
    if (userId == null) {
        res.redirect("/login");
        // return;
    }
    var sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], function (err, results) {
        res.render('pages/home/dashboard.ejs');
    });
};

// ==== ======= [ logout ] ======= ====
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    })
};