'use strict';

const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

const router = new express.Router();

// POST: /menu
router.post('/', twilio.webhook({validate: false}), function(req, res) {
  const selectedOption = req.body.Digits;
  const optionActions = {
    1: returnInstructions,
    2: planets,
  };

  const action = optionActions[selectedOption] || redirectWelcome;
  res.send(action().toString());
});

const returnInstructions = function() {
  const twiml = new VoiceResponse();
  twiml.say({voice: 'Polly.Amy', language: 'en-GB'},
            'To get to your extraction point, get on your bike and go down ' +
            'the street. Then Left down an alley. Avoid the police cars.' +
            ' Turn left into an unfinished housing development. Fly over ' +
            'the roadblock. Go passed the moon. Soon after you will see ' +
            'your mother ship.');
  twiml.say('Thank you for calling the ET Phone Home Service - the ' +
            'adventurous alien\'s first choice in intergalactic travel');
  twiml.hangup();

  return twiml;
};

const planets = function() {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    action: '/extension/connect',
    numDigits: '1',
  });
  gather.say({voice: 'Polly.Amy', language: 'en-GB', loop: '3'},
             'To call the planet Broh doe As O G, press 2. To call the ' +
             'planet DuhGo bah, press 3. To call an oober asteroid to your ' +
             'location, press 4. To go back to the main menu, press ' +
             'the star key ');

  return twiml;
};

const redirectWelcome = function() {
  const twiml = new VoiceResponse();
  twiml.redirect('/ivr/welcome');

  return twiml;
};

module.exports = router;
