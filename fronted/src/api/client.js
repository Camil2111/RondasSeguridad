const API_URL = 'http://localhost:4000/api';

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async login(usuario, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  },

  async getPuntos() {
    const res = await fetch(`${API_URL}/puntos`, { headers: { ...authHeader() } });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  },

  async iniciarRonda() {
    const res = await fetch(`${API_URL}/rondas/iniciar`, {
      method: 'POST',
      headers: { ...authHeader() }
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  },

  async agregarPuntoRonda(rondaId, data) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    const res = await fetch(`${API_URL}/rondas/${rondaId}/punto`, {
      method: 'POST',
      headers: { ...authHeader() }, // no pongas Content-Type con FormData
      body: form
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  },

  async finalizarRonda(id) {
    const res = await fetch(`${API_URL}/rondas/${id}/finalizar`, {
      method: 'POST',
      headers: { ...authHeader() }
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return JSON.parse(text);
  }
};