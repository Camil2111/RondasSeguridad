import { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) {
        alert('No se pudo acceder a la cámara');
      }
    })();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => onCapture(blob), 'image/jpeg', 0.9);
  };

  return (
    <div className="flex flex-col gap-2">
      <video ref={videoRef} autoPlay playsInline className="w-full rounded" />
      <button onClick={capture} className="px-3 py-2 bg-black text-white rounded">Tomar foto</button>
    </div>
  );
}