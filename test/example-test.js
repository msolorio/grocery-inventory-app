require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const request = require('supertest');
const server = request.agent(`http://localhost:${process.env.PORT}`);

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

function signUpUser(done) {
  server
    .post('/signup')
    .send({username: 'testuser', password: '1111'})
    .expect(302)
    .expect('Location', '/users/testuser')
    .end(onResponse);

  function onResponse(err, res) {
    if (err) return done(err);
    else {
      console.log('user signed up');
      return done();
    }
  } 
}


function tearDownDb() {
  console.log('tearing down DB');
  return mongoose.connection.dropDatabase();
}


describe('after signing up', function() {

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

  it('a user is able to login', function() {
    return server
      .post('/login')
      .send({username: 'testuser', password: '1111'})
      .expect(302)
      .expect('Location', '/users/testuser')
  });

  it('a user is able to logout', function() {
    return server
      .get('/logout')
      .expect(302)
      .expect('Location', '/');
  });

});
