const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Nama user harus unik
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

module.exports = mongoose.model('User', userSchema);