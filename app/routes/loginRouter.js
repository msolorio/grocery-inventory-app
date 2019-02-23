'use strict';

const path = require('path');

const usersRouter = require('./usersRouter');

module.exports = function(app, passport) {

  // INTRO PAGE //////////////////////////////////////////////
  app.get('/intro', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../views/index.html'));
  });

	// HOMEPAGE ////////////////////////////////////////////////
	app.get('/', ifLoggedIn, (req, res) => {
    res.redirect('/intro');
	});

	// LOGIN PAGE //////////////////////////////////////////////
	app.get('/login', ifLoggedIn, (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	// LOGIN ATTEMPT (custom authentication handling) //////////
	app.post('/login', (req, res, next) => {

		passport.authenticate('local-login', (err, user, info) => {
			if (err) return next(err);

			if (!user) return res.redirect('/login');

			// req.login establishes a session
			req.login(user, (loginErr) => {
				if (loginErr) return next(loginErr);

				res.redirect(`/users/${user.local.username}`);
			});
		})(req, res, next);

	});

	// SINGUP PAGE /////////////////////////////////////////////
	app.get('/signup', ifLoggedIn, (req, res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	// SIGNUP ATTEMPT (custom authentication handling) /////////
	app.post('/signup', (req, res, next) => {

		passport.authenticate('local-signup', (err, user, info) => {
			if (err) return next(err);

			if (!user) return res.redirect('/signup');

			req.login(user, (loginErr) => {
				if (loginErr) return next(loginErr);

				res.redirect(`/users/${user.local.username}`);
			});
		})(req, res, next);

	});

	// LOGOUT ///////////////////////////////////////////////////
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
}

function ifLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect(`/users/${req.user.local.username}`);
	}
	next();
}

function ifLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}
