const service = require('../modules/service');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(express.json());
router.use(cors());

router.get('/', async (req, res) => {
  try {
    const services = await service.find().populate('user');
    res.status(200).json(services);
  } catch (err) {
    console.error('GET /service error:', err);
    res.status(500).json({ message: 'Gagal mengambil data layanan' });
  }
});

router.post('/add', async (req, res) => {
  const { user, name, deskripsi, status } = req.body;

  if (!user || !name || !status) {
    return res.status(400).json({ message: 'Isi semua formulir' });
  }

  const newService = new service({
    user,
    name,
    deskripsi: deskripsi || '-',
    status,
  });

  try {
    await newService.save();
    res.status(201).json({ message: 'Layanan berhasil ditambahkan' });
  } catch (err) {
    console.error('POST /service/add error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan layanan' });
  }
});

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { user, name, deskripsi, status } = req.body;

  if (!user || !name || !status) {
    return res.status(400).json({ message: 'Isi semua formulir' });
  }

  try {
    const updatedService = await service.findByIdAndUpdate(
      id,
      { user, name, deskripsi, status },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Layanan berhasil diperbarui',
      service: updatedService,
    });
  } catch (err) {
    console.error('POST /service/update error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui layanan' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }

    res.status(200).json({ message: 'Layanan berhasil dihapus' });
  } catch (err) {
    console.error('DELETE /service/delete error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus layanan' });
  }
});

module.exports = router;