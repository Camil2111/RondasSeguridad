import { create } from 'zustand';
import { api } from '../api/client';

export const useAuth = create((set) => ({
  user: null,
  async login(usuario, password) {
    const data = await api.login(usuario, password);
    localStorage.setItem('token', data.token);
    set({ user: { nombre: data.nombre, rol: data.rol } });
  },
  logout() {
    localStorage.removeItem('token');
    set({ user: null });
  }
}));