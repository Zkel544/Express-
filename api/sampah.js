const router = require("express").Router();
const express = require("express");
const Sampah = require("../modules/sampah");
const cors = require("cors");
router.use(cors());
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const sampahList = await Sampah.find().populate("kategori");
    res.status(200).json(sampahList);
  } catch (err) {
    console.error("GET /sampah error:", err);
    res.status(500).json({ message: "Gagal mengambil data sampah" });
  }
});

router.post("/add", async (req, res) => {
  const { name, kategori, satuan, harga, deskripsi } = req.body;

  if (!name || !kategori) {
    return res.status(400).json({ message: "Isi formulir wajib" });
  }

  const newSampah = new Sampah({
    name,
    kategori,
    satuan,
    harga,
    deskripsi,
  });
  if (!newSampah.satuan) newSampah.satuan = "kg";
  if (!newSampah.harga) newSampah.harga = 0;
  if (!newSampah.deskripsi) newSampah.deskripsi = "-";
  try {
    await newSampah.save();
    res.status(201).json({ message: "Sampah berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menambahkan sampah" });
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, kategori, satuan, harga, deskripsi } = req.body;

  if (!name || !kategori) {
    return res.status(400).json({ message: "Isi formulir wajib" });
  }

  try {
    const updatedSampah = await Sampah.findByIdAndUpdate(
      id,
      { name, kategori, satuan, harga, deskripsi },
      { new: true }
    );

    if (!updatedSampah) {
      return res.status(404).json({ message: "Sampah tidak ditemukan" });
    }

    res.status(200).json({
      message: "Sampah berhasil diperbarui",
      sampah: updatedSampah,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui sampah" });
  }
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSampah = await Sampah.findByIdAndDelete(id);

    if (!deletedSampah) {
      return res.status(404).json({ message: "Sampah tidak ditemukan" });
    }

    res.status(200).json({ message: "Sampah berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus sampah" });
  }
});

module.exports = router;
