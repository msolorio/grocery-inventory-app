'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jsonParser = require('body-parser').json();
const path = require('path');
const itemsRouter = require('./itemsRouter');
const router = express.Router();

const { User } = require('../models');

const ourBasicStrategy = require('../middleware/passport/ourBasicStrategy');
passport.use(ourBasicStrategy);
router.use(passport.initialize());

// [for dev]
// router.get('/', (req, res) => {
//   console.log('GET request made to /users');

//   User
//     .find()
//     .exec()
//     .then((users) => {
//       res.status(200).json({users: users.map((user) => user.apiRepr())});
//     })
//     .catch((err) => {
//       console.log('error:', err);
//       res.status(500).json({message: `unable to get all users`});
//     });
// });

router.get('/', (req, res, next) => {
  console.log('GET made to /users to login');
  passport.authenticate('basic', (err, user, info) => {
    if (err) {
      console.log('there was an error')
      return next(err);
    }
    if (!user) {
      console.log(`redirecting to /login`);
      return res.redirect('/login');
    }
    // req.logIn(user, (err) => {
    //  if (err) {
    //    console.log('failed to create session');
    //    return next(err);
    //  }
    //  console.log(`redirecting to /users/${user.username}`);
    //   return res.redirect(`/users/${user.username}`);
    // });
    console.log(`redirecting to /users/${user.username}`);
    return res.redirect(`/users/${user.username}`);
  })(req, res, next);
});

router.get('/:username', (req, res) => {
  console.log(`GET request made to /users/${req.params.username}`);
  
  res.sendFile(path.join(__dirname + '/../user.html'));
});

router.use('/:username/items', itemsRouter);

router.post('/', bodyParser.json(), (req, res) => {
  console.log('POST request made to /users');

  if (!req.body) {
    return res.status(422).json({message: 'no request body'});
  }

  let { username, password } = req.body;

  if (!username) {
    return res.status(422).json({message: 'no username in request body'});
  }
  if (typeof username !== 'string') {
    return res.status(422).json({message: 'incorrect field type for username'});
  }
  if (username.trim() === '') {
    return res.status(422).json({message: 'username cannot be empty'});
  }
  if (!password) {
    return res.status(422).json({message: 'no password in request body'});
  }
  if (typeof password !== 'string') {
    return res.status(422).json({message: 'incorrect field type for password'});
  }
  if (password.trim() === '') {
    return res.status(422).json({message: 'password cannot be empty'});
  }

  // check if username already exists
  User
    .find({username: username})
    .count()
    .exec()
    .then((count) => {
      if (count > 0) {
        return res.status(422).json({message: 'username already exists'});
      }

      return User.generateHash(password);
    })
    .then((hash) => {
      return User.create({
        username: username,
        password: hash,
        created: new Date().getTime(),
        createdHumanReadable: new Date()
      });
    })
    .then((newUser) => {
      res.status(201).json(newUser.apiRepr());
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `The server encountered an error attempting to create a new user.`});
    });
});

// router.put('/:id', bodyParser.json(), (req, res) => {
//   console.log('PUT request made to /user');

//   const updatableFields = ['username', 'password'];
//   const updateObject = {};

//   updatableFields.forEach((field) => {
//     if (field in req.body) {
//       updateObject[field] = req.body[field];
//     }
//   });

//   User
//     .findByIdAndUpdate(req.params.id, {$set: updateObject}, {new: true})
//     .exec()
//     .then((updatedUser) => {
//       res.status(200).json({updatedUser: updatedUser.apiRepr()});
//     })
//     .catch((err) => {
//       console.log('error:', err);
//       res.status(500).json({message: `The server encountered an error tying to update user with id: ${req.params.id}`});
//     })
// });

// router.delete('/:id', (req, res) => {

//   User
//     .findByIdAndRemove(req.params.id)
//     .exec()
//     .then((removedUser) => {
//       res.status(200).json({removedUser: removedUser});
//     })
//     .catch((err) => {
//       res.status(500).json({message: `The server encountered an error trying to delete user with id: ${req.params.id}`});
//     });
// });

module.exports = router;
