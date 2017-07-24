const express = require('express');
const User = require('../models/user');
const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {

	User
		.findById(req.user.id)
		.exec()
		.then((user) => {
			res.status(200).json({items: user.getItems()})
		})
		.catch((err) => {
			console.error('error:', err);
			res.status(500).json({message: `the server encountered an error retrieving items for user with id: ${req.user.id}`});
		});

});

router.post('/', (req, res) => {

	// TODO: validation on post body
	const newItem = req.body;

	User
		.findById(req.user.id)
		.exec()
		.then((user) => {
			user.items.push(newItem);

			return user;
		})
		.then((updatedUserClone) => {
			User
				.findByIdAndUpdate(req.user.id, {$set: updatedUserClone}, {new: true})
				.exec()
				.then((updatedUser) => {
					res.status(200).json({items: updatedUser.getItems()});
				});
		})
		.catch((err) => {
			console.error('error:', err);
			res.status(500).json({message: `The server encountered an error updating items for user with id: ${req.user.id}`})
		});

});

module.exports = router;