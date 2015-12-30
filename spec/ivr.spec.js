var expect = require('chai').expect;
var supertest = require('supertest');
var cheerio = require('cheerio');

var app = require('../app.js');

describe('ivr', function () {
  describe('GET /ivr/welcome', function () {
    it('response contains Gather', function (done) {
      var agent = supertest(app);
      agent
      .post('/ivr/welcome')
      .expect(function (res) {
        var $ = cheerio.load(res.text);
        expect($('Gather').children('Play').length).to.equal(1);
      })
      .expect(200, done);
    });
  });
});
