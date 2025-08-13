import mongoose from "mongoose";


const TareaSchema = new mongoose.Schema({
  nombre: String,
  estado: { type: String, enum: ["OK", "NOVEDAD"], default: "OK" }
}, { _id: false });

const PuntoRondaSchema = new mongoose.Schema({
  puntoId: { type: mongoose.Schema.Types.ObjectId, ref: "PuntoControl", required: true },
  ubicacion: { lat: Number, lng: Number },
  tareas: [TareaSchema],
  fotoUrl: String,
  gpsConfirmado: { type: Boolean, default: false },
  observaciones: String,
  horaRegistro: { type: Date, default: Date.now }
}, { _id: false });

const RondaSchema = new mongoose.Schema({
  vigilanteId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ["en_proceso", "completada", "pendiente"], default: "en_proceso" },
  puntos: [PuntoRondaSchema]
}, { timestamps: true });

export default mongoose.model("Ronda", RondaSchema);