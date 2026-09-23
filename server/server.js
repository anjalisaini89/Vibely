import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import songRoutes from "./routes/songRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

/* =========================================
   STATIC UPLOADS
========================================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================================
   ROOT
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vibely API is running 🎵",
  });
});

/* =========================================
   API HEALTH CHECK
========================================= */

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Vibely API",
  });
});

/* =========================================
   SONG ROUTES
========================================= */

app.use("/api/songs", songRoutes);

/* =========================================
   404 HANDLER
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================
   ERROR HANDLER
========================================= */

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================================
   START SERVER
========================================= */

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🎵 Vibely server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Unable to start Vibely server:",
      error.message
    );

    process.exit(1);
  }
}

startServer();