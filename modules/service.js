const mongoose = require('mongoose');
const { create } = require('./tps');

const serviceschema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    deskripsi: String,
    status: String,
    tps:{type:mongoose.Schema.Types.ObjectId, ref: 'Tps'},
},{ timestamps: true
});

const Service = mongoose.model('Service', serviceschema);
module.exports = Service;