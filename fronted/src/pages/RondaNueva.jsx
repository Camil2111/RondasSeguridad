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
  const [tareas, setTareas] = useState({
    puertas: 'OK',
    ventanas: 'OK',
    iluminacion: 'OK',
    perimetro: 'OK',
  });
  const [observaciones, setObservaciones] = useState('');
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

  const onCapture = (blob) => {
    setFoto(blob);
  };

  const hayNovedades = Object.values(tareas).includes('NOVEDAD');

  async function agregarPunto() {
    if (!puntoId) return alert('Selecciona un punto de control');
    if (hayNovedades && observaciones.trim() === '') {
      return alert('Debes escribir una observación para las novedades.');
    }

    setSaving(true);

    const formPayload = {
      puntoId,
      lat: coords?.latitude || 0,
      lng: coords?.longitude || 0,
      gpsConfirmado: Boolean(coords),
      observaciones,
      tareas: JSON.stringify([
        { nombre: 'Inspección de puertas', estado: tareas.puertas },
        { nombre: 'Inspección de ventanas', estado: tareas.ventanas },
        { nombre: 'Revisión de iluminación', estado: tareas.iluminacion },
        { nombre: 'Barreras perimetrales', estado: tareas.perimetro }
      ])
    };

    try {
      const payload = { ...formPayload };

      if (foto) {
        payload.foto = new File([foto], `evidencia_${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
      }

      if (navigator.onLine && ronda?._id !== 'offline-temp') {
        await api.agregarPuntoRonda(ronda._id, payload);
        alert('Punto registrado correctamente');
      } else {
        await enqueuePunto(ronda._id, payload);
        alert('Guardado offline. Se sincronizará cuando vuelva la conexión.');
      }

      setFoto(null);
      setPuntoId('');
      setObservaciones('');
      setTareas({
        puertas: 'OK',
        ventanas: 'OK',
        iluminacion: 'OK',
        perimetro: 'OK',
      });

    } finally {
      setSaving(false);
    }
  }

  async function finalizar() {
    if (navigator.onLine && ronda?._id && ronda._id !== 'offline-temp') {
      await api.finalizarRonda(ronda._id);
      alert('Ronda finalizada correctamente');
      window.location.href = '/';
    } else {
      alert('Sin conexión: la ronda se finalizará al sincronizar.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Nueva Ronda de Vigilancia</h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">
            Volver
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          
          <GPSTag onLocation={setCoords} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Punto de control
            </label>
            <select
              value={puntoId}
              onChange={(e) => setPuntoId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Seleccione…</option>
              {puntos.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-sm font-medium text-slate-800 mb-2">Tareas del punto</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(tareas).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <span className="capitalize text-slate-700">{k}</span>
                  <select
                    value={v}
                    onChange={(e) => setTareas(t => ({ ...t, [k]: e.target.value }))}
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="OK">OK</option>
                    <option value="NOVEDAD">NOVEDAD</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {hayNovedades && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones de la novedad</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full border border-red-400 bg-red-50 text-red-800 rounded-lg px-3 py-2"
                placeholder="Describa la novedad detectada..."
                rows={3}
              />
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium text-slate-800 mb-1">Evidencia fotográfica</h2>
            <CameraCapture onCapture={onCapture} />
            {foto && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(foto)}
                  alt="Foto capturada"
                  className="w-32 rounded-lg border border-slate-300"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={agregarPunto}
              disabled={saving}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-black transition disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Agregar Punto'}
            </button>
            <button
              onClick={finalizar}
              className="border border-slate-300 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-100"
            >
              Finalizar Ronda
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

