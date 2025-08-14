import { useState } from 'react';
import { api } from '../api/client';

export default function Login() {
  const [usuario, setUsuario] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(usuario, password);
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError('Credenciales inválidas o API inaccesible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center">Rondas de Seguridad</h1>
        <p className="text-sm text-slate-500 text-center mt-1">Ingreso de vigilantes y supervisores</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Usuario</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="usuario"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Contraseña</label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl hover:bg-black transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-4">© {new Date().getFullYear()} Rondas</p>
      </div>
    </div>
  );
}
