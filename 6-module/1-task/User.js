const mongoose = require('mongoose');

const validateEmail = (value) => value.match(/^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/) !== null;

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [{
      validator: validateEmail,
    }],
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: Date,
  updateAt: Date,

});

schema.index({
  email: 1,
  displayName: 1,
});

module.exports = mongoose.model('User', schema);
