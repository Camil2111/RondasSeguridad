import { queueAdd, queueAll, queueClear } from '../storage/indexedDB';
import { api } from '../api/client';

export function useOfflineQueue() {
  async function enqueuePunto(rondaId, payload) {
    await queueAdd({ type: 'punto', rondaId, payload });
  }

  async function sync() {
    const items = await queueAll();
    for (const it of items) {
      if (it.type === 'punto') {
        try { await api.agregarPuntoRonda(it.rondaId, it.payload); } catch (e) { /* mantener en cola si falla */ }
      }
    }
    await queueClear();
  }

  return { enqueuePunto, sync };
}