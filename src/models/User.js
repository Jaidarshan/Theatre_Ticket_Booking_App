const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  phone: String,
  isAdmin: { type: Boolean, default: false }, // NEW
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
