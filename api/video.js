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

module.exports = router;