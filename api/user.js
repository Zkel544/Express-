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


router.post("/update/:id", authenticateToken, async (req, res) => {
  const { username, email, oldPassword, newPassword } = req.body;

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

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password lama salah" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("POST /update error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat memperbarui profil" });
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
