import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "./models/User.js";

const router = express.Router();

// Transporter für E-Mails (z. B. Gmail oder Mailjet)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Registrierung
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "E-Mail bereits registriert" });

    const hashed = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).substring(2, 15);
    const newUser = new User({ username, email, password: hashed, verifyToken: token });
    await newUser.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify.html?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"baerlim.com" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Bitte bestätige deine E-Mail-Adresse",
      html: `<p>Hallo ${username},</p>
             <p>Bitte bestätige deine Registrierung, indem du auf den folgenden Link klickst:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    res.json({ msg: "Bestätigungslink wurde gesendet!" });
  } catch (err) {
    res.status(500).json({ msg: "Fehler bei Registrierung", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User nicht gefunden" });
    if (!user.verified) return res.status(401).json({ msg: "E-Mail noch nicht bestätigt" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Falsches Passwort" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ msg: "Login erfolgreich", token });
  } catch (err) {
    res.status(500).json({ msg: "Fehler beim Login", error: err.message });
  }
});

export default router;
