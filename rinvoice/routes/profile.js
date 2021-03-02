var express = require('express');
var router = express.Router();

// get profile page
router.get('/', function(req, res, next) {
  res.render('pages/profile');
});

module.exports = router;
