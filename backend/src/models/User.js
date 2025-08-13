import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  usuario: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  rol: { type: String, enum: ["vigilante", "supervisor", "admin"], default: "vigilante" },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);