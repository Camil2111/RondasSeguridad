import { Router } from "express";
import Ronda from "../models/Ronda.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../services/upload.js";

const router = Router();

// Crear o continuar ronda en proceso
router.post("/iniciar", auth(["vigilante", "supervisor", "admin"]), async (req, res) => {
  const { vigilanteId } = req.user;
  const ronda = await Ronda.create({ vigilanteId: req.user.id, estado: "en_proceso", puntos: [] });
  res.json(ronda);
});

// Agregar punto con evidencia (foto + gps)
router.post("/:id/punto", auth(["vigilante", "supervisor", "admin"]), upload.single("foto"), async (req, res) => {
  const { id } = req.params;
  const { puntoId, lat, lng, tareas, observaciones, gpsConfirmado } = req.body;
  const fotoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const punto = {
    puntoId,
    ubicacion: { lat: Number(lat), lng: Number(lng) },
    tareas: JSON.parse(tareas || "[]"),
    fotoUrl,
    gpsConfirmado: gpsConfirmado === "true",
    observaciones
  };

  const ronda = await Ronda.findByIdAndUpdate(
    id,
    { $push: { puntos: punto } },
    { new: true }
  );
  res.json(ronda);
});

// Finalizar ronda
router.post("/:id/finalizar", auth(["vigilante", "supervisor", "admin"]), async (req, res) => {
  const ronda = await Ronda.findByIdAndUpdate(req.params.id, { estado: "completada", fecha: new Date() }, { new: true });
  res.json(ronda);
});

// Listar rondas (supervisor)
router.get("/", auth(["supervisor", "admin"]), async (req, res) => {
  const rondas = await Ronda.find().sort({ createdAt: -1 }).limit(100);
  res.json(rondas);
});

export default router;