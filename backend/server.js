import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: "./.env" });

const app = express();

//  Seguridad / Logs 
app.use(helmet());
const allowlist = (process.env.CORS_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
app.use(cors(allowlist.length ? { origin: allowlist } : {})); 
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "4mb" }));

//  Rate limit básico en /api/auth 
app.use("/api/auth", rateLimit({ windowMs: 15*60*1000, max: 50 }));

//  Mongo 
mongoose.connection.on("connected", () => console.log("✅ MongoDB Atlas conectado"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err.message));
await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });

//  Rutas 
import authRoutes from "./src/routes/auth.routes.js";
import puntosRoutes from "./src/routes/puntos.routes.js";
import rondasRoutes from "./src/routes/rondas.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/puntos", puntosRoutes);
app.use("/api/rondas", rondasRoutes);
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

// Health & versión
app.get("/api/health", (_, res) => res.json({ ok: true, version: "1.0.0" }));

// Manejo de errores final 
app.use((err, req, res, next) => {
  console.error(" Error:", err);
  const code = err.status || 500;
  res.status(code).json({ error: err.message || "Error interno" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
