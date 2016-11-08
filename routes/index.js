var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/canvas', function(req, res, next) {
  res.render('canvas', { title: 'Express' });
});

module.exports = router;
