'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const itemSchema = mongoose.Schema({
//   itemName: {type: String, required: true},
//   targetAmount: {type: Number, required: true},
//   currentAmount: {type: Number}, // default to 0
//   unitName: {type: String}, // default to unit
//   stepVal: {type: Number}, // default to 1
//   location: {type: String}, // if not provided set to general
//   image: {type: String} // if not provided set to a default image
// });

// itemSchema.virtual('deficit').get(function() {
//   return this.targetAmount - this.currentAmount;
// });

// itemSchema.apiRepr = function() {
//   return {
//     id: this._id,
//     itemName: this.itemName,
//     targetAmount: this.targetAmount,
//     currentAmount: this.currentAmount,
//     deficit: this.deficit,
//     unitName: this.unitName,
//     stepVal: this.stepVal,
//     location: this.location,
//     image: this.image
//   }
// };

// creates an items collection
// is it possible for each user in our user collection to have a unique item collection???
// const Item = mongoose.model('item', itemSchema);

// module.exports = { Item };

const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  items: [{
    // item: {type: Schema.Types.ObjectId, ref='item'},
    itemName: {type: String, required: true},
    targetAmount: {type: Number, required: true},
    currentAmount: {type: Number}, // default to 0
    unitName: {type: String}, // default to unit
    stepVal: {type: Number}, // default to 1
    location: {type: String}, // if not provided set to general
    image: {type: String} // if not provided set to a default image
  }]
});

// can I create a virtual property (deficit) on each item???

UserSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.username,
    password: this.password,
    items: this.items
  };
};

UserSchema.methods.getItems = function() {
  return this.items;
}

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.generateHash = function(password) {
  return bcrypt.hash(password, 10);
}

// const itemSchema = mongoose.Schema({
//   itemName: {type: String, required: true},
//   popularity: {type: Number, required: true}
// });

const User = mongoose.model('user', UserSchema);
// const Item = mongoose.model('item', itemSchema);

module.exports = { User };
