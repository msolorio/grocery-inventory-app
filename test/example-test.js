require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const request = require('supertest');
const server = request.agent(`http://localhost:${process.env.PORT}`);

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

function callDoneOnServerRes(done) {
  return function(err, res) {
    if (err) return done(err);
    else {
      console.log('user signed up');
      return done();
    }
  }
}

function signUpUser(done) {
  server
    .post('/signup')
    .send({username: 'testuser', password: '1111'})
    .expect(302)
    .expect('Location', '/users/testuser')
    .end(callDoneOnServerRes(done));
}


function tearDownDb() {
  console.log('tearing down DB');
  return mongoose.connection.dropDatabase();
}


describe('after signing up', function(done) {

  before(function() {
    return runServer(process.env.TEST_DATABASE_URL, process.env.PORT);
  });

  beforeEach(function(done) {
    return signUpUser(done);
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  it('a user is able to login', function(done) {
    server
      .post('/login')
      .send({username: 'testuser', password: '1111'})
      .expect(302)
      .expect('Location', '/users/testuser')
      .end(callDoneOnServerRes(done));
  });

  it('a user is able to logout', function(done) {
    server
      .get('/logout')
      .expect(302)
      .expect('Location', '/')
      .end(callDoneOnServerRes(done));
  });


  it('a user is able to acces their items', function(done) {
    server
      .get('/users/testuser/items')
      .expect(200)
      .end(onResponse);

      function onResponse(err, res) {
        if (err) return done(err);
        else {
          res.body.should.have.property('items');
          res.body.items.should.be.a('array');
          res.body.items.should.have.lengthOf(0);
          return done();
        }
      }
  });

  

});

describe('without being logged in', function() {

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

  it('user can access signup page', function() {
    return chai.request(app)
      .get('/signup')
      .then(function(res) {
        res.should.be.html;
        res.should.have.status(200);
      });
  });

  
  it('user can access login page', function() {
    return chai.request(app)
      .get('/login')
      .then(function(res) {
        res.should.be.html;
        res.should.have.status(200);
      });
  });
  
});
