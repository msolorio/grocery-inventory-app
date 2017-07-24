'use strict';

// const flash = require('connect-flash');
const path = require('path');

module.exports = function(app, passport) {

	// HOMEPAGE ////////////////////////////////////////////////
	app.get('/', ifLoggedIn, (req, res) => {

		res.sendFile(path.join(__dirname + '/../../views/index.html'));
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

	// PROFILE PAGE /////////////////////////////////////////////
	// checks url params for when route is hit directly
	app.get('/users/:username',
		ifLoggedOut,
		correctUserRouteParams,
		(req, res) => {
			return res.sendFile(path.join(__dirname + '/../../views/profile.html'));	
	});

	// LOGOUT ///////////////////////////////////////////////////
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
}

function directToProfile(req, res) {
	return res.redirect(`/users/${req.user.local.username}`);
}

function correctUserRouteParams(req, res, next) {
	if (req.user.local.username !== req.params.username) {
		directToProfile(req, res);
	}
	next();
}

function ifLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		directToProfile(req, res);	
	}
	next();
}

function ifLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}
