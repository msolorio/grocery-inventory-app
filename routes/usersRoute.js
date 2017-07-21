const express = require('express');
const bodyParser = require('body-parser');

// const mongoose = require('mongoose');

const router = express.Router();

const { User } = require('../models');

// [for dev]
router.get('/', (req, res) => {
  console.log('GET request made to /users');

  User
    .find()
    .exec()
    .then((users) => {
      res.status(200).json({users: users.map((user) => user.apiRepr())});
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `unable to get all users`});
    });
});

router.get('/:id', (req, res) => {
  console.log('GET request made to /users/:id');

  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      res.status(200).json({user: user.apiRepr()});
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `unable to find user at id: ${req.params.id}`});
    });
});

router.post('/', bodyParser.json(), (req, res) => {
  console.log('POST request made to /users');

  User
    .create({
      username: req.body.username,
      password: req.body.password,
      created: new Date().getTime(),
      createdHumanReadable: new Date()
    })
    .then((newUser) => {
      res.status(201).json(newUser.apiRepr());
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `The server encountered an error attempting to create a new user.`});
    });
});

router.put('/:id', bodyParser.json(), (req, res) => {
  console.log('PUT request made to /user');

  const updatableFields = ['username', 'password'];
  const updateObject = {};

  updatableFields.forEach((field) => {
    if (field in req.body) {
      updateObject[field] = req.body[field];
    }
  });

  User
    .findByIdAndUpdate(req.params.id, {$set: updateObject}, {new: true})
    .exec()
    .then((updatedUser) => {
      res.status(200).json({updatedUser: updatedUser.apiRepr()});
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `The server encountered an error tying to update user with id: ${req.params.id}`});
    })
});

router.delete('/:id', (req, res) => {

  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then((removedUser) => {
      res.status(200).json({removedUser: removedUser});
    })
    .catch((err) => {
      res.status(500).json({message: `The server encountered an error trying to delete user with id: ${req.params.id}`});
    });

});

module.exports = router;