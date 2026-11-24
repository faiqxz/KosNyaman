import { properties, type Property } from '../data/properties';

export interface MapLocation {
  key: string;
  label: string;
  color: string;
  coords: [number, number];
  mapsUrl: string;
  address: string;
  title: string;
  items: Property[];
}

const KOST_COLOR = 'var(--accent)';
const KONTRAKAN_COLOR = '#4a7eb8';

/** Properties grouped by physical location (Tipe A & B share one building). */
export const MAP_LOCATIONS: MapLocation[] = Object.values(
  properties.reduce<Record<string, MapLocation>>((acc, p) => {
    const key = p.coords.join(',');
    if (!acc[key]) {
      acc[key] = {
        key,
        label: p.type === 'kost' ? 'K' : 'R',
        color: p.type === 'kost' ? KOST_COLOR : KONTRAKAN_COLOR,
        coords: p.coords,
        mapsUrl: p.mapsUrl,
        address: p.location,
        title: p.type === 'kost' ? 'Kost Nyaman 2' : p.name,
        items: [],
      };
    }
    acc[key].items.push(p);
    return acc;
  }, {}),
);
