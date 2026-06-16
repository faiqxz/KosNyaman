import { useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  WhatsappLogo,
  CheckCircle,
  Lightning,
  ShieldCheck,
  MapPin,
  Star,
} from '@phosphor-icons/react';
import { useReveal } from '../hooks/useReveal';
import PropertyCard from '../components/PropertyCard';

const InteractiveMap = lazy(() => import('../components/InteractiveMap'));
const FaqAccordion = lazy(() => import('../components/FaqAccordion'));
import { properties } from '../data/properties';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Marquee items (facilities / USPs) ─────────────────────────────────────── */
const MARQUEE_ITEMS = [
  'Kamar AC', 'WiFi Cepat', 'PDAM 24 Jam', 'Keamanan Malam',
  'Parkiran Luas', 'Lokasi Strategis', 'Dekat Universitas', 'Bebas Banjir',
  'Garasi Mobil', 'Booking Langsung', 'Tanpa Perantara', 'Fasilitas Lengkap',
];

export default function Home() {
  useReveal();

  const heroRef    = useRef<HTMLElement>(null);
  const heroBgRef  = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  /* GSAP parallax + hero entry ───────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax (scale + translate) – only transform/opacity
      gsap.to(heroBgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Hero text parallax (slightly faster than bg)
      gsap.to(heroTextRef.current, {
        yPercent: 14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Stats counter fade-in stagger
      gsap.fromTo(
        '.hero__stat',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      // Property card GSAP image scale on scroll entry
      gsap.utils.toArray<HTMLElement>('.prop-card').forEach((card) => {
        const img = card.querySelector<HTMLElement>('.prop-card__img');
        if (!img) return;
        gsap.fromTo(img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* Page title ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    document.title = 'Kos Nyaman Bukit Baru — Hunian Nyaman di Palembang';
  }, []);

  const waLink = `https://wa.me/6287899677415?text=${encodeURIComponent(
    'Halo, saya tertarik dengan properti Kos Nyaman Bukit Baru. Apakah masih tersedia?'
  )}`;

  return (
    <main className="home overflow-x-hidden">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="hero" id="hero">
        {/* Parallax background image */}
        <div ref={heroBgRef} className="hero__bg">
          <img
            src="/images/kos-nyaman/7.webp"
            alt="Kos Nyaman Bukit Baru — tampak luar"
            className="hero__bg-img"
            fetchPriority="high"
            width={1200}
            height={800}
            decoding="async"
          />
          <div className="hero__bg-vignette" />
        </div>

        {/* 4-quadrant grid overlay */}
        <div ref={heroTextRef} className="hero__grid container">
          {/* ── TOP LEFT: Caption / eyebrow ── */}
          <div className="hero__top-left">
            <span className="hero__caption">
              // Kos & Kontrakan di Palembang
            </span>
          </div>

          {/* ── TOP RIGHT: System label ── */}
          <div className="hero__top-right">
            <span className="hero__caption">
              Properti Pilihan
            </span>
          </div>

          {/* ── BOTTOM LEFT: Massive headline ── */}
          <div className="hero__bottom-left">
            <h1 className="hero__headline display-headline">
              Hunian Nyaman<br />
              di Bukit Baru.
            </h1>
          </div>

          {/* ── BOTTOM RIGHT: Description + CTA + Trust ── */}
          <div className="hero__bottom-right">
            <p className="hero__sub">
              Kost harian siap huni dan rumah kontrakan luas — fasilitas lengkap,
              lokasi strategis, booking langsung ke pemilik tanpa perantara.
            </p>

            {/* CTAs */}
            <div className="hero__actions">
              <a href="#properti" className="btn btn-primary hero__btn-main">
                Lihat Properti
                <span className="hero__btn-icon"><ArrowRight size={15} weight="bold" /></span>
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                <WhatsappLogo size={16} weight="fill" /> Booking Sekarang
              </a>
            </div>

            {/* Trust signals */}
            <ul className="hero__trust">
              {['Tanpa perantara', 'Fasilitas AC & WiFi', 'Bebas banjir'].map((t) => (
                <li key={t} className="hero__trust-item">
                  <CheckCircle size={13} weight="fill" /> {t}
                </li>
              ))}
              <li className="hero__trust-item hero__trust-item--available">
                <span className="hero__avail-dot" />
                Kamar masih tersedia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div ref={statsRef} className="hero__stats-bar">
          <div className="hero__stats-bar-inner container">
            {[
              { val: properties.filter(p => p.status !== 'rented').length.toString(), label: 'Properti Tersedia' },
              { val: 'Rp1,3 Jt', label: 'Mulai dari /bulan' },
              { val: '24/7', label: 'Keamanan & Akses' },
            ].map((s) => (
              <div key={s.label} className="hero__stat">
                <p className="hero__stat-val">{s.val}</p>
                <p className="hero__stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US — asymmetric split layout ────────────────────────────────── */}
      <section className="why-section section-pad" id="kenapa-kami">
        <div className="container why-section__grid">
          {/* Left – editorial text block */}
          <div className="why-section__left">
            <span className="eyebrow reveal">Kenapa Pilih Kami?</span>
            <h2 className="section-headline why-section__headline reveal">
              Tempat tinggal bukan sekadar ruangan —<br />ini tentang kenyamanan.
            </h2>
            <p className="body-lg why-section__sub reveal reveal-delay-1" style={{ color: 'var(--text-secondary)' }}>
              Kami percaya setiap penghuni berhak mendapat hunian yang terasa seperti rumah.
              Fasilitas lengkap, lingkungan aman, dan komunikasi langsung ke pemilik.
            </p>
            <a href="#properti" className="btn btn-primary reveal reveal-delay-2" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
              Lihat Properti <ArrowRight size={15} weight="bold" />
            </a>
          </div>

          {/* Right – benefit cards, zig-zag not symmetric 3-col */}
          <div className="why-section__right">
            {[
              {
                icon: <Lightning size={20} weight="duotone" />,
                title: 'Booking Langsung ke Pemilik',
                desc: 'Tidak ada perantara. Hubungi via WhatsApp — respons cepat, harga transparan.',
                delay: '',
              },
              {
                icon: <ShieldCheck size={20} weight="duotone" />,
                title: 'Aman & Terpercaya',
                desc: 'Keamanan malam, one gate system, dan lingkungan tenang untuk keluarga maupun mahasiswa.',
                delay: 'reveal-delay-1',
              },
              {
                icon: <MapPin size={20} weight="duotone" />,
                title: 'Lokasi Strategis',
                desc: 'Dekat universitas, sekolah, rumah sakit, pasar, bandara, dan pusat kota Palembang.',
                delay: 'reveal-delay-2',
              },
            ].map((item) => (
              <div key={item.title} className={`why-card reveal ${item.delay}`}>
                <div className="why-card__icon">{item.icon}</div>
                <div>
                  <h3 className="why-card__title">{item.title}</h3>
                  <p className="why-card__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KINETIC MARQUEE ────────────────────────────────────────────────── */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="marquee-item">
                <Star size={11} weight="fill" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTIES ──────────────────────────────────────────────────────── */}
      <section className="props-section section-pad" id="properti">
        <div className="container">
          <div className="props-section__header reveal">
            <span className="eyebrow">Pilihan Properti</span>
            <h2 className="section-headline">
              Pilih Hunian yang<br />Sesuai Kebutuhanmu
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-secondary)' }}>
              Kost siap huni untuk mahasiswa & karyawan, atau rumah kontrakan luas untuk keluarga.
            </p>
          </div>

          {/* 2-column asymmetric grid – bans the generic 3-equal-column layout */}
          <div className="props-grid">
            {properties.map((prop, i) => (
              <PropertyCard key={prop.id} property={prop} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="testimonials-section section-pad" id="testimonials">
        <div className="container">
          <div className="testimonials-section__header reveal">
            <span className="eyebrow">Kata Penghuni</span>
            <h2 className="section-headline">
              Cerita dari Mereka<br />yang Sudah Tinggal
            </h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                stars: 5,
                quote: 'Kamarnya bersih, AC dingin, WiFi kencang. Sangat cocok untuk mahasiswa yang butuh tempat tinggal nyaman.',
                name: 'Rina',
                role: 'Mahasiswa UNSRI',
              },
              {
                stars: 5,
                quote: 'Lokasinya strategis, dekat kampus dan pasar. Pemiliknya ramah dan responsif kalau ada kendala.',
                name: 'Andi',
                role: 'Karyawan Swasta',
              },
              {
                stars: 5,
                quote: 'Sudah 2 tahun tinggal di sini. Lingkungannya aman dan tenang, parkiran luas.',
                name: 'Budi',
                role: 'Mahasiswa Polsri',
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className={`testimonial-card reveal reveal-delay-${i + 1}`}
              >
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} weight="fill" />
                  ))}
                </div>
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__reviewer">
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="testimonials-section__summary reveal reveal-delay-4">
            Rata-rata Rating <Star size={13} weight="fill" /> <strong>4.8 / 5.0</strong>
          </p>
        </div>
      </section>

      {/* ── LOCATION MAP ────────────────────────────────────────────────────── */}
      <section className="map-section section-pad" id="lokasi">
        <div className="container map-section__inner">
          <div className="map-section__header reveal">
            <span className="eyebrow">Peta Lokasi</span>
            <h2 className="section-headline">
              Lokasi Mudah<br />Dijangkau
            </h2>
            <p className="body-lg" style={{ color: 'var(--text-secondary)' }}>
              Kedua properti berada di lokasi strategis Palembang — dekat kampus, rumah sakit, dan pusat kota.
            </p>
          </div>

          <div className="reveal reveal-delay-2">
            <Suspense fallback={<div className="map-placeholder" style={{ height: '450px', background: 'var(--bg-surface)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Memuat peta...</div>}>
              <InteractiveMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <FaqAccordion />
      </Suspense>

      {/* ── BOOKING CTA ─────────────────────────────────────────────────────── */}
      <section className="cta-section" id="booking">
        <div className="cta-section__bg">
          <img
            src="/images/macan-putih/12.webp"
            alt="Kontrakan Macan Putih"
            className="cta-section__bg-img"
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
          />
          <div className="cta-section__bg-overlay" />
        </div>

        <div className="container cta-section__content">
          <div className="reveal">
            <span className="eyebrow">Hubungi Kami</span>
            <h2 className="display-headline cta-section__headline">
              Tertarik Sewa<br />atau Survei Lokasi?
            </h2>
            <p className="body-lg cta-section__sub">
              Hubungi pemilik langsung untuk menanyakan ketersediaan kamar, jadwal survei,
              atau informasi sewa kontrakan.
            </p>
          </div>

          <div className="reveal reveal-delay-2 cta-section__actions">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary cta-section__wa-btn"
            >
              <WhatsappLogo size={20} weight="fill" />
              Booking via WhatsApp
            </a>
            <p className="cta-section__note">Nomor: <strong>0878 9967 7415</strong></p>
          </div>

          {/* Property quick-links */}
          <div className="reveal reveal-delay-3 cta-section__links">
            {properties.map((prop) => (
              <Link key={prop.id} to={`/properti/${prop.id}`} className="cta-prop-link glass-dark">
                <div className="cta-prop-link__img">
                  <img src={prop.heroImage} alt={prop.name} loading="lazy" />
                </div>
                <div className="cta-prop-link__info">
                  <p className="cta-prop-link__name">{prop.name}</p>
                  <p className="cta-prop-link__price">
                    {prop.priceLabel}<span>{prop.pricePeriod}</span>
                  </p>
                </div>
                <ArrowRight size={15} className="cta-prop-link__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
