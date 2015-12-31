var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , Agent = require('../models/agent');

// POST: /extension/connect
router.post('/connect', twilio.webhook({validate: false}), function (req, res) {
  var selectedOption = req.body.Digits
    , extensions = {
        2: 'Brodo',
        3: 'Dagobah',
        4: 'Oober'
      };

  Agent.findOne({ extension: extensions[selectedOption] })
    .then(function (agent) {
      if (agent === null) {
        return res.send(redirectToWelcome());
      }

      var twiml = new twilio.TwimlResponse();
      twiml
        .say("You'll be connected shortly to your planet.",
             { voice: "alice", language: "en-GB" })
        .dial({ action: '/agents/call?agentId=' + agent.id }, function() {
          this.number(agent.phoneNumber, {
            url: '/agents/screencall'
          });
        });

      res.send(twiml);
    })
  .catch(function (err) {
    console.log(err);
  });
});

var redirectToWelcome = function () {
  var twiml = new twilio.TwimlResponse();
  twiml
    .redirect('/ivr/welcome');

  return twiml;
}

module.exports = router;
