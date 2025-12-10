const { name } = require('ejs');
const mongoose = require('mongoose');

const layananSchema = new mongoose.Schema({
    name: String,    
    phone: String,
    region: String,
    note: String,
    type: String,
    status: String,
    no: String,
});

const Layanan = mongoose.model('Layanan', layananSchema);
module.exports = Layanan;