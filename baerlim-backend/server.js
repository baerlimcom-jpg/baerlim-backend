import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './authRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Datenbank verbinden
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Baerlim-Backend läuft 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
