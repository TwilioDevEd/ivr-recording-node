var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var Agent = require('../models/agent');

// POST: /recordings
router.post('/', function (req, res) {
  var agentId = req.query.agentId;
  Agent.findOne({ _id: agentId })
  .then(function (agent) {
    agent.recordings.push({
      phoneNumber: req.body.From,
      transcription: req.body.TranscriptionText,
      url: req.body.RecordingUrl
    });
    return agent.save();
  })
  .then(function () {
    res.status(201).send('Recording created');
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).send('Could not create a recording');
  });
});

module.exports = router;
