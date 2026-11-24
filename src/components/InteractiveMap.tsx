import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { propertyPath } from '../data/properties';
import { MAP_LOCATIONS } from './mapGroups';

const pinIcon = (color: string, label: string) =>
  L.divIcon({
    className: '',
    html: `<div class="map-pin" style="--pin-color:${color}">
      <div class="map-pin__dot" data-label="${label}"></div>
      <div class="map-pin__pulse"></div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  });

/** Leaflet map canvas. Browser-only; loaded lazily by LocationMap. */
export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      // On phones, one-finger drag would trap the page scroll inside the map.
      // Pinch with two fingers still zooms and pans.
      dragging: !L.Browser.mobile,
    });

    mapInstanceRef.current = map;

    // CartoDB Light tile – matches cream palette
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    MAP_LOCATIONS.forEach((loc) => {
      const marker = L.marker(loc.coords, { icon: pinIcon(loc.color, loc.label), title: loc.title }).addTo(map);
      const units = loc.items
        .map(
          (p) => `<a href="${propertyPath(p)}" class="map-popup__unit">
            <span class="map-popup__unit-name">${p.name}${p.status === 'rented' ? ' <em>(tersewa)</em>' : ''}</span>
            <span class="map-popup__price">${p.priceLabel}<span>${p.pricePeriod}</span></span>
          </a>`,
        )
        .join('');
      marker.bindPopup(
        `<div class="map-popup">
          <p class="map-popup__type">${loc.items[0].type === 'kost' ? 'Kost' : 'Kontrakan'}</p>
          <h4 class="map-popup__name">${loc.title}</h4>
          <p class="map-popup__addr">${loc.address}</p>
          <div class="map-popup__units">${units}</div>
          <div class="map-popup__actions">
            <a href="${loc.mapsUrl}" target="_blank" rel="noopener noreferrer" class="map-popup__btn-maps">Rute di Google Maps ↗</a>
          </div>
        </div>`,
        { maxWidth: 270, className: 'imap-popup-wrap' },
      );
    });

    map.fitBounds(L.latLngBounds(MAP_LOCATIONS.map((l) => l.coords)), { padding: [48, 48], maxZoom: 15 });

    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  return <div ref={mapRef} className="imap__canvas" role="region" aria-label="Peta lokasi properti" />;
}
