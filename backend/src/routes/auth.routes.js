import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  const user = await User.findOne({ usuario, activo: true });
  if (!user) return res.status(401).json({ error: "Credenciales" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciales" });
  const token = jwt.sign({ id: user._id, rol: user.rol, nombre: user.nombre }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, rol: user.rol, nombre: user.nombre });
});

// Semilla rápida (dev): crear usuario admin
router.post("/seed-admin", async (req, res) => {
  const { nombre = "Admin", cedula = "000", usuario = "admin", password = "admin123" } = req.body || {};
  const exists = await User.findOne({ usuario });
  if (exists) return res.json({ ok: true, msg: "Usuario ya existe" });
  const hash = await bcrypt.hash(password, 10);
  await User.create({ nombre, cedula, usuario, passwordHash: hash, rol: "admin" });
  res.json({ ok: true });
});

export default router;