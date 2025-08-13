import { useState } from 'react';
import { api } from '../api/client';

export default function Login() {
  const [usuario, setUsuario] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(usuario, password);
      localStorage.setItem('token', data.token);
      // redirige al dashboard
      window.location.href = '/';
    } catch (err) {
      console.error('LOGIN ERROR', err);
      setError(err.message || 'Error de login');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Ingresar</h1>
        <input className="border p-2 rounded w-full" value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="Usuario" />
        <input className="border p-2 rounded w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-black text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
