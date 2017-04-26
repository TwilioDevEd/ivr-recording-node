var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

// POST: /menu
router.post('/', twilio.webhook({validate: false}), function (req, res) {
  var selectedOption = req.body.Digits;
  var optionActions = {
    1: returnInstructions,
    2: planets
  };

  var action = optionActions[selectedOption] || redirectWelcome;
  res.send(action().toString());
});

var returnInstructions = function () {
  var twiml = new VoiceResponse();
  twiml.say({ voice: 'alice', language: 'en-GB' },
            'To get to your extraction point, get on your bike and go down ' +
            'the street. Then Left down an alley. Avoid the police cars. Turn left ' +
            'into an unfinished housing development. Fly over the roadblock. Go ' +
            'passed the moon. Soon after you will see your mother ship.');
  twiml.say('Thank you for calling the ET Phone Home Service - the ' +
            'adventurous alien\'s first choice in intergalactic travel');
  twiml.hangup();

  return twiml;
};

var planets = function () {
  var twiml = new VoiceResponse();
  var gather = twiml.gather({
    action: '/extension/connect',
    numDigits: '1',
  });
  gather.say({ voice: 'alice', language: 'en-GB', loop: '3' },
             'To call the planet Broh doe As O G, press 2. To call the planet ' +
             'DuhGo bah, press 3. To call an oober asteroid to your location, press 4. To ' +
             'go back to the main menu, press the star key ');

  return twiml;
};

var redirectWelcome = function () {
  var twiml = new VoiceResponse();
  twiml.redirect("/ivr/welcome");

  return twiml;
};

module.exports = router;
