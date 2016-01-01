var expect = require('chai').expect
  , supertest = require('supertest')
  , app = require('../app.js');

describe('home', function () {
  describe('GET /', function () {
    it('redirects to /agents', function (done) {
      var agent = supertest(app);
      agent
        .get('/')
        .expect('location', '/agents')
        .expect(302, done);
    });
  });
});
