'use strict';

const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const Agent = require('../models/agent');

const router = new express.Router();

// POST: /extension/connect
router.post('/connect', twilio.webhook({validate: false}), function(req, res) {
  const selectedOption = req.body.Digits;
  const extensions = {
        2: 'Brodo',
        3: 'Dagobah',
        4: 'Oober',
      };

  Agent.findOne({extension: extensions[selectedOption]})
  .then(function(agent) {
    if (agent === null) {
      return res.send(redirectToWelcome());
    }

    const twiml = new VoiceResponse();
    twiml.say(
      {voice: 'Polly.Amy', language: 'en-GB'},
      'You\'ll be connected shortly to your planet.'
    );
    const dial = twiml.dial({
      action: `/agents/call?agentId=${agent.id}`,
      callerId: agent.phoneNumber,
    });
    dial.number(
      {url: '/agents/screencall'},
      agent.phoneNumber
    );

    res.send(twiml.toString());
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send('An error has ocurred');
  });
});

const redirectToWelcome = function() {
  const twiml = new VoiceResponse();
  twiml
    .redirect('/ivr/welcome');

  return twiml.toString();
};

module.exports = router;
