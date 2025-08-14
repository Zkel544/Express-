const express = require("express");
const cors = require("cors");
const Sampah = require("../modules/sampah");

const router = express.Router();
router.use(cors());
router.use(express.json());

// GET semua sampah
router.get("/", async (req, res) => {
  try {
    const sampahList = await Sampah.find().populate("kategori");
    res.status(200).json(sampahList);
  } catch (err) {
    console.error("GET /sampah error:", err);
    res.status(500).json({ message: "Gagal mengambil data sampah" });
  }
});

// Tambah sampah
router.post("/add", async (req, res) => {
  const { name, kategori, satuan = "kg", harga = 0, deskripsi = "-" } = req.body;

  if (!name?.trim() || !kategori) {
    return res.status(400).json({ message: "Isi formulir wajib" });
  }

  try {
    await new Sampah({
      name: name.trim(),
      kategori,
      satuan,
      harga,
      deskripsi
    }).save();

    res.status(201).json({ message: "Sampah berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /sampah/add error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan sampah" });
  }
});

// Update sampah
router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, kategori, satuan = "kg", harga = 0, deskripsi = "-" } = req.body;

  if (!name?.trim() || !kategori) {
    return res.status(400).json({ message: "Isi formulir wajib" });
  }

  try {
    const updatedSampah = await Sampah.findByIdAndUpdate(
      id,
      { name: name.trim(), kategori, satuan, harga, deskripsi },
      { new: true }
    );

    if (!updatedSampah) {
      return res.status(404).json({ message: "Sampah tidak ditemukan" });
    }

    res.status(200).json({
      message: "Sampah berhasil diperbarui",
      data: updatedSampah
    });
  } catch (err) {
    console.error("POST /sampah/update/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui sampah" });
  }
});

// Hapus sampah
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSampah = await Sampah.findByIdAndDelete(id);

    if (!deletedSampah) {
      return res.status(404).json({ message: "Sampah tidak ditemukan" });
    }

    res.status(200).json({ message: "Sampah berhasil dihapus" });
  } catch (err) {
    console.error("POST /sampah/delete/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus sampah" });
  }
});

module.exports = router;
