const layanan = require('../modules/layanan');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(express.json());
router.use(cors());

router.get('/', async (req, res) => {
  try {
    const layananList = await layanan.find().populate('user');
    res.status(200).json(layananList);
  } catch (err) {
    console.error('GET /layanan error:', err);
    res.status(500).json({ message: 'Gagal mengambil data layanan' });
  }
});

router.post('/add', async (req, res) => {
    const { phone, region, note, type, status } = req.body;
    
    if (!phone || !region || !type || !status) {
        return res.status(400).json({ message: 'Isi semua formulir' });
    }
    
    const newLayanan = new layanan({
        phone,
        region,
        note: note || '-',
        type,
        status,
    });
    
    try {
        await newLayanan.save();
        res.status(201).json({ message: 'Layanan berhasil ditambahkan' });
    } catch (err) {
        console.error('POST /layanan/add error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan layanan' });
    }
}); 

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { phone, region, note, type, status } = req.body;

    if (!phone || !region || !type) {
        return res.status(400).json({ message: 'Isi semua formulir' });
    }

    try {
        const updatedLayanan = await layanan.findByIdAndUpdate(
            id,
            { phone, region, note, type, status },
            { new: true }
        );

        if (!updatedLayanan) {
            return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        }

        res.status(200).json(updatedLayanan);
    } catch (err) {
        console.error('POST /layanan/update/:id error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui layanan' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLayanan = await layanan.findByIdAndDelete(id);

        if (!deletedLayanan) {
            return res.status(404).json({ message: 'Layanan tidak ditemukan' });
        }

        res.status(200).json({ message: 'Layanan berhasil dihapus' });
    } catch (err) {
        console.error('DELETE /layanan/delete/:id error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus layanan' });
    }
});

module.exports = router;