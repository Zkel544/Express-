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
  refreshToken: String,
  totalPoint: {
    type: Number,
    default: 0
  } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;