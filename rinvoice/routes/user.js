var express = require('express');
var router = express.Router();


exports.login = function (req, res) {
    res.render('pages/login.ejs')
}


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

        var query = db.query(sql, [[id, name, email, password, acctype]], function (err, rows, fields, result) {
            res.render('pages/login.ejs');
            if (err) throw err.message;
            //    console.log("Number of records inserted: " + result.affectedRows);
        });
    }
    else {
        res.render('pages/register.ejs');
    }
};
