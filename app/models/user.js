'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const ItemSchema = mongoose.Schema({
  itemName: {type: String, required: true},
  targetAmount: {type: Number, required: true},
  currentAmount: {type: Number, required: true},
  unitName: {type: String, required: true},
  stepVal: {type: Number, required: true},
  location: {type: String, required: true},
  clickVal: {type: Number, required: true}
});

const UserSchema = mongoose.Schema({
	local: {
		username: {type: String, required: true},
  	password: {type: String, required: true}
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
