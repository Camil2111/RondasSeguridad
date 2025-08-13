import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes.js";
import puntosRoutes from "./src/routes/puntos.routes.js";


dotenv.config({ path: "./.env" });

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/puntos", puntosRoutes);

// Conexión a MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
}
connectDB();

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Servidor funcionando 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
