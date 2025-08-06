const { name } = require('ejs');
const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
    name: String,
});

const Kategori = mongoose.model('Kategori', kategoriSchema);
module.exports = Kategori;
