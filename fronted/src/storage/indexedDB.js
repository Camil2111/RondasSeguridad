import { openDB } from 'idb';

const DB_NAME = 'rondas_offline';
const STORE = 'queue';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    }
  });
}

export async function queueAdd(item) {
  const db = await getDB();
  return db.add(STORE, { ...item, createdAt: Date.now() });
}

export async function queueAll() {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function queueClear() {
  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  await tx.store.clear();
  await tx.done;
}