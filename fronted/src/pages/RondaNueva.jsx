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
  const [saving, setSaving] = useState(false);
  const { enqueuePunto, sync } = useOfflineQueue();

  useEffect(() => {
    (async () => {
      try {
        const r = await api.iniciarRonda();
        setRonda(r);
        const pts = await api.getPuntos();
        setPuntos(pts);
      } catch {
        setRonda({ _id: 'offline-temp' });
      }
    })();
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, []);

  const onCapture = (blob) => setFoto(blob);

  async function agregarPunto() {
    if (!puntoId) { alert('Selecciona un punto de control'); return; }
    setSaving(true);
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

    try {
      if (navigator.onLine && ronda?._id !== 'offline-temp') {
        const payload = { ...formPayload };
        if (foto) payload.foto = new File([foto], 'evidencia.jpg', { type: 'image/jpeg' });
        await api.agregarPuntoRonda(ronda._id, payload);
        alert('Punto registrado');
      } else {
        const payload = { ...formPayload };
        if (foto) payload.foto = new File([foto], `offline_${Date.now()}.jpg`, { type: 'image/jpeg' });
        await enqueuePunto(ronda._id, payload);
        alert('Guardado offline. Se sincronizará al volver la conexión.');
      }
      setFoto(null);
      setPuntoId('');
    } finally {
      setSaving(false);
    }
  }

  async function finalizar() {
    if (navigator.onLine && ronda?._id && ronda._id !== 'offline-temp') {
      await api.finalizarRonda(ronda._id);
      alert('Ronda finalizada');
      window.location.href = '/';
    } else {
      alert('Sin conexión: la ronda se marcará como finalizada al sincronizar.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Nueva Ronda</h1>
          <a href="/" className="text-sm text-slate-600 hover:underline">Volver</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs text-slate-600 mb-3">
            <GPSTag onLocation={setCoords} />
          </div>

          <label className="block text-sm text-slate-700">Punto de control</label>
          <select
            value={puntoId}
            onChange={e=>setPuntoId(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Seleccione…</option>
            {puntos.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
          </select>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
            {Object.entries(tareas).map(([k,v]) => (
              <div key={k} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="capitalize text-slate-700">{k}</span>
                <select
                  value={v}
                  onChange={e=>setTareas(t=>({...t,[k]:e.target.value}))}
                  className="border border-slate-300 rounded-lg px-2 py-1"
                >
                  <option>OK</option>
                  <option>NOVEDAD</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <CameraCapture onCapture={onCapture} />
            {foto && <p className="text-xs text-emerald-600 mt-1">Foto lista para enviar</p>}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={agregarPunto}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-black transition disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Agregar Punto'}
            </button>
            <button
              onClick={finalizar}
              className="border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100"
            >
              Finalizar Ronda
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
