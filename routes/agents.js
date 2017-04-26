var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , VoiceResponse = twilio.twiml.VoiceResponse
  , Agent = require('../models/agent');

// GET: /agents
router.get('/', function (req, res) {
  Agent.find({})
    .then(function (agents) {
      res.render('agents/index', { agents: agents  });
    });
});

// POST: /agents/call
router.post('/call', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }

  var twiml = new VoiceResponse();
  twiml.say(
    { voice: 'alice', language: 'en-GB' },
    'It appears that no agent is available. ' +
    'Please leave a message after the beep');
  twiml.record({
    maxLength: 20,
    action: '/agents/hangup',
    transcribeCallback: '/recordings?agentId=' + req.query.agentId
  });
  twiml.say(
    { voice: 'alice', language: 'en-GB' },
    'No record received. Goodbye');
  twiml.hangup();

  res.send(twiml.toString());
});

// POST: /agents/hangup
router.post('/hangup', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new VoiceResponse();
  twiml.say(
    { voice: 'alice', language: 'en-GB' },
    'Thanks for your message. Goodbye');
  twiml.hangup();

  res.send(twiml.toString());
});

// POST: /agents/screencall
router.post('/screencall', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new VoiceResponse();
  var gather = twiml.gather({
    action: '/agents/connectmessage',
    numDigits: '1',
  });
  gather.say(spellPhoneNumber(req.body.From));
  gather.say('Press any key to accept');

  twiml.say('Sorry. Did not get your response');
  twiml.hangup();

  res.send(twiml.toString());
});

// POST: /agents/connectmessage
router.post('/connectmessage', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new VoiceResponse();
  twiml
    .say('Connecting you to the extraterrestrial in distress');

  res.send(twiml.toString());
});

var spellPhoneNumber = function (phoneNumber) {
  return phoneNumber.split('').join(',');
};

module.exports = router;
