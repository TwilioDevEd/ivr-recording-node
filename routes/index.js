var express = require('express')
  , router = express.Router();

// GET: /
router.get('/', function(req, res, next) {
  res.redirect('/agents');
});

module.exports = router;
