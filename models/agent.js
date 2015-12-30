var mongoose = require('mongoose');

var Recording = new mongoose.Schema({
  url:           String,
  transcription: String,
  phoneNumber:   String
});

var Agent = new mongoose.Schema({
  extension:   String,
  phoneNumber: String,
  recordings:  [Recording]
});


var agent = mongoose.model('agent', Agent);
module.exports = agent;
