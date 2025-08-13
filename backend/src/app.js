import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import puntosRoutes from "./routes/puntos.routes.js";
import rondasRoutes from "./routes/rondas.routes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Static para fotos locales
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/puntos", puntosRoutes);
app.use("/api/rondas", rondasRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true }));

export default app;