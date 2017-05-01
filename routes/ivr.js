'use strict';

const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

const router = new express.Router();

// POST: /ivr/welcome
router.post('/welcome', twilio.webhook({validate: false}), function(req, res) {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: '/menu',
    numDigits: '1',
  });
  gather.play({loop: 3}, 'http://howtodocs.s3.amazonaws.com/et-phone.mp3');

  res.send(twiml.toString());
});

module.exports = router;
