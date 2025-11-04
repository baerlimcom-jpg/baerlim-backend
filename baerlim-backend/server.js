import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./authRoutes.js";

// 🔹 .env-Datei laden
dotenv.config();

// 🔹 Express-App erstellen (muss VOR allen app.use() stehen)
const app = express();

// 🔹 CORS aktivieren – erlaubt Anfragen von deiner Seite und lokalem Test
app.use(cors({
  origin: [
    "http://localhost:5500", // Lokaler Test
    "https://baerlim.com",   // Hauptdomain
    "https://www.baerlim.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// 🔹 JSON Body Parser aktivieren
app.use(express.json());

// 🔹 MongoDB-Verbindung herstellen
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB verbunden"))
.catch((err) => console.error("❌ MongoDB Fehler:", err.message));

// 🔹 Auth-Routen
app.use("/api/auth", authRoutes);

// 🔹 Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Baerlim Backend läuft erfolgreich!");
});

// 🔹 Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
