var express = require('express');
var router = express.Router();

// get invoices page
router.get('/', function(req, res, next) {
  res.render('pages/invoices');
});

module.exports = router;
