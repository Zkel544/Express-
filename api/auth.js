const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/user");
const BlacklistedToken = require("../modules/BlacklistedToken");
const authenticateToken = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

function validateSignup({ username, email, password }) {
  const errors = [];
  if (!username || !email || !password) errors.push("Isi semua formulir");
  if (username && username.length < 3) errors.push("Username minimal 3 karakter");
  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) errors.push("Username hanya huruf, angka, dan _");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Format email tidak valid");
  if (password && password.length < 8) errors.push("Password minimal 8 karakter");
  return errors;
}

function validateLogin({ email, password }) {
  const errors = [];
  if (!email || !password) errors.push("Isi semua formulir");
  return errors;
}

// Signup
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  username = username?.trim();
  email = email?.trim();
  password = password?.trim();

  const errors = validateSignup({ username, email, password });
  if (errors.length) return res.status(400).json({ message: errors[0] });

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    console.error("POST /signup error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat membuat akun" });
  }
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  const errors = validateLogin({ email, password });
  if (errors.length) return res.status(400).json({ message: errors[0] });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET || "refreshsecretkey",
      { expiresIn: "7d" }
    );

    await User.updateOne({ _id: user._id }, { refreshToken });

    res.status(200).json({
      message: "Login berhasil",
      user: { _id: user._id, username: user.username, email: user.email },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("POST /login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
});

// Logout
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token tidak ditemukan" });

    const decoded = jwt.decode(token);
    await BlacklistedToken.create({
      token,
      expiredAt: new Date(decoded.exp * 1000)
    });

    await User.updateOne({ _id: req.user.id }, { $unset: { refreshToken: "" } });
    res.status(200).json({ message: "Logout berhasil" });
  } catch (err) {
    console.error("POST /logout error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat logout" });
  }
});

module.exports = router;
