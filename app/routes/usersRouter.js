'use strict';
const express = require('express');
const path = require('path');
const itemsRouter = require('./itemsRouter');

// corrects username in route based on username from cookie
function correctUserRouteParams(req, res, next) {
	if (req.user.local.username !== req.params.username) {
		
		let reqOriginalUrl = req.originalUrl;
		reqOriginalUrl = reqOriginalUrl.split(req.params.username);
		reqOriginalUrl = reqOriginalUrl.join(req.user.local.username);

		return res.redirect(reqOriginalUrl);
	}
	next();
}

function ifLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}

module.exports = function(passport) {

	const router = express.Router();

	router.use(ifLoggedOut);

	router.use('/:username/items', correctUserRouteParams, itemsRouter);

	// PROFILE PAGE /////////////////////////////////////////////
	router.get('/:username', correctUserRouteParams, (req, res) => {
		console.log('hit /users/:username');
    // return res.sendFile(path.join(__dirname + '/../../views/profile.html'));
    return res.render('profile.ejs', { username: req.user.local.username});	
	});

	return router;
}
