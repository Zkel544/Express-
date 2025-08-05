const mongoose = require('mongoose');

const serviceschema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    deskripsi: String,
    status: String,
});

const Service = mongoose.model('Service', serviceschema);
module.exports = Service;