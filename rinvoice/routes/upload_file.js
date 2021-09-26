var express = require('express');
var router = express.Router();

exports.upload_file = function(req, res) {
    res.render('pages/home/upload_file');
};