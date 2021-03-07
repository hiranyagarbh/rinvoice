// ==== ======= [ register page call ] ======= ====
exports.register = function (req, res) {
    var message = '';
    if (req.method == "POST") {
        var post = req.body;
        var id = Math.floor(Math.random() * 1000000);
        var name = post.name;
        var email = post.email
        var password = post.password;
        var acctype = post.acctype;
        console.log(acctype);
        var sql = "INSERT INTO users (id, name, email, password, acctype) VALUES (?)";
        var query = db.query(sql, [[id, name, email, password, acctype]], function (err, rows, fields, results) {
            if (err) {
                // check for duplicate entry
                if (err.errno == 1062) {
                    message = 'Email address already exists';
                    res.render('pages/register.ejs', { message: message });
                    console.log(err.message);
                }
                else {
                    throw err;
                }
            } else {
                res.redirect('/login');
            }
        });
    }
    else {
        res.render('pages/register.ejs', { message: message });
    }
};

// ==== ======= [ login page call ] ======= ====
exports.login = function (req, res) {
    var message = '';
    var sess = req.session;

    if (req.method == "POST") {
        var post = req.body;
        var email = post.email;
        var password = post.password;

        // check for empty fields
        if (email == '' || password == '') {
            message = 'Please enter all credentails.';
            res.render('pages/login.ejs', { message: message });
        }
        else {
            var sql = "SELECT id, name, email, password, acctype FROM users WHERE email = ? AND password = ?";
            db.query(sql, [email, password], function (err, results) {
                if (results.length && email == results[0].email && password == results[0].password) {
                    req.session.userId = results[0].id;
                    req.session.user = results[0];
                    req.session.email = results[0].email;
                    console.log(results[0].id);
                    res.redirect('/home/dashboard');
                }
                else {
                    message = 'Incorrect email or password.';
                    res.render('pages/login.ejs', { message: message });
                    console.log(message);
                }
            });
        }
    } else {
        res.render('pages/login.ejs', { message: message });
    }

};

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
        res.render('pages/home/dashboard.ejs', { data: results });
    });
};

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
        // console.log(results);
    });
};

// ==== ======= [ logout ] ======= ====
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    })
};