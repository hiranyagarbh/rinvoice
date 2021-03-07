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
    } else {
        res.render('pages/login.ejs', { message: message });
    }

};