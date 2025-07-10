const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
  token: String,
  expiredAt: Date,
});

module.exports = mongoose.model("BlacklistedToken", BlacklistedTokenSchema);
