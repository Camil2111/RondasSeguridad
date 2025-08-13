import mongoose from "mongoose";

const PuntoControlSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  tareasAsignadas: [{ type: String, required: true }],
  activo: { type: Boolean, default: true }
}, { timestamps: true });

PuntoControlSchema.index({ "ubicacion": "2dsphere" });

export default mongoose.model("PuntoControl", PuntoControlSchema);