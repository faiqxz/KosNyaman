import { Link } from 'react-router-dom';
import { MapPin, WhatsappLogo, ArrowRight, Envelope } from '@phosphor-icons/react';
import { properties } from '../data/properties';
import Logo from '../assets/Kos Nyaman Logo.svg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Gold accent top line */}
      <div className="footer__accent" />

      <div className="container footer__grid">
        {/* Column 1 – Brand */}
        <div className="footer__col footer__brand-col">
          <div className="footer__brand">
            <div className="footer__logo" style={{ background: 'transparent' }}>
              <img src={Logo} alt="Kos Nyaman Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <p className="footer__brand-name">Kos Nyaman Bukit Baru</p>
              <p className="footer__brand-sub">Hunian terbaik di Palembang</p>
            </div>
          </div>
          <p className="footer__brand-desc">
            Kost dan kontrakan berkualitas di Palembang. Fasilitas lengkap, lokasi strategis, booking langsung ke pemilik.
          </p>
        </div>

        {/* Column 2 – Quick Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Properti Kami</h4>
          <ul className="footer__links">
            {properties.map((prop) => (
              <li key={prop.id}>
                <Link to={`/properti/${prop.id}`} className="footer__link">
                  <ArrowRight size={11} weight="bold" />
                  {prop.name}
                </Link>
              </li>
            ))}
            <li>
              <a href="#properti" className="footer__link">
                <ArrowRight size={11} weight="bold" />
                Semua Properti
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 – Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">Hubungi Kami</h4>
          <ul className="footer__links">
            <li>
              <a
                className="footer__link"
                href="https://wa.me/6287899677415"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo size={14} weight="fill" />
                0878 9967 7415
              </a>
            </li>
            <li>
              <span className="footer__link">
                <MapPin size={14} weight="fill" />
                Jln Bukit Baru, Lorong Bukit Jaya, Palembang
              </span>
            </li>
            <li>
              <span className="footer__link">
                <Envelope size={14} weight="fill" />
                @kosnyaman
              </span>
            </li>
          </ul>

          {/* CTA nudge */}
          <a
            href="https://wa.me/6287899677415?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20properti%20Kos%20Nyaman."
            target="_blank"
            rel="noopener noreferrer"
            className="footer__cta-nudge"
          >
            <WhatsappLogo size={15} weight="fill" />
            <span>Ada pertanyaan? Hubungi kami</span>
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Kos Nyaman Bukit Baru. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
