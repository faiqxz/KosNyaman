import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, WifiHigh, Wind, Bathtub, Bed } from '@phosphor-icons/react';
import { type Property } from '../data/properties';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

function getFeatureIcon(feature: string) {
  if (feature.includes('AC')) return <Wind size={13} weight="duotone" />;
  if (feature.includes('WiFi')) return <WifiHigh size={13} weight="duotone" />;
  if (feature.includes('KM')) return <Bathtub size={13} weight="duotone" />;
  return <Bed size={13} weight="duotone" />;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const delayClass = `reveal-delay-${Math.min(index + 1, 4)}`;

  const quickFeatures =
    property.type === 'kost'
      ? ['AC', 'WiFi', 'KM Dalam', 'Kasur & Meja']
      : ['5 Kamar Tidur', 'Garasi 2 Mobil', 'PDAM 24 Jam', 'Bebas Banjir'];

  return (
    <article className={`prop-card reveal ${delayClass}`}>
      {/* Outer bezel (double-bezel pattern) */}
      <div className="prop-card__shell">
        {/* Inner image with zoom */}
        <div className="prop-card__img-wrap">
          <img
            src={property.heroImage}
            alt={property.name}
            className="prop-card__img"
            loading="lazy"
            width="800"
            height="500"
          />
          <div className="prop-card__img-overlay" />
          {property.badge && (
            <span className="badge prop-card__badge">{property.badge}</span>
          )}
          <span className="prop-card__type-chip">
            {property.type === 'kost' ? 'Kost' : 'Kontrakan'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="prop-card__body">
        <p className="prop-card__location">
          <MapPin size={12} weight="fill" />
          <span>{property.location}</span>
        </p>

        <h3 className="prop-card__name">{property.name}</h3>
        <p className="prop-card__desc">{property.shortDescription}</p>

        <ul className="prop-card__features">
          {quickFeatures.map((f) => (
            <li key={f} className="prop-card__feature">
              {getFeatureIcon(f)}
              {f}
            </li>
          ))}
        </ul>

        <div className="prop-card__rule" />

        <div className="prop-card__footer">
          <div className="prop-card__price">
            <span className="prop-card__price-val">{property.priceLabel}</span>
            <span className="prop-card__price-per">{property.pricePeriod}</span>
          </div>
          <Link to={`/properti/${property.id}`} className="prop-card__cta btn btn-primary">
            Lihat Detail <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </article>
  );
}
