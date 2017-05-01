'use strict';

const express = require('express');
const Agent = require('../models/agent');

const router = new express.Router();

// POST: /recordings
router.post('/', function(req, res) {
  const agentId = req.query.agentId;
  Agent.findOne({_id: agentId})
  .then(function(agent) {
    agent.recordings.push({
      phoneNumber: req.body.From,
      transcription: req.body.TranscriptionText,
      url: req.body.RecordingUrl,
    });
    return agent.save();
  })
  .then(function() {
    res.status(201).send('Recording created');
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send('Could not create a recording');
  });
});

module.exports = router;
