var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var Agent = require('../models/agent');

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

  var twiml = new twilio.TwimlResponse();
  twiml
    .say("It appears that no agent is available. " +
         "Please leave a message after the beep",
         { voice: "alice", language: "en-GB" })
    .record({
      maxLength: 20,
      action: '/agents/hangup',
      transcribeCallback: '/recordings/create?agentId=' + req.body.agentId
    })
    .say("No record received. Goodbye",
        { voice: "alice", language: "en-GB" })
    .hangup();

  res.send(twiml);
});

// POST: /agents/hangup
router.post('/hangup', twilio.webhook({validate: false}), function (req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml
    .say("Thanks for your message. Goodbye",
         { voice: "alice", language: "en-GB" })
    .hangup();

  res.send(twiml);
});

module.exports = router;
