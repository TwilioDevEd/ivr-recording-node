require('./connectionHelper');

var expect = require('chai').expect
  , supertest = require('supertest')
  , cheerio = require('cheerio')
  , app = require('../app.js')
  , Agent = require('../models/agent');

describe('extension', function () {
  describe('POST /extension/connect', function () {
    var brodo; // Agent reference

    before(function (done) {
      Agent.create({ extension: 'Brodo', phoneNumber: '555 5555' })
        .then(function (agent) {
          brodo = agent;
          done();
        });
    });

    after(function (done) {
      Agent.remove({}, done);
    });

    context('when there is an agent for a given extension', function () {

      it('responds with return instructions', function (done) {
        var agent = supertest(app);
        agent
          .post('/extension/connect')
          .send({ Digits: 2 })
          .expect(function (res) {
            var $ = cheerio.load(res.text);
            expect($('Say').length).to.equal(1);
            expect($('Dial').first().attr('action'))
              .to.equal("/agents/call?agentId=" + brodo.id);
            expect($('Dial').first().text()).to.equal("555 5555");
            expect($('Dial').children().first().attr('url'))
              .to.equal('/agents/screencall');
          })
        .expect(200, done);
      });
    });

    context('when there is not an agent for a given extension', function () {
      it('response contains redirect to menu', function (done) {
        var agent = supertest(app);
        agent
          .post('/extension/connect')
          .send({ Digits: 0 })
          .expect(function (res) {
            var $ = cheerio.load(res.text);
            expect($('Redirect').first().text()).to.equal('/ivr/welcome');
          })
        .expect(200, done);
      });
    });
  });
});
