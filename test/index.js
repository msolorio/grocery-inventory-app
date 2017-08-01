require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const { User, Item } = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
chai.use(chaiHttp);

const seedUserData = require('./seedData.json');

// function seedData() {
//   console.log('seeding items data');
//   // return User.insertMany(seedUserData);
// };

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('grocery inventory API resource:', function() {

  before(function() {
    console.log('in before');

    return runServer(process.env.TEST_DATABASE_URL, process.env.PORT);
  });

  beforeEach(function() {
    console.log('in before each');

    const userCredentials = {
      'username': process.env.TEST_USERNAME,
      'password': '1111'
    };

    return chai.request(app)
      .post('/signup')
      .send(userCredentials)
      .then(function(res) {
        console.log('response to POST on /signup:', res);
      })
      .catch(function(err) {
        console.log('error signing up:', err);
      })
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    console.log('in after');
    return closeServer();
  });
  
  require('./tests')();
});
