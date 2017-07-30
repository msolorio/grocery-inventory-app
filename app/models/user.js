'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const ItemSchema = mongoose.Schema({
  itemName: String,
  targetAmount: Number,
  currentAmount: Number,
  unitName: String,
  stepVal: Number,
  location: String,
  image: String,
  clickVal: Number
});

const UserSchema = mongoose.Schema({
	local: {
		username: String,
  	password: String,
	},
  items: [ItemSchema]
});

UserSchema.methods.apiRepr = function() {
  return {
    id: this.id,
    local: this.local,
    items: this.items
  };
};

UserSchema.methods.getItems = function() {
  return this.items;
}

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);

module.exports = { User, Item };
