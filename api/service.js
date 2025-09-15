const express = require("express");
const cors = require("cors");
const Service = require("../modules/service");

const router = express.Router();
router.use(express.json());
router.use(cors());

// GET semua service
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().populate("user");
    res.status(200).json(services);
  } catch (err) {
    console.error("GET /service error:", err);
    res.status(500).json({ message: "Gagal mengambil data layanan" });
  }
});

// Tambah service
router.post("/add", async (req, res) => {
  const { user, name, deskripsi = "-", status,tps} = req.body;

  if (!user || !name?.trim() || !status) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    await new Service({
      user,
      name: name.trim(),
      deskripsi,
      status,
      tps,
    }).save();

    res.status(201).json({ message: "Layanan berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /service/add error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan layanan" });
  }
});

// Update service
router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { user, name, deskripsi = "-", status,tps } = req.body;

  if (!user || !name?.trim() || !status) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { user, name: name.trim(), deskripsi, status, tps },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.status(200).json({
      message: "Layanan berhasil diperbarui",
      data: updatedService
    });
  } catch (err) {
    console.error("POST /service/update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui layanan" });
  }
});

// Hapus service
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Layanan tidak ditemukan" });
    }

    res.status(200).json({ message: "Layanan berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /service/delete error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus layanan" });
  }
});

module.exports = router;
