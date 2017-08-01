require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const { User, Item } = require('../app/models/user');
const { app } = require('../server');
chai.use(chaiHttp);

module.exports = describe('GET to /items', function() {
  it('should run GET items test', function() {
    return chai.request(app)
      .get(`/users/${process.env.TEST_USERNAME}/items`)
      .then(function(res) {
        console.log('inside first test');
        // should be an array of items for the user
        console.log('res:', res);
        console.log('res on GET to /items:', res.body.items);
        res.body.items.should.be.a('array');
      })
      .catch(function(err) {
        console.log('there was an error GETing items:', err);
      });
  });
});
