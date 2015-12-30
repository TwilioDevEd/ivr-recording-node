var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var Agent = require('../models/agent');

// GET: /agents
router.get('/', function (req, res) {
  Agent.find({})
    .then(function (agents) {
      res.render('agents/index', { agents: agents  });
    });
});

module.exports = router;
