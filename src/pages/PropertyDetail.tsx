import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  WhatsappLogo,
  MapPin,
  X,
  CheckCircle,
  House,
  Users,
  CarSimple,
  Drop,
  WifiHigh,
  Wind,
  Bathtub,
  Bed,
  Tree,
  Lightning,
} from '@phosphor-icons/react';
import { properties } from '../data/properties';

const InteractiveMap = lazy(() => import('../components/InteractiveMap'));
import { useReveal } from '../hooks/useReveal';
import './PropertyDetail.css';

gsap.registerPlugin(ScrollTrigger);

// Simple icon map by keyword
function facilityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('ac'))       return <Wind size={15} weight="duotone" />;
  if (n.includes('wifi'))     return <WifiHigh size={15} weight="duotone" />;
  if (n.includes('km') || n.includes('mandi')) return <Bathtub size={15} weight="duotone" />;
  if (n.includes('kasur') || n.includes('kamar tidur')) return <Bed size={15} weight="duotone" />;
  if (n.includes('garasi') || n.includes('mobil')) return <CarSimple size={15} weight="duotone" />;
  if (n.includes('pdam') || n.includes('air')) return <Drop size={15} weight="duotone" />;
  if (n.includes('taman') || n.includes('pohon')) return <Tree size={15} weight="duotone" />;
  if (n.includes('listrik') || n.includes('token')) return <Lightning size={15} weight="duotone" />;
  if (n.includes('penghuni') || n.includes('keluarga')) return <Users size={15} weight="duotone" />;
  return <House size={15} weight="duotone" />;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useReveal();

  // Redirect if not found
  if (!property) return <Navigate to="/" replace />;

  /* GSAP hero parallax ───────────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.detail-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.fromTo(heroContentRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );

      // Gallery images: scale in on scroll
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((el, i) => {
        gsap.fromTo(el,
          { scale: 0.94, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
            },
            delay: i * 0.06,
          }
        );
      });
    });

    return () => ctx.revert();
  }, [property.id]);

  useEffect(() => {
    document.title = `${property.name} — Kos Nyaman Bukit Baru`;
  }, [property]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => i !== null ? (i + 1) % property.gallery.length : null);
      if (e.key === 'ArrowLeft')  setLightbox((i) => i !== null ? (i - 1 + property.gallery.length) % property.gallery.length : null);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [lightbox, property.gallery.length]);

  const waMessage = encodeURIComponent(
    `Halo, saya tertarik dengan ${property.name}. Apakah masih tersedia? Boleh saya survei?`
  );
  const waLink = `https://wa.me/6287899677415?text=${waMessage}`;

  const privateFacilities = property.facilities.filter((f) => f.type === 'private');
  const sharedFacilities  = property.facilities.filter((f) => f.type === 'shared');

  return (
    <>
      <main className="detail overflow-x-hidden">
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="detail-hero">
          <div ref={heroBgRef} className="detail-hero__bg">
            <img
              src={property.heroImage}
              alt={property.name}
              className="detail-hero__img"
              fetchPriority="high"
              width={1200}
              height={800}
              decoding="async"
            />
            <div className="detail-hero__vignette" />
          </div>

          <div ref={heroContentRef} className="container detail-hero__content">
            <Link to="/" className="detail-hero__back btn btn-ghost-dark">
              <ArrowLeft size={15} weight="bold" /> Kembali
            </Link>

            <span className={`badge detail-hero__badge detail-hero__badge--${property.status === 'available' ? 'green' : property.status === 'limited' ? 'amber' : 'red'}`}>
              {property.status === 'available' ? 'Tersedia' : property.status === 'limited' ? 'Hampir Penuh' : 'Sudah Disewa'}
            </span>

            <h1 className="display-headline detail-hero__name">{property.name}</h1>
            <p className="detail-hero__tagline">{property.tagline}</p>

            <div className="detail-hero__meta">
              <span className="detail-hero__meta-item">
                <MapPin size={14} weight="fill" /> {property.location}
              </span>
              <span className="detail-hero__price">
                {property.originalPriceLabel && (
                  <span className="detail-hero__price-old">{property.originalPriceLabel}</span>
                )}
                <span className="detail-hero__price-main">
                  {property.priceLabel}
                  <span>{property.pricePeriod}</span>
                  {property.originalPriceLabel && (
                    <span className="detail-hero__discount-badge">Diskon</span>
                  )}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────────────────── */}
        <section className="section-pad detail-gallery-section" id="galeri">
          <div className="container">
            <span className="eyebrow reveal">Galeri Foto</span>
            <h2 className="section-headline reveal" style={{ marginBottom: '1.75rem' }}>
              Lihat Foto Lengkapnya
            </h2>

            {/* 4-col masonry grid */}
            <div className="detail-gallery">
              {property.gallery.map((img, i) => (
                <button
                  key={img}
                  className={`gallery-item gallery-item--${i === 0 ? 'hero' : 'std'}`}
                  onClick={() => setLightbox(i)}
                  aria-label={`Buka foto ${i + 1}`}
                >
                  <img src={img} alt={`${property.name} foto ${i + 1}`} loading="lazy" decoding="async" width={800} height={600} />
                  <div className="gallery-item__overlay">
                    <span>Perbesar</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESCRIPTION + FACILITIES ─────────────────────────────────────── */}
        <section className="section-pad detail-info-section" id="info">
          <div className="container detail-info-grid">
            {/* Left – description */}
            <div className="detail-desc reveal">
              <span className="eyebrow">Tentang Properti</span>
              <h2 className="section-headline">{property.name}</h2>
              <div className="detail-desc__body body-lg" style={{ color: 'var(--text-secondary)' }}>
                {property.description.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Spec grid */}
              <div className="detail-specs">
                {property.specs?.map((spec) => (
                  <div key={spec.label} className="detail-spec-item">
                    <p className="detail-spec-val">{spec.value}</p>
                    <p className="detail-spec-label">{spec.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – facilities */}
            <div className="detail-fac reveal reveal-delay-2">
              {privateFacilities.length > 0 && (
                <div className="fac-group">
                  <h3 className="fac-group__title">Fasilitas Kamar / Dalam</h3>
                  <ul className="fac-list">
                    {privateFacilities.map((f) => (
                      <li key={f.name} className="fac-item">
                        <span className="fac-item__icon">{facilityIcon(f.name)}</span>
                        <span className="fac-item__name">{f.name}</span>
                        <CheckCircle size={14} weight="fill" className="fac-item__check" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sharedFacilities.length > 0 && (
                <div className="fac-group">
                  <h3 className="fac-group__title">Fasilitas Bersama / Umum</h3>
                  <ul className="fac-list">
                    {sharedFacilities.map((f) => (
                      <li key={f.name} className="fac-item">
                        <span className="fac-item__icon">{facilityIcon(f.name)}</span>
                        <span className="fac-item__name">{f.name}</span>
                        <CheckCircle size={14} weight="fill" className="fac-item__check" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability indicator */}
              <div className={`detail-avail detail-avail--${property.status}`}>
                <span className="detail-avail__dot" />
                <span className="detail-avail__text">
                  {property.status === 'available' 
                    ? 'Tersedia — bisa langsung booking' 
                    : property.status === 'limited' 
                    ? 'Hampir penuh — segera booking' 
                    : 'Sudah disewa — tidak tersedia'}
                </span>
              </div>

              {/* Inline CTA card */}
              <div className="detail-inline-cta">
                <p className="detail-inline-cta__title">
                  {property.status === 'rented' ? 'Sudah Disewa' : 'Tertarik?'}
                </p>
                <p className="detail-inline-cta__desc">
                  {property.status === 'rented' 
                    ? 'Properti ini sudah disewa untuk satu tahun. Hubungi kami untuk masuk daftar tunggu.' 
                    : 'Booking sekarang via WhatsApp langsung ke pemilik. Tanpa perantara.'}
                </p>
                {property.status === 'rented' ? (
                  <button className="btn btn-disabled detail-inline-cta__btn" disabled>
                    Currently Rented — Available 16/06/2027
                  </button>
                ) : (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary detail-inline-cta__btn"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    Booking via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAP ──────────────────────────────────────────────────────────── */}
        <section className="section-pad detail-map-section" id="peta">
          <div className="container">
            <span className="eyebrow reveal">Lokasi</span>
            <h2 className="section-headline reveal" style={{ marginBottom: '1.75rem' }}>
              Peta Lokasi
            </h2>
            <div className="reveal reveal-delay-2">
              <Suspense fallback={<div className="map-placeholder" style={{ height: '450px', background: 'var(--bg-surface)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Memuat peta...</div>}>
                <InteractiveMap />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Bottom spacer for sticky bar */}
        <div style={{ height: '90px' }} />
      </main>

      {/* ── STICKY CTA BAR ────────────────────────────────────────────────── */}
      <div className="sticky-cta">
        <div className="container sticky-cta__inner">
          <div className="sticky-cta__info">
            <p className="sticky-cta__name">{property.name}</p>
            <p className="sticky-cta__price">
              {property.originalPriceLabel && (
                <span className="sticky-cta__price-old">{property.originalPriceLabel}</span>
              )}
              {property.priceLabel}
              <span>{property.pricePeriod}</span>
            </p>
          </div>
          <div className="sticky-cta__actions">
            <a
              href={property.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline sticky-cta__maps-btn"
            >
              <MapPin size={15} weight="fill" /> Lihat di Maps
            </a>
            {property.status === 'rented' ? (
              <button className="btn btn-disabled sticky-cta__wa-btn" disabled>
                Currently Rented — Available 16/06/2027
              </button>
            ) : (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary sticky-cta__wa-btn"
              >
                <WhatsappLogo size={16} weight="fill" /> Booking via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto">
          <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Tutup galeri">
            <X size={20} weight="bold" />
          </button>

          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => setLightbox((i) => i !== null ? (i - 1 + property.gallery.length) % property.gallery.length : null)}
            aria-label="Foto sebelumnya"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>

          <div className="lightbox__img-wrap" onClick={() => setLightbox(null)}>
            <img
              src={property.gallery[lightbox]}
              alt={`${property.name} foto ${lightbox + 1}`}
              className="lightbox__img"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={() => setLightbox((i) => i !== null ? (i + 1) % property.gallery.length : null)}
            aria-label="Foto selanjutnya"
          >
            <ArrowRight size={18} weight="bold" />
          </button>

          <p className="lightbox__count">{lightbox + 1} / {property.gallery.length}</p>
        </div>
      )}
    </>
  );
}
