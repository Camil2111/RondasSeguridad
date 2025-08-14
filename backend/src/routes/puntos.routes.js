import { Router } from "express";
import Punto from "../models/PuntoControl.js";
import { auth } from "../middlewares/auth.js";
import { body, validationResult } from "express-validator";

const router = Router();

router.get("/", auth(["vigilante","supervisor","admin"]), async (_req, res) => {
  const puntos = await Punto.find({ activo: true }).sort({ createdAt: -1 });
  res.json(puntos);
});

router.post("/",
  auth(["supervisor","admin"]),
  body("nombre").isString().trim().notEmpty(),
  body("ubicacion.lat").isFloat({ min: -90, max: 90 }),
  body("ubicacion.lng").isFloat({ min: -180, max: 180 }),
  body("tareasAsignadas").isArray({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: "Datos inválidos", details: errors.array() });
    return Punto.create(req.body).then(p=>res.json(p));
  }
);

export default router;
