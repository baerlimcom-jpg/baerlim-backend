import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./authRoutes.js";

dotenv.config(); // MUSS ganz oben vor allem anderen stehen!

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://baerlim.com",
    "https://www.baerlim.com"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// 🟢 MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB Fehler:", err.message));

// 🟢 Routes
app.use("/api/auth", authRoutes);

// 🟢 Testroute
app.get("/", (req, res) => {
  res.send("🚀 Baerlim Backend läuft erfolgreich!");
});

// 🟢 Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
