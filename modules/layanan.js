const mongoose = require('mongoose');

const layananSchema = new mongoose.Schema({
    phone: String,
    region: String,
    note: String,
    type: String,
    status: String,
});

const Layanan = mongoose.model('Layanan', layananSchema);
module.exports = Layanan;