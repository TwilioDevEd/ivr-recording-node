var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

// POST: /ivr/welcome
router.post('/welcome', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new VoiceResponse();
  var gather = twiml.gather({
    action: '/menu',
    numDigits: '1'
  });
  gather.play({loop: 3}, 'http://howtodocs.s3.amazonaws.com/et-phone.mp3');

  res.send(twiml.toString());
});

module.exports = router;
