import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WhatsappLogo, List, X } from '@phosphor-icons/react';
import Logo from '../assets/logo.webp';
import { properties, propertyPath } from '../data/properties';
import { BUSINESS, waLink } from '../data/site';
import './Navbar.css';

const CONTACT_LINK = waLink('Halo, saya ingin bertanya tentang properti yang tersedia.');

// Desktop "Kost" link points at the first kost that still has rooms
const kostList = properties.filter((p) => p.type === 'kost');
const featuredKost = kostList.find((p) => p.status !== 'rented') ?? kostList[0];
const kontrakan = properties.find((p) => p.type === 'kontrakan');

const MOBILE_LINKS = [
  { to: '/', label: 'Beranda' },
  ...properties.map((p) => ({ to: propertyPath(p), label: p.name })),
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes (incl. back button)
  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 56);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll + allow Escape to close while the menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return () => { document.body.style.overflow = ''; };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isHero = location.pathname === '/';

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!isHero ? 'navbar--light' : ''} ${menuOpen ? 'navbar--menu-open' : ''}`}
        aria-label="Navigasi utama"
      >
        <div className="navbar__pill container">
          {/* Left: nav links */}
          <div className="navbar__links">
            <Link to="/" className="navbar__link">Beranda</Link>
            {featuredKost && <Link to={propertyPath(featuredKost)} className="navbar__link">Kost</Link>}
            {kontrakan && <Link to={propertyPath(kontrakan)} className="navbar__link">Kontrakan</Link>}
            <a href="/#faq" className="navbar__link">FAQ</a>
          </div>

          {/* Center: logo */}
          <Link to="/" className="navbar__brand" aria-label={`${BUSINESS.name} — Beranda`}>
            <div className="navbar__logo-box">
              <img src={Logo} alt="" width={44} height={32} />
            </div>
            <span className="navbar__brand-name">Kos Nyaman</span>
          </Link>

          {/* Right: CTA (icon-only on phones) */}
          <div className="navbar__right">
            <a
              href={CONTACT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__cta btn btn-primary"
              aria-label="Hubungi via WhatsApp"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span className="navbar__cta-label">Hubungi</span>
            </a>
          </div>

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="mobile-menu__nav" aria-label="Menu">
          {MOBILE_LINKS.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile-menu__link"
              style={{ '--i': i } as React.CSSProperties}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={CONTACT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mobile-menu__cta"
            style={{ '--i': MOBILE_LINKS.length } as React.CSSProperties}
          >
            <WhatsappLogo size={18} weight="fill" /> Booking via WhatsApp
          </a>
        </nav>
        <p className="mobile-menu__footer">{BUSINESS.name} — Palembang</p>
      </div>
    </>
  );
}
