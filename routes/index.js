var express = require('express');
var router = express.Router();

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/account/login');
};

/* GET home page. */
router.get('/', isAuthenticated, function (req, res) {
  console.log(req.user);
  res.render('index', { title: 'voiceIn' });
});

module.exports = router;
