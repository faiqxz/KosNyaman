import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WhatsappLogo, List, X } from '@phosphor-icons/react';
import Logo from '../assets/logo.webp';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 56);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isHero = location.pathname === '/';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!isHero ? 'navbar--light' : ''}`}>
        <div className="navbar__pill container">
          {/* Left: nav links */}
          <div className="navbar__links">
            <Link to="/" className="navbar__link">Beranda</Link>
            <Link to="/properti/kos-nyaman-bukit-baru" className="navbar__link">Kost</Link>
            <Link to="/properti/kontrakan-macan-putih" className="navbar__link">Kontrakan</Link>
          </div>

          {/* Center: logo */}
          <Link to="/" className="navbar__brand">
            <div className="navbar__logo-box">
              <img src={Logo} alt="Kos Nyaman Logo" />
            </div>
            <span className="navbar__brand-name">Kos Nyaman</span>
          </Link>

          {/* Right: CTA */}
          <div className="navbar__right">
            <a
              href="https://wa.me/6287899677415?text=Halo%2C+saya+ingin+bertanya+tentang+properti+yang+tersedia."
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__cta btn btn-primary"
            >
              <WhatsappLogo size={16} weight="fill" />
              Hubungi
            </a>
          </div>

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__nav">
          {[
            { to: '/', label: 'Beranda' },
            { to: '/properti/kos-nyaman-bukit-baru', label: 'Kost Nyaman Tipe A' },
            { to: '/properti/kontrakan-macan-putih', label: 'Kontrakan Macan Putih' },
          ].map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className="mobile-menu__link"
              style={{ '--i': i } as React.CSSProperties}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://wa.me/6287899677415?text=Halo%2C+saya+ingin+bertanya+tentang+properti+yang+tersedia."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mobile-menu__cta"
            style={{ '--i': 3 } as React.CSSProperties}
          >
            <WhatsappLogo size={18} weight="fill" /> Booking via WhatsApp
          </a>
        </nav>
        <p className="mobile-menu__footer">Kos Nyaman Bukit Baru — Palembang</p>
      </div>
    </>
  );
}
