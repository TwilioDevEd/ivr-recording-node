var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var Agent = require('../models/agent');

// POST: /recordings
router.post('/', function (req, res) {
  var agentId = req.body.agentId;
  Agent.findOne({ _id: agentId })
  .then(function (agent) {
    agent.recordings.push({
      phoneNumber: req.body.From,
      transcription: req.body.TranscriptionText,
      url: req.body.RecordingUrl
    });
    agent.save(function () {
      res.status(201);
      res.send('');
    });
  })
  .catch(function (err) {
    console.log(err);
  });
});

module.exports = router;
