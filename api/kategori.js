const Kategori = require('../modules/kategori');
const express  = require('express');
const router   = express.Router();
const cors     = require('cors');
router.use(express.json());
router.use(cors());

router.get('/', async (req, res) => {
  try {
    const kategoriList = await Kategori.find();
    res.status(200).json(kategoriList);
  } catch (err) {
    console.error('GET /kategori error:', err);
    res.status(500).json({ message: 'Gagal mengambil data kategori' });
  }
});

router.post('/add', async (req, res) => {
  let { name, } = req.body;
  name = name?.trim();

  if (!name ) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  const newKategori = new Kategori({ name });

  try {
    await newKategori.save();
    res.status(201).json({ message: "Kategori berhasil ditambahkan" });
  } catch (err) {
    console.error('POST /kategori/add error:', err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan kategori" });
  }
})

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;
  name = name?.trim();

  if (!name) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    const updatedKategori = await Kategori.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedKategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: updatedKategori,
    });
  } catch (err) {
    console.error('POST /kategori/update error:', err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui kategori" });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedKategori = await Kategori.findByIdAndDelete(id);

    if (!deletedKategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    console.error('DELETE /kategori/delete error:', err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus kategori" });
  }
});

module.exports = router;