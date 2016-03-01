var express = require('express')
  , router = express.Router()
  , twilio = require('twilio');

// POST: /ivr/welcome
router.post('/welcome', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml.gather({
    action: '/menu',
    numDigits: '1'
  }, function () {
    this.play('http://howtodocs.s3.amazonaws.com/et-phone.mp3', {loop: 3});
  });

  res.send(twiml.toString());
});

module.exports = router;
