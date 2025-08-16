import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistorialRondas = () => {
  const [rondas, setRondas] = useState([]);

  useEffect(() => {
    const fetchRondas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:4000/api/rondas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        setRondas(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error cargando las rondas:', error);
        setRondas([]);
      }
    };
  
    fetchRondas();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Rondas</h2>
      {rondas.length === 0 ? (
        <p>No hay rondas registradas aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Punto</th>
                <th className="px-4 py-2 border">Tareas</th>
                <th className="px-4 py-2 border">Observación</th>
              </tr>
            </thead>
            <tbody>
              {rondas.map((ronda) =>
                ronda.puntosVisitados?.map((punto, idx) => (
                  <tr key={`${ronda._id}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      {new Date(ronda.fechaInicio).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-2 border">{ronda.usuario}</td>
                    <td className="px-4 py-2 border">{punto.nombre}</td>
                    <td className="px-4 py-2 border">
                      {Array.isArray(punto.tareas) ? punto.tareas.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-2 border">
                      {punto.observaciones || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialRondas;

