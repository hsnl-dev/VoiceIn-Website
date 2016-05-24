var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res) {
  console.log(req.user);
  res.render('index_new', { title: 'voiceIn' });
});

router.get('/newIdx', function (req, res) {
  console.log(req.user);
  res.render('index', { title: 'voiceIn' });
});

module.exports = router;
