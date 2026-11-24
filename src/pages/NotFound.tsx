import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react';
import { properties, propertyPath } from '../data/properties';
import { waLink } from '../data/site';
import { notFoundMeta, useSeo } from '../seo';
import './NotFound.css';

export default function NotFound() {
  const { pathname } = useLocation();
  const meta = useMemo(() => notFoundMeta(pathname), [pathname]);
  useSeo(meta);

  return (
    <main className="not-found">
      <div className="container not-found__inner">
        <span className="eyebrow">404</span>
        <h1 className="section-headline">Halaman tidak ditemukan</h1>
        <p className="body-lg not-found__sub">
          Halaman yang Anda cari mungkin sudah dipindahkan. Silakan lihat pilihan kost dan kontrakan kami:
        </p>
        <ul className="not-found__list">
          {properties.map((p) => (
            <li key={p.id}>
              <Link to={propertyPath(p)} className="not-found__link">
                <span>{p.name}</span>
                <span className="not-found__price">{p.priceLabel}{p.pricePeriod}</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="not-found__actions">
          <Link to="/" className="btn btn-primary">Ke Beranda</Link>
          <a href={waLink('Halo, saya ingin bertanya tentang properti yang tersedia.')} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <WhatsappLogo size={16} weight="fill" /> Tanya via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
