// ==========================
// 🟢 Auth Routes – Baerlim Backend
// ==========================

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const router = express.Router();

// 🟣 Registrierung
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Eingaben prüfen
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Bitte alle Felder ausfüllen." });
    }

    // Prüfen, ob Nutzer schon existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "E-Mail ist bereits registriert." });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen User speichern
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: "✅ Registrierung erfolgreich!" });
  } catch (err) {
    console.error("❌ Fehler bei Registrierung:", err.message);
    res.status(500).json({
      msg: "Fehler bei Registrierung",
      error: err.message,
    });
  }
});

// 🟣 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Eingaben prüfen
    if (!email || !password) {
      return res.status(400).json({ msg: "Bitte E-Mail und Passwort eingeben." });
    }

    // Nutzer suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "❌ Nutzer nicht gefunden." });
    }

    // Passwort prüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "❌ Falsches Passwort." });
    }

    // JWT erzeugen (optional)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      msg: "✅ Login erfolgreich!",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ Fehler beim Login:", err.message);
    res.status(500).json({
      msg: "Fehler beim Login",
      error: err.message,
    });
  }
});

export default router;
