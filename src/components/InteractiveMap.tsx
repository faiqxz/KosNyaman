import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowUpRight } from '@phosphor-icons/react';
import { properties } from '../data/properties';
import './InteractiveMap.css';

// Fix default marker icon paths for bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const pinIcon = (color: string, label: string) =>
  L.divIcon({
    className: '',
    html: `<div class="map-pin" style="--pin-color:${color}">
      <div class="map-pin__dot">${label}</div>
      <div class="map-pin__pulse"></div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  });

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-2.9738, 104.7402],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // CartoDB Light tile – matches cream palette
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    properties.forEach((prop, i) => {
      const label = i === 0 ? 'K' : 'M';
      const color = i === 0 ? 'var(--accent)' : '#4a7eb8';
      const marker = L.marker(prop.coords, { icon: pinIcon(color, label) }).addTo(map);

      marker.bindPopup(`
        <div class="map-popup">
          <p class="map-popup__type">${prop.type === 'kost' ? 'Kost' : 'Kontrakan'}</p>
          <h4 class="map-popup__name">${prop.name}</h4>
          <p class="map-popup__addr">${prop.location}</p>
          <p class="map-popup__price">${prop.priceLabel}<span>${prop.pricePeriod}</span></p>
          <div class="map-popup__actions">
            <a href="/properti/${prop.id}" class="map-popup__btn-detail">Lihat Detail</a>
            <a href="${prop.mapsUrl}" target="_blank" rel="noopener noreferrer" class="map-popup__btn-maps">Google Maps ↗</a>
          </div>
        </div>
      `, { maxWidth: 270, className: 'imap-popup-wrap' });
    });

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  return (
    <div className="imap">
      <div className="imap__legend">
        {properties.map((prop, i) => (
          <a
            key={prop.id}
            href={prop.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="imap__legend-item"
          >
            <span
              className="imap__legend-dot"
              style={{ background: i === 0 ? 'var(--accent)' : '#4a7eb8' }}
            />
            <div className="imap__legend-info">
              <p className="imap__legend-name">{prop.name}</p>
              <p className="imap__legend-addr">{prop.location}</p>
            </div>
            <ArrowUpRight size={14} className="imap__legend-icon" />
          </a>
        ))}
      </div>

      <div ref={mapRef} className="imap__canvas" />
    </div>
  );
}
