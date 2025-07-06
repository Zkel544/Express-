const { name } = require('ejs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    katergori: String,
});

const Kategori = mongoose.model('Kategori', userSchema);
module.exports = Kategori;