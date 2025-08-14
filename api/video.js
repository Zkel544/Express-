const express = require("express");
const cors = require("cors");
const Video = require("../modules/video");

const router = express.Router();
router.use(express.json());
router.use(cors());

// GET semua video
router.get("/video", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error("GET /video error:", err);
    res.status(500).json({ message: "Gagal mengambil data video" });
  }
});

// Tambah video
router.post("/video", async (req, res) => {
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    await new Video({ title, description, url }).save();
    res.status(201).json({ message: "Video berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /video error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menambahkan video" });
  }
});

// Update video
router.post("/video/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, description, url },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video tidak ditemukan" });
    }

    res.status(200).json({
      message: "Video berhasil diperbarui",
      video: updatedVideo
    });
  } catch (err) {
    console.error("POST /video/update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui video" });
  }
});

// Hapus video
router.post("/video/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video tidak ditemukan" });
    }

    res.status(200).json({ message: "Video berhasil dihapus" });
  } catch (err) {
    console.error("POST /video/delete error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus video" });
  }
});

module.exports = router;
