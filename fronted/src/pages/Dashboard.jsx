import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [puntos, setPuntos] = useState([]);

  useEffect(() => { api.getPuntos().then(setPuntos).catch(()=>setPuntos([])); }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Hola, {user?.nombre}</h2>
        <button onClick={logout} className="text-sm underline">Salir</button>
      </div>
      <a href="/ronda" className="inline-block bg-black text-white px-3 py-2 rounded">Iniciar Ronda</a>
      <div className="mt-4 grid gap-3">
        {puntos.map(p => (
          <div key={p._id} className="border p-3 rounded">
            <div className="font-medium">{p.nombre}</div>
            <div className="text-xs text-gray-600">lat {p.ubicacion.lat}, lng {p.ubicacion.lng}</div>
            <div className="text-xs text-gray-700">Tareas: {p.tareasAsignadas.join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}