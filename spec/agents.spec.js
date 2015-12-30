var expect = require('chai').expect;
var supertest = require('supertest');
var Agent = require('../models/agent');

var app = require('../app.js');

describe('agents', function () {
  describe('GET /agents', function () {

    before(function (done) {
      Agent.create({
        extension: '123',
        phoneNumber: '555 5555',
        recordings: [{
          url: 'http://example.com',
          transcription: 'transcription',
          phoneNumber: '555 5556'
        }]
      })
      .then(function (agent) {
        done();
      });
    });

    after(function (done) {
      Agent.remove({}, done);
    });
    it('renders a list of agents and recordings', function (done) {
      var agent = supertest(app);
      agent
      .get('/agents')
      .expect(function (res) {
        expect(res.text).to.contain('123');
        expect(res.text).to.contain('transcription');
        expect(res.text).to.contain('555 5556');
      })
      .expect(200, done);
    });
  });
});
