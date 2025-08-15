const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  level: {
    type: String,
    enum: ['petugas','admin', 'user'],
    default: 'user'
  },
  phone:Number,
  address:String,
  refreshToken: String 
});

const User = mongoose.model('User', userSchema);
module.exports = User;