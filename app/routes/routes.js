// 'use strict';

// const flash = require('connect-flash');
const path = require('path');

module.exports = function(app, passport) {

	// HOMEPAGE ////////////////////////////////////////////////
	app.get('/', (req, res) => {
		// res.send(__dirname + '/../../views/index.html')
		res.sendFile(path.join(__dirname + '/../../views/index.html'));
	});

	// LOGIN PAGE //////////////////////////////////////////////
	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	// example of custom handling of authentication
	// https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling

	// LOGIN ATTEMPT (custom authentication handling) //////////
	app.post('/login', (req, res, next) => {

		passport.authenticate('local-login', (err, user, info) => {
			if (err) return next(err);

			if (!user) return res.redirect('/login');
			
			// req.login establishes a session
			req.login(user, (loginErr) => {
				if (loginErr) return next(loginErr);

				return res.redirect(`/profile/${user.local.username}`);
			});
		})(req, res, next);

	});

	// app.post('/login', passport.authenticate('local-login', {
	// 	successRedirect: '/profile',
	// 	failureRedirect: '/login',
	// 	failureFlash: true
	// }));

	// SINGUP PAGE /////////////////////////////////////////////
	app.get('/signup', (req, res) => {
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	// SIGNUP ATTEMPT (custom authentication handling) /////////
	app.post('/signup', (req, res, next) => {

		passport.authenticate('local-signup', (err, user, info) => {
			if (err) return next(err);

			if (!user) return res.redirect('/signup');

			req.login(user, (loginErr) => {
				if (loginErr) return next(loginErr);

				return res.redirect(`/profile/${user.local.username}`);
			});
		})(req, res, next);

	});

	// app.post('/signup', passport.authenticate('local-signup', {
	// 	successRedirect: '/profile',
	// 	failureRedirect: '/signup',
	// 	failureFlash: true
	// }));

	app.get('/profile/:username', isLoggedIn, (req, res) => {	
		res.sendFile(path.join(__dirname + '/../../views/profile.html'));
	});

	// LOGOUT ///////////////////////////////////////////////////
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

}

function isLoggedIn(req, res, next) {
	const cookiedUser = req.user && req.user.local.username || null;
	const paramsUser = req.params.username || null;
	if (cookiedUser &&
			paramsUser &&
			paramsUser === cookiedUser &&
			req.isAuthenticated()) {
		console.log('req.isAuthenticated is true');
		return next();
	}

	console.log('req.isAuthenticated is false');
	res.redirect('/');
}

