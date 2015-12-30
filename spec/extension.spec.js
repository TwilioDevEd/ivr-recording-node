require('./connectionHelper');

var expect = require('chai').expect;
var supertest = require('supertest');
var cheerio = require('cheerio');
var Agent = require('../models/agent');

var app = require('../app.js');

describe('extension', function () {
  describe('POST /extension/connect', function () {
    before(function (done) {
      Agent.create({ extension: '123', phoneNumber: '555 5555' }, done);
    });

    after(function (done) {
      Agent.remove({}, done);
    });

    it('responds with return instructions', function (done) {
      var agent = supertest(app);
      agent
      .post('/extension/connect')
      .send({ Digits: 123 })
      .expect(function (res) {
        var $ = cheerio.load(res.text);
        expect($('Say').length).to.equal(1);
        expect($('Dial').first().text()).to.equal("555 5555");
      })
      .expect(200, done);
    });
  });
});
