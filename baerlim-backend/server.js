// ✅ Importiere benötigte Module
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./authRoutes.js";

// ✅ .env laden (enthält MONGO_URI & evtl. PORT)
dotenv.config();

// ✅ Express App erstellen
const app = express();

// ✅ CORS aktivieren – erlaubt Aufrufe von deiner Domain + lokalem Test
app.use(cors({
  origin: [
    "https://baerlim.com",       // deine echte Seite
    "https://www.baerlim.com",   // falls mit www aufgerufen wird
    "http://localhost:5500"      // für lokalen Live Server Test
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

// ✅ JSON-Parser aktivieren (für POST-Requests)
app.use(express.json());

// ✅ MongoDB Verbindung
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err.message));

// ✅ API-Routen
app.use("/api/auth", authRoutes);

// ✅ Health-Check Route
app.get("/", (req, res) => {
  res.send("🚀 Baerlim Backend läuft erfolgreich!");
});

// ✅ Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
