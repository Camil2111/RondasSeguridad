import { useEffect, useState } from 'react';

export default function GPSTag({ onLocation }) {
  const [pos, setPos] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (p) => { setPos(p.coords); onLocation?.(p.coords); },
      (e) => setErr(e.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (err) return <p className="text-red-600 text-sm">GPS: {err}</p>;
  if (!pos) return <p className="text-gray-500 text-sm">Obteniendo GPS…</p>;
  return <p className="text-xs text-gray-700">GPS OK: lat {pos.latitude.toFixed(6)}, lng {pos.longitude.toFixed(6)}</p>;
}