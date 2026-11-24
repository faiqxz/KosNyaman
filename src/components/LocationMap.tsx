import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { MAP_LOCATIONS } from './mapGroups';
import './InteractiveMap.css';

const InteractiveMap = lazy(() => import('./InteractiveMap'));

/**
 * Location legend (plain HTML, visible to search engines) plus the Leaflet map,
 * which is only downloaded once the user scrolls near it — saving ~45 KB of
 * JavaScript and the map tiles for visitors who never reach this section.
 */
export default function LocationMap() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const placeholder = <div className="imap__canvas map-placeholder">Memuat peta…</div>;

  return (
    <div className="imap">
      <ul className="imap__legend">
        {MAP_LOCATIONS.map((loc) => (
          <li key={loc.key}>
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="imap__legend-item"
              aria-label={`Buka ${loc.title} di Google Maps`}
            >
              <span className="imap__legend-dot" style={{ background: loc.color }} />
              <span className="imap__legend-info">
                <span className="imap__legend-name">{loc.title}</span>
                <span className="imap__legend-addr">{loc.address}</span>
                <span className="imap__legend-units">{loc.items.map((p) => p.name).join(' · ')}</span>
              </span>
              <span className="imap__legend-cta">
                Rute <ArrowUpRight size={13} weight="bold" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div ref={sentinel}>
        {showMap ? (
          <Suspense fallback={placeholder}>
            <InteractiveMap />
          </Suspense>
        ) : (
          placeholder
        )}
      </div>
    </div>
  );
}
