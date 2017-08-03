const express = require('express');
const { User, Item } = require('../models/user');
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
			user.items.unshift(newItem);

			return user;
		})
		.then((updatedUserClone) => {
			return User
				.findByIdAndUpdate(req.user.id, {$set: updatedUserClone}, {new: true})
		})
		.then((updatedUser) => {
			res.status(201).json({newItem: updatedUser.items[0]});
		})
		.catch((err) => {
			console.error('error:', err);
			res.status(500).json({message: `The server encountered an error updating items for user with id: ${req.user.id}`})
		});

});

router.put('/:itemid', (req, res) => {

  const updateItem = req.body;
  
  // TODO:
	// validate if req.body.id matches req.params.id //////////////////////////

	User
		.findOneAndUpdate(
			{ _id: req.user.id, "items._id": req.params.itemid },
			{ $set: {"items.$": updateItem} }, {new: true})
		.exec()
		.then((updatedUser) => {
			return updatedUser.items.find((item) => {
				return item.id === req.params.itemid;
			});
		})
		.then((updatedItem) => {
			res.status(200).json({updatedItem: updatedItem});
		})
		.catch((err) => {
			console.error('error:', err);
			res.status(500).json({message: `The server encountered an error updating your item with id: ${req.params.itemid}`});
		});

});

router.delete('/:itemid', (req, res) => {

	User
		.findById(req.user.id)
		.exec()
		.then((user) => {
			filteredItems = user.items.filter((item) => {
				return item.id !== req.params.itemid;
			});

			user.items = filteredItems;
			return user;
		})
		.then((updatedUserClone) => {
			return User
				.findByIdAndUpdate(req.user.id, {$set: updatedUserClone}, {new: true})
		})
		.then((user) => {
			res.status(200).json({items: user.items});
		})
		.catch((err) => {
			console.error('error:', err);
			res.status(500).json({message: `The server encountered an error deleting your item with id: ${req.params.itemid}`});
		});
});

module.exports = router;
