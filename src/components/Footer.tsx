import { Phone, MapPin, WhatsappLogo } from '@phosphor-icons/react';
import Logo from '../assets/Kos Nyaman Logo.svg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo" style={{ background: 'transparent' }}>
            <img src={Logo} alt="Kos Nyaman Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <p className="footer__brand-name">Kos Nyaman Bukit Baru</p>
            <p className="footer__brand-sub">Hunian terbaik di Palembang</p>
          </div>
        </div>

        <div className="footer__contact">
          <a
            className="footer__contact-item"
            href="https://wa.me/6287899677415"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={14} weight="fill" />
            <span>0878 9967 7415</span>
          </a>
          <div className="footer__contact-item">
            <MapPin size={14} weight="fill" />
            <span>Jln Bukit Baru, Lorong Bukit Jaya, Palembang</span>
          </div>
          <div className="footer__contact-item">
            <Phone size={14} weight="fill" />
            <span>@kosnyaman</span>
          </div>
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
