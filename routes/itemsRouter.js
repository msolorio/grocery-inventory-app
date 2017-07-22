const express = require('express');

const router = express.Router({mergeParams: true});

const { User } = require('../models');

// GET all items
router.get('/', (req, res) => {
	console.log(`GET request made to /users/${req.params.username}/items`);
	
  User
    .findOne({username: req.params.username})
    .exec()
    .then((user) => {
      console.log(`found user ${req.params.username}`);
      res.status(200).json({items: user.getItems()});
    })
    .catch((err) => {
      console.log('error:', err);
      res.status(500).json({message: `unable to find user: ${req.params.username}`});
    });
});

module.exports = router;