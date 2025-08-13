import { Router } from "express";
import PuntoControl from "../models/PuntoControl.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth(["vigilante", "supervisor", "admin"]), async (req, res) => {
  const puntos = await PuntoControl.find({ activo: true }).sort({ createdAt: -1 });
  res.json(puntos);
});

router.post("/", auth(["admin", "supervisor"]), async (req, res) => {
  const punto = await PuntoControl.create(req.body);
  res.json(punto);
});

export default router;