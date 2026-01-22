const mongoose = require('mongoose');

const tpsSchema = new mongoose.Schema({
    nama: String,
    alamat: String,

    //lokasi
    latitude: Number,
    longitude: Number,
    akses_jalan: {
        type: String,
        enum: ['kecil', 'sedang', 'besar'], 
    },


    kapasitas: Number,
    unit_kerja: String,
    no: String,
    type: String,

    kapasitas_maksimal: Number,   
    kapasitas_terpakai: Number,
    status_kapasitas: {
        type: String,
        enum: ['aman', 'hampir_penuh', 'penuh'],
    },

    //fasilitas
    fasilitas: [{
        type: String,
        enum: [
            'bank_sampah',
            'pemilahan',
            'komposter',
            'timbangan',
            'cctv'
        ]
    }],


    jam_operasional: {
        buka: String,  
        tutup: String, 
    },
    hari_operasional: [String],
    jadwal_angkut: String,

    //ratting 
    rating: {
        rata_rata: { type: Number, default: 0 },
        total_penilai: { type: Number, default: 0 },
    },
    total_laporan: { type: Number, default: 0 },

});

const Tps = mongoose.model('Tps', tpsSchema);
module.exports = Tps;