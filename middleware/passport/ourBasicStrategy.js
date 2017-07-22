const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { User } = require('../../models');

const basicStrategy = new BasicStrategy((username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, { message: 'username does not exist'});
    }

    if (!user.validatePassword(password)) {
      return done(null, false, { message: 'password is incorrect'});
    }

    return done(null, user);
  });
});

module.exports = basicStrategy;