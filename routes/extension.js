var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , VoiceResponse = twilio.twiml.VoiceResponse
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

    var twiml = new VoiceResponse();
    twiml.say(
      { voice: 'alice', language: 'en-GB' },
      'You\'ll be connected shortly to your planet.'
    );
    var dial = twiml.dial({
      action: `/agents/call?agentId=${agent.id}`,
      callerId: agent.phoneNumber
    });
    dial.number(
      {url: '/agents/screencall'},
      agent.phoneNumber
    );

    res.send(twiml.toString());
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).send('An error has ocurred');
  });
});

var redirectToWelcome = function () {
  var twiml = new VoiceResponse();
  twiml
    .redirect('/ivr/welcome');

  return twiml.toString();
}

module.exports = router;
