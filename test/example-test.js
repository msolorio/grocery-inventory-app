const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
require('dotenv').config();

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

describe('grocery inventory API resource:', function() {

  before(function() {
    return runServer(process.env.TEST_DATABASE_URL, process.env.PORT);
  });

  beforeEach(function() {
  });

  afterEach(function() {
  });

  after(function() {
    return closeServer();
  });

  // describe('GET to /', function() {

  //   it('should return HTML', function() {
  //     return chai.request(app)
  //       .get('/')
  //       .then(function(res) {
  //         res.should.have.status(200);
  //         res.should.be.html;
  //       });
  //   });

  // });
});
