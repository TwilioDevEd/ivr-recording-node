var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var Agent = require('../models/agent');

// POST: /extension/connect
router.post('/connect', twilio.webhook({validate: false}), function (req, res) {
  var extension = req.body.Digits;

  Agent.findOne({ extension: extension })
  .then(function (agent) {
    var twiml = new twilio.TwimlResponse();
    twiml
    .say("You'll be connected shortly to your planet.", { voice: "alice", language: "en-GB" })
    .dial({ action: '' }, function() {
      this.number(agent.phoneNumber, {
        url: ''
      });
    });

    res.send(twiml);
  })
  .catch(function (err) {
    console.log(err);
  });
});

module.exports = router;
