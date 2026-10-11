'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export interface IssFix {
  latitude: number; longitude: number; altitude: number;
  velocity: number; timestamp: number; visibility: string;
}
const issIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25)"></div>',
  iconSize: [14, 14], iconAnchor: [7, 7],
});
export default function IssMap({ fix }: { fix: IssFix | null }) {
  const [history, setHistory] = useState<Array<[number, number]>>([]);
  const lastTs = useRef<number>(0);
  useEffect(() => {
    if (!fix) return;
    if (fix.timestamp === lastTs.current) return;
    lastTs.current = fix.timestamp;
    setHistory(prev => [...prev, [fix.latitude, fix.longitude] as [number, number]].slice(-120));
  }, [fix]);
  const center = useMemo<[number, number]>(
    () => (fix ? [fix.latitude, fix.longitude] : [20, 0]),
    [fix?.latitude, fix?.longitude]
  );
  return (
    <MapContainer center={center} zoom={2} minZoom={1} worldCopyJump scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#0b0d10' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {history.length > 1 && (
        <Polyline positions={history} pathOptions={{ color: '#22c55e', weight: 1.5, opacity: 0.6 }} />
      )}
      {fix && (
        <>
          <Marker position={[fix.latitude, fix.longitude]} icon={issIcon}>
            <Popup>
              <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                <strong>ISS</strong><br />
                lat {fix.latitude.toFixed(4)}<br />
                lon {fix.longitude.toFixed(4)}<br />
                alt {fix.altitude.toFixed(1)} km<br />
                vel {fix.velocity.toFixed(0)} km/h<br />
              </div>
            </Popup>
          </Marker>
          <CircleMarker center={[fix.latitude, fix.longitude]} radius={28}
            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.08, weight: 1 }} />
        </>
      )}
    </MapContainer>
  );
}