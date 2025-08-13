import { useEffect, useState } from 'react';
import { api } from '../api/client';
import CameraCapture from '../components/CameraCapture';
import GPSTag from '../components/GPSTag';
import { useOfflineQueue } from '../hooks/useOfflineQueue';

export default function RondaNueva() {
  const [ronda, setRonda] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [coords, setCoords] = useState(null);
  const [foto, setFoto] = useState(null);
  const [puntoId, setPuntoId] = useState('');
  const [tareas, setTareas] = useState({ puertas: 'OK', ventanas: 'OK', iluminacion: 'OK', perimetro: 'OK' });
  const { enqueuePunto, sync } = useOfflineQueue();

  useEffect(() => {
    (async () => {
      try {
        const r = await api.iniciarRonda();
        setRonda(r);
        const pts = await api.getPuntos();
        setPuntos(pts);
      } catch {
        // offline: permitir avanzar sin iniciar en backend
        setRonda({ _id: 'offline-temp' });
      }
    })();
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, []);

  const onCapture = (blob) => setFoto(blob);

  async function agregarPunto() {
    const formPayload = {
      puntoId,
      lat: coords?.latitude || 0,
      lng: coords?.longitude || 0,
      gpsConfirmado: Boolean(coords),
      observaciones: '',
      tareas: JSON.stringify([
        { nombre: 'Inspección de puertas', estado: tareas.puertas },
        { nombre: 'Inspección de ventanas', estado: tareas.ventanas },
        { nombre: 'Revisión de iluminación', estado: tareas.iluminacion },
        { nombre: 'Barreras perimetrales', estado: tareas.perimetro }
      ])
    };

    if (navigator.onLine && ronda?._id !== 'offline-temp') {
      const payload = { ...formPayload };
      if (foto) payload.foto = new File([foto], 'evidencia.jpg', { type: 'image/jpeg' });
      await api.agregarPuntoRonda(ronda._id, payload);
      alert('Punto registrado');
    } else {
      // guardar en cola offline
      const payload = { ...formPayload };
      if (foto) payload.foto = new File([foto], `offline_${Date.now()}.jpg`, { type: 'image/jpeg' });
      await enqueuePunto(ronda._id, payload);
      alert('Guardado offline. Se sincronizará al volver la conexión.');
    }

    setFoto(null);
    setPuntoId('');
  }

  async function finalizar() {
    if (navigator.onLine && ronda?._id && ronda._id !== 'offline-temp') {
      await api.finalizarRonda(ronda._id);
      alert('Ronda finalizada');
    } else {
      alert('Sin conexión: la ronda se marcará como finalizada al sincronizar.');
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-lg font-semibold mb-3">Nueva Ronda</h1>
      <GPSTag onLocation={setCoords} />

      <label className="block text-sm mt-3">Punto de control</label>
      <select value={puntoId} onChange={e=>setPuntoId(e.target.value)} className="border p-2 rounded w-full">
        <option value="">Seleccione…</option>
        {puntos.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        {Object.entries(tareas).map(([k,v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="capitalize">{k}</span>
            <select value={v} onChange={e=>setTareas(t=>({...t,[k]:e.target.value}))} className="border p-1 rounded">
              <option>OK</option>
              <option>NOVEDAD</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <CameraCapture onCapture={onCapture} />
        {foto && <p className="text-xs text-gray-600 mt-1">Foto lista para enviar</p>}
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={agregarPunto} className="bg-black text-white px-3 py-2 rounded">Agregar Punto</button>
        <button onClick={finalizar} className="border px-3 py-2 rounded">Finalizar Ronda</button>
      </div>
    </div>
  );
}