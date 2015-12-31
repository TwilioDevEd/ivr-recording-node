var expect = require('chai').expect;
var supertest = require('supertest');
var cheerio = require('cheerio');
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

  describe('POST /agents/call', function () {
    context('when the call status is completed', function () {
      it('responds with empty content', function (done) {
        var agent = supertest(app);
        agent
          .post('/agents/call')
          .send({ CallStatus: 'completed' })
          .expect(function (res) {
            expect(res.text).to.not.contain('Response');
          })
        .expect(200, done);
      });
    });

    context('when the call status is not completed', function () {
      it('responds with empty content', function (done) {
        var agent = supertest(app);
        agent
          .post('/agents/call')
          .send({
            CallStatus: 'in-progress',
            agentId: 5
          })
          .expect(function (res) {
            var $ = cheerio.load(res.text);
            expect($('Say').length).to.equal(2);
            expect($('Record').first().attr('transcribecallback'))
              .to.equal('/recordings/create?agentId=5');
            expect($('Record').first().attr('action'))
              .to.equal('/agents/hangup');
            expect($('Hangup').length).to.equal(1);
          })
        .expect(200, done);
      });
    });
  });

  describe('POST /agents/hangup', function () {
    it('responds with say and hangup', function (done) {
      var agent = supertest(app);
      agent
        .post('/agents/hangup')
        .expect(function (res) {
          var $ = cheerio.load(res.text);
          expect($('Say').length).to.equal(1);
          expect($('Hangup').length).to.equal(1);
        })
      .expect(200, done);
    });
  });

  describe('POST /agents/screencall', function () {
    it('responds with gather and a phone number spelled', function (done) {
      var agent = supertest(app);
      agent
        .post('/agents/screencall')
        .send({ From: '1234567890'  })
        .expect(function (res) {
          var $ = cheerio.load(res.text);
          expect($('Gather').first().attr('action'))
              .to.equal('/agents/connectmessage');
          expect($('Gather').children().first().text())
              .to.equal('1,2,3,4,5,6,7,8,9,0');
          expect($('Hangup').length).to.equal(1);
        })
      .expect(200, done);
    });
  });

  describe('POST /agents/connectmessage', function () {
    it('responds with say', function (done) {
      var agent = supertest(app);
      agent
        .post('/agents/connectmessage')
        .expect(function (res) {
          var $ = cheerio.load(res.text);
          expect($('Say').length).to.equal(1);
        })
      .expect(200, done);
    });
  });
});
