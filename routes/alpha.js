var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res) {
  res.render('alpha', { title: '' });
});

module.exports = router;
