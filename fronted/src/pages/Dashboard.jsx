import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Dashboard() {
  const [puntos, setPuntos] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    // nombre desde token guardado (lo teníamos en el login)
    try {
      const token = localStorage.getItem('token');
      const payload = token?.split('.')[1];
      if (payload) setNombre(JSON.parse(atob(payload)).nombre || '');
    } catch {}
    api.getPuntos().then(setPuntos).catch(()=>setPuntos([]));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Rondas de Seguridad</h2>
            <p className="text-sm text-slate-500 -mt-0.5">Hola{nombre ? `, ${nombre}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/ronda" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black transition">
              Iniciar Ronda
            </a>
            <button onClick={logout} className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h3 className="text-sm font-medium text-slate-500 mb-3">Puntos de control</h3>

        {!puntos.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No hay puntos de control aún.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {puntos.map(p => (
              <div key={p._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="font-semibold text-slate-900">{p.nombre}</div>
                <div className="text-xs text-slate-500 mt-1">lat {p.ubicacion.lat}, lng {p.ubicacion.lng}</div>
                <div className="text-xs text-slate-600 mt-2">
                  Tareas: {p.tareasAsignadas.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
