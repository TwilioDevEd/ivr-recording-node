var express = require('express');
var router = express.Router();
var twilio = require('twilio');

// POST: /ivr/welcome
router.post('/welcome', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml.gather({
    action: "",
    numDigits: "1",
    method: "POST"
  }, function () {
    this.play("http://howtodocs.s3.amazonaws.com/et-phone.mp3", {loop: 3});
  });

  res.send(twiml);
});

module.exports = router;
