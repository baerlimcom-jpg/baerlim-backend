import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./authRoutes.js";

dotenv.config();

const app = express();

// 🟢 CORS aktivieren – erlaubt Anfragen von deiner Seite und lokalem Test
app.use(cors({
  origin: [
    "http://localhost:5500",          // wenn du über Live Server testest
    "https://baerlim.com",            // später deine eigene Domain
    "https://www.baerlim.com"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

// 🟢 JSON Body Parser
app.use(express.json());

// 🟢 MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err.message));

// 🟢 Routes
app.use("/api/auth", authRoutes);

// 🟢 Health Check Route (zum Testen im Browser)
app.get("/", (req, res) => {
  res.send("🚀 Baerlim Backend läuft erfolgreich!");
});

// 🟢 Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
