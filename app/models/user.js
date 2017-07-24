// 'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
	local: {
		username: String,
  	password: String,
	},
  items: [{
    itemName: String,
    targetAmount: Number,
    currentAmount: Number,
    unitName: String,
    stepVal: Number,
    location: String,
    image: String
  }]
});

// UserSchema.methods.apiRepr = function() {
//   return {
//     id: this._id,
//     username: this.username,
//     password: this.password,
//     items: this.items
//   };
// };

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

module.exports = User;


