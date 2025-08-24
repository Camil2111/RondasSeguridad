import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  MapPin,
  ClipboardList,
  PlusCircle,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [controlPoints, setControlPoints] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) return navigate("/");

    setUser(storedUser);

    // Consumir puntos desde el backend
    fetch("http://localhost:4000/api/puntos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setControlPoints(data))
      .catch((err) => {
        console.error("Error al obtener puntos:", err);
        setControlPoints([]);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleStartRound = () => {
    navigate("/ronda");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 bg-white shadow border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={28} />
            Rondas de Seguridad
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenido, <strong>{user}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartRound}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} />
            Iniciar Ronda
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <ClipboardList size={20} />
          Puntos de control registrados
        </h2>

        {controlPoints.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aún no se han registrado puntos de control.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {controlPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5"
              >
                <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-1">
                  <MapPin size={18} className="text-blue-500" />
                  {point.nombre}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  lat: {point.ubicacion.lat}, lng: {point.ubicacion.lng}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-700">Tareas:</strong>{" "}
                  {point.tareasAsignadas.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;



