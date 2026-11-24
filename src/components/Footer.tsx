import { Link } from 'react-router-dom';
import { MapPin, WhatsappLogo, ArrowRight, Envelope } from '@phosphor-icons/react';
import { properties, propertyPath } from '../data/properties';
import { BUSINESS, waLink } from '../data/site';
import Logo from '../assets/logo.webp';
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
              <img src={Logo} alt="" width={44} height={32} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <p className="footer__brand-name">Kos Nyaman Bukit Baru</p>
              <p className="footer__brand-sub">Hunian terbaik di Palembang</p>
            </div>
          </div>
          <p className="footer__brand-desc">
            Kost AC dengan kamar mandi dalam dan rumah kontrakan di Palembang, dekat UNSRI Bukit Besar.
            Fasilitas lengkap, booking langsung ke pemilik.
          </p>
        </div>

        {/* Column 2 – Quick Links */}
        <div className="footer__col">
          <h3 className="footer__col-title">Properti Kami</h3>
          <ul className="footer__links">
            {properties.map((prop) => (
              <li key={prop.id}>
                <Link to={propertyPath(prop)} className="footer__link">
                  <ArrowRight size={11} weight="bold" />
                  {prop.name}
                </Link>
              </li>
            ))}
            <li>
              <a href="/#properti" className="footer__link">
                <ArrowRight size={11} weight="bold" />
                Semua Properti
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 – Contact */}
        <div className="footer__col">
          <h3 className="footer__col-title">Hubungi Kami</h3>
          <address className="footer__address">
          <ul className="footer__links">
            <li>
              <a
                className="footer__link"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${BUSINESS.phoneDisplay}`}
              >
                <WhatsappLogo size={14} weight="fill" />
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                className="footer__link"
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={14} weight="fill" />
                Jln Bukit Baru, Lorong Bukit Jaya, Kec. {BUSINESS.address.district}, {BUSINESS.address.city}
              </a>
            </li>
            <li>
              <span className="footer__link">
                <Envelope size={14} weight="fill" />
                @kosnyaman
              </span>
            </li>
          </ul>
          </address>

          {/* CTA nudge */}
          <a
            href={waLink('Halo, saya ingin bertanya tentang properti Kos Nyaman.')}
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
          <p suppressHydrationWarning>© {new Date().getFullYear()} {BUSINESS.name}. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
