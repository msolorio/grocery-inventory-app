// 'use strict';

// const express = require('express');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// const jsonParser = require('body-parser').json();
// const { BasicStrategy } = require('passport-http');

// const router = express.Router();

// const { User } = require('../models');

// const basicStrategy = new BasicStrategy((username, password, done) => {
//   User.findOne({username: username}, (err, user) => {
    
//     if (err) {
//       return done(err);
//     }

//     if (!user) {
//       return done(null, false, { message: 'username does not exist'});
//     }

//     if (!user.validatePassword(password)) {
//       return done(null, false, { message: 'password is incorrect'});
//     }

//     return done(null, user);
//   });
// });

// passport.use(basicStrategy);
// router.use(passport.initialize());

// router.get('/', (req, res, next) => {
// 	// res.sendFile(`${__dirname}/../login.html`);
// });

// // TODO: we want to send user back and redirect
// // router.get('/', (req, res, next) => {
// //   passport.authenticate('basic', (err, user, info) => {
// //     if (err) {
// //     	console.log('there was an error')
// //     	return next(err);
// //     }
// //     if (!user) {
// //     	console.log(`redirecting to /login`);
// //     	return res.redirect('/login');
// //     }
// //     // req.logIn(user, (err) => {
// //     // 	if (err) {
// //     // 		console.log('failed to create session');
// //     // 		return next(err);
// //     // 	}
// //     // 	console.log(`redirecting to /users/${user.username}`);
// //     //   return res.redirect(`/users/${user.username}`);
// //     // });
// //     console.log(`redirecting to /users/${user.id}`);
// //     return res.redirect(`/users/${user.id}`);
// //   })(req, res, next);
// // });

// module.exports = router;
