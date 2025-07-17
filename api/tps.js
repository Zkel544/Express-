const Tps = require('../modules/tps');
const express = require('express');
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(cors());

router.get('/', async (req, res) => {
    try {
        const tpsList = await Tps.find();
        res.status(200).json(tpsList);
    } catch (err) {
        console.error('GET /tps error:', err);
        res.status(500).json({ message: 'Gagal mengambil data TPS' });
    }
});

router.post('/add', async (req, res) => {
    const { nama, alamat, latitude, longitude, kapasitas } = req.body;

    if (!nama || !alamat || !latitude || !longitude || !kapasitas) {
        return res.status(400).json({ message: "Isi semua formulir" });
    }

    const newTps = new Tps({
        nama,
        alamat,
        latitude,
        longitude,
        kapasitas,
    });

    try {
        await newTps.save();
        res.status(201).json({ message: "TPS berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan TPS" });
    }
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, alamat, latitude, longitude, kapasitas } = req.body;

    if (!nama || !alamat || !latitude || !longitude || !kapasitas) {
        return res.status(400).json({ message: "Isi semua formulir" });
    }

    try {
        const updatedTps = await Tps.findByIdAndUpdate(
            id,
            { nama, alamat, latitude, longitude, kapasitas },
            { new: true }
        );

        if (!updatedTps) {
            return res.status(404).json({ message: "TPS tidak ditemukan" });
        }

        res.status(200).json({
            message: "TPS berhasil diperbarui",
            tps: updatedTps
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui TPS" });
    }
});

module.exports = router;

