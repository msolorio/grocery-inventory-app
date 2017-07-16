const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
require('dotenv').config();

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

describe('grocery inventory API resource:', function() {

  before(function() {
    return runServer(process.env.PORT);
  });

  beforeEach(function() {
  });

  afterEach(function() {
  });

  after(function() {
    return closeServer();
  });

  describe('GET to /:', function() {

    it('should return HTML', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
        });
    });

  });

  describe('GET to /addItem:', function() {

    it('should return HTML', function() {
      return chai.request(app)
        .get('/addItem')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
        });
    });
  });

  describe('GET to /lists:', function() {

    it('should return HTML', function() {
      return chai.request(app)
        .get('/lists')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
        });
    });
  });

  describe('GET to /inventory', function() {
    it('should redirect to /', function() {
      return chai.request(app)
        .get('/inventory')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.html;
        });
    });
  });
});
