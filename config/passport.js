var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

// sets up passport configurations
module.exports = function(passport) {

	// sets up sessions
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
          done(err, user);
      });
  });

  ////////////////////////////////////////////////////////////////////
  // LOCAL SIGNUP
  ////////////////////////////////////////////////////////////////////
  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
  }, 
  function(req, username, password, done) {
    // defers function to next tick of the event loop
    // User.findOne only fires if data is sent back
    process.nextTick(function() {
      User.findOne({ 'local.username': username }, function(err, user) {
        if (err) return done(err);
        if (user) {
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  ////////////////////////////////////////////////////////////////////
  // LOCAL LOGIN
  ////////////////////////////////////////////////////////////////////
  passport.use('local-login', new LocalStrategy({
  	usernameField: 'username',
  	passwordField: 'password',
  	passReqToCallback: true
  },
  function(req, username, password, done) {
  	User.findOne({ 'local.username': username }, function(err, user) {
  		if (err) return done(err);
  		if (!user) {
  			return done(null, false, req.flash('loginMessage', 'No user found.'));
  		}
  		if (!user.validPassword(password)) {
  			return done(null, false, req.flash('loginMessage', 'Mmm... that is not the password we have on file for you.'));
  		}
  		return done(null, user);
  	});
  }));

};
