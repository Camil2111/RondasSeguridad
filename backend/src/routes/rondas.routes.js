import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { upload, publicUrl } from "../services/upload.js";
import Ronda from "../models/Ronda.js";
import Punto from "../models/PuntoControl.js";
import { haversineMeters } from "../utils/geo.js";

const router = Router();
const MAX_DIST_M = Number(process.env.MAX_DIST_M || 80); // tolerancia distancia

// Iniciar una ronda
router.post("/iniciar", auth(["vigilante","supervisor","admin"]), async (req, res, next) => {
  try {
    const ronda = await Ronda.create({ vigilanteId: req.user.id, estado: "en_proceso", puntos: [] });
    res.json(ronda);
  } catch (e) { next(e); }
});

// Agregar punto con evidencia
router.post("/:id/punto", auth(["vigilante","supervisor","admin"]), upload.single("foto"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { puntoId, lat, lng, tareas, observaciones } = req.body;

    const punto = await Punto.findById(puntoId);
    if (!punto) return res.status(400).json({ error: "Punto no existe" });

    const latN = Number(lat), lngN = Number(lng);
    const distancia = (isFinite(latN) && isFinite(lngN)) ? haversineMeters(latN, lngN, punto.ubicacion.lat, punto.ubicacion.lng) : null;
    const gpsConfirmado = distancia !== null && distancia <= MAX_DIST_M;

    const fotoUrl = req.file ? publicUrl(req.file.filename) : undefined;
    const tareasArr = tareas ? JSON.parse(tareas) : [];

    const update = {
      $push: {
        puntos: {
          puntoId,
          ubicacion: { lat: latN, lng: lngN },
          distanciaM: distancia,
          tareas: tareasArr,
          fotoUrl,
          gpsConfirmado,
          observaciones
        }
      }
    };

    const ronda = await Ronda.findByIdAndUpdate(id, update, { new: true });
    if (!ronda) return res.status(404).json({ error: "Ronda no encontrada" });
    res.json(ronda);
  } catch (e) { next(e); }
});

// Finalizar ronda
router.post("/:id/finalizar", auth(["vigilante","supervisor","admin"]), async (req, res, next) => {
  try {
    const ronda = await Ronda.findByIdAndUpdate(req.params.id, { estado: "completada", fecha: new Date() }, { new: true });
    if (!ronda) return res.status(404).json({ error: "Ronda no encontrada" });
    res.json(ronda);
  } catch (e) { next(e); }
});

export default router;
