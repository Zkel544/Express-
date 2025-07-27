const mongoose = require('mongoose');

const sampahSchema = new mongoose.Schema({
    name: String,
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori' },
    satuan : String,
    harga: Number,
    deskripsi: String,
});

module.exports = mongoose.model('sampah',sampahSchema)
