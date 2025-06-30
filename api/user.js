const express = require("express");
const User = require("../modules/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.use(express.json());

//signup
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Isi semua formulir" });
  } else if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username harus memiliki setidaknya 3 karakter" });
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      message: "Username hanya boleh mengandung huruf, angka, dan garis bawah",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid" });
  } else if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password harus memiliki setidaknya 8 karakter" });
  }

  try {
    const result = await User.find({ email });
    if (result.length > 0) {
      return res.json({ message: "Email sudah terdaftar" });
    }
    const saltrounds = 10;
    const hash = await bcrypt.hash(password, saltrounds);
    const newUser = new User({
      username,
      email,
      password: hash,
    });
    await newUser.save();
    res.status(201).json({ message: "Akun berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat membuat akun" });
  }
});

//login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
    return res.status(400).json({ message: "Isi semua formulir" });
  }
  try {
    const data = await User.find({ email });
    if (!data.length) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
    const hashedPassword = data[0].password;
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
    const accessToken = jwt.sign(
      { id: data[0]._id, email: data[0].email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: data[0]._id, email: data[0].email },
      process.env.JWT_REFRESH_SECRET || "refreshsecretkey",
      { expiresIn: "7d" }
    );
    await User.updateOne(
      { _id: data[0]._id },
      { $set: { refreshToken: refreshToken } }
    );
    return res
      .status(200)
      .json({ message: "Login berhasil", user: data[0], accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
});

function authenticateToken(req, res, next) { 
  const authHeader = req.headers["authorization"];
  console.log("Authorization header received:", authHeader);

  if (!authHeader) {
    console.log("No Authorization header found");
    return res.sendStatus(401); // Unauthorized
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Authorization header format is invalid");
    return res.sendStatus(401); // Unauthorized
  }

  const token = parts[1];
  console.log("Token extracted:", token);

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
    if (err) {
      console.error("JWT verify error:", err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; 
    next();
  });
}

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil profil" });
  }
});

// Logout 
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $unset: { refreshToken: "" } }
    );
    res.status(200).json({ message: "Logout berhasil" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat logout" });
  }
});

module.exports = router;
