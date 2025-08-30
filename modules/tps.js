const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
    nama: String,
    alamat: String,
    latitude: Number,
    longitude: Number,
    kapasitas: Number,
    unit_kerja: String,
});

const Tps = mongoose.model('Tps', kategoriSchema);
module.exports = Tps;