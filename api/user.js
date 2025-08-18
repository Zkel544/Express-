const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/user");
const BlacklistedToken = require("../modules/BlacklistedToken");
const authenticateToken = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil profil" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password -refreshToken -accessToken");
    res.status(200).json(users);
  } catch (err) {
    console.error("GET /user error:", err);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { username, email, password, phone, address, level } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      level: level || "user", 
    });

    await newUser.save();
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: "User berhasil ditambahkan",
      user: userData,
    });
  } catch (err) {
    console.error("POST /add error:", err);
    res.status(500).json({ message: "Gagal menambahkan user" });
  }
});


router.post("/update/:id", authenticateToken, async (req, res) => {
  const { username, email, password, phone, address, level } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Isi semua formulir wajib" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.username = username;
    user.email    = email;
    user.phone    = phone || user.phone;
    user.address  = address || user.address;
    user.level    = level || user.level;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User berhasil diperbarui",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        level: user.level
      }
    });
  } catch (err) {
    console.error("POST /update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui user" });
  }
});

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /delete/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus akun" });
  }
});

module.exports = router;
