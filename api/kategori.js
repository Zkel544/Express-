const Kategori = require('../modules/kategori');
const express = require('express');
const router = express.Router();
router.use(express.json());
const cors = require('cors');
router.use(cors());

router.post('/add', async (req, res) => {
    let { name, kategori } = req.body;
    name = name.trim();
    kategori = kategori.trim();

    if (!name || !kategori) {
        return res.status(400).json({ message: "Isi semua formulir" });
    }

    const Sampah = new Kategori({
        name,
        kategori,
    });

    try{
    await Sampah.save();
    res.status(201).json({ message: "sampah berhasil ditambahkan" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan sampah" });
    }
})

module.exports = router;