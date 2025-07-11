const express   = require('express');
const router    = express.Router();
const Video     = require('../modules/video');
const cors      = require('cors');
router.use(express.json());
router.use(cors());

router.post('/video', async (req, res) => {
    const { title, description, url } = req.body;

    if (!title || !description || !url) {
        return res.status(400).json({ message: "Isi semua formulir" });
    }

    const newVideo = new Video({
        title,
        description,
        url,
    });

    try {
        await newVideo.save();
        res.status(201).json({ message: "Video berhasil ditambahkan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat menambahkan video" });
    }
});

router.post('/video/update/:id', async (req, res) => {
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
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui video" });
    }
});

router.post('/video/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedVideo = await Video.findByIdAndDelete(id);

        if (!deletedVideo) {
            return res.status(404).json({ message: "Video tidak ditemukan" });
        }

        res.status(200).json({ message: "Video berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus video" });
    }
});

module.exports = router;