import { useEffect } from 'react';
import { properties, propertyPath, type Property } from './data/properties';
import { FAQ_DATA } from './data/faq';
import { BUSINESS, SITE_URL, shortPrice, waLink } from './data/site';

/* ─────────────────────────────────────────────────────────────────────────────
   Per-page SEO metadata.
   - At build time, scripts/prerender.mjs writes these tags into the static HTML
     of every page (so Google, Bing, WhatsApp previews and AI crawlers that do
     not run JavaScript still see them).
   - In the browser, useSeo() keeps them in sync during client-side navigation.
   ───────────────────────────────────────────────────────────────────────────── */

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  coords: [number, number];
  noindex?: boolean;
  /** LCP image to preload for this page. */
  preloadImage?: string;
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_OG_IMAGE = '/og/home.jpg';
const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const absUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${encodeURI(path)}`);
const pageUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

const AVAILABILITY = {
  available: 'https://schema.org/InStock',
  limited: 'https://schema.org/LimitedAvailability',
  rented: 'https://schema.org/SoldOut',
} as const;

const STATUS_SHORT = {
  available: 'Tersedia',
  limited: 'Hampir penuh',
  rented: 'Sedang tersewa',
} as const;

const periodWord = (p: Property) => (p.pricePeriod.includes('tahun') ? 'tahun' : 'bulan');

/** Lowest monthly kost price, preferring rooms that are currently available. */
export function startingKostPrice(): number {
  const kost = properties.filter((p) => p.type === 'kost');
  const available = kost.filter((p) => p.status !== 'rented');
  const pool = available.length ? available : kost;
  return Math.min(...pool.map((p) => p.price));
}

/* ── JSON-LD building blocks ─────────────────────────────────────────────── */

function postalAddress(street: string) {
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: BUSINESS.address.city,
    addressRegion: BUSINESS.address.region,
    addressCountry: BUSINESS.address.country,
  };
}

function geo([latitude, longitude]: [number, number]) {
  return { '@type': 'GeoCoordinates', latitude, longitude };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: BUSINESS.name,
    inLanguage: 'id-ID',
    publisher: { '@id': BUSINESS_ID },
  };
}

function businessNode() {
  const sorted = [...properties].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  return {
    '@type': 'LodgingBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: [...BUSINESS.alternateNames],
    description:
      'Kost AC dengan kamar mandi dalam dan WiFi, serta rumah kontrakan luas di Palembang. ' +
      'Lokasi strategis dekat Universitas Sriwijaya (UNSRI) Bukit Besar. Booking langsung ke pemilik via WhatsApp, tanpa perantara.',
    url: `${SITE_URL}/`,
    logo: absUrl('/apple-touch-icon.png'),
    image: absUrl(DEFAULT_OG_IMAGE),
    telephone: BUSINESS.phoneE164,
    address: postalAddress(`${BUSINESS.address.street}, Kec. ${BUSINESS.address.district}`),
    geo: geo(BUSINESS.coords),
    hasMap: BUSINESS.mapsUrl,
    areaServed: { '@type': 'City', name: BUSINESS.address.city },
    priceRange: `${cheapest.priceLabel}${cheapest.pricePeriod} – ${priciest.priceLabel}${priciest.pricePeriod}`,
    currenciesAccepted: 'IDR',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phoneE164,
      contactType: 'reservations',
      availableLanguage: ['id'],
      url: waLink(),
    },
  };
}

function accommodationNode(p: Property) {
  const url = pageUrl(propertyPath(p));
  return {
    '@type': p.type === 'kost' ? 'Room' : 'House',
    '@id': `${url}#accommodation`,
    name: p.name,
    description: p.description.replace(/\n+/g, ' '),
    url,
    image: p.gallery.map(absUrl),
    address: postalAddress(p.location),
    geo: geo(p.coords),
    hasMap: p.mapsUrl,
    amenityFeature: p.facilities.map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f.name,
      value: true,
    })),
    additionalProperty: (p.specs ?? []).map((s) => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
    ...(p.bedrooms ? { numberOfBedrooms: p.bedrooms, numberOfRooms: p.bedrooms } : {}),
    ...(p.bathrooms ? { numberOfBathroomsTotal: p.bathrooms } : {}),
    ...(p.floorSizeM2
      ? { floorSize: { '@type': 'QuantitativeValue', value: p.floorSizeM2, unitCode: 'MTK' } }
      : {}),
    ...(p.type === 'kost' ? { containedInPlace: { '@id': BUSINESS_ID } } : {}),
    tourBookingPage: waLink(`Halo, saya ingin survei ${p.name}.`),
    ...(p.sameAs?.length ? { sameAs: p.sameAs } : {}),
  };
}

function offerNode(p: Property) {
  const url = pageUrl(propertyPath(p));
  const yearly = periodWord(p) === 'tahun';
  return {
    '@type': 'Offer',
    '@id': `${url}#offer`,
    url,
    name: `Sewa ${p.name}`,
    price: p.price,
    priceCurrency: 'IDR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: p.price,
      priceCurrency: 'IDR',
      unitCode: yearly ? 'ANN' : 'MON',
      unitText: periodWord(p),
    },
    availability: AVAILABILITY[p.status],
    businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
    itemOffered: { '@id': `${url}#accommodation` },
    offeredBy: { '@id': BUSINESS_ID },
  };
}

function faqNode() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    inLanguage: 'id-ID',
    mainEntity: FAQ_DATA.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/* ── Page metadata ───────────────────────────────────────────────────────── */

export function homeMeta(): PageMeta {
  const from = shortPrice(startingKostPrice());
  const title = 'Kost Dekat UNSRI Bukit Besar, Palembang — Kos Nyaman Bukit Baru';
  const description =
    `Kost AC dengan kamar mandi dalam & WiFi di Bukit Baru, Palembang, mulai ${from}/bulan — ` +
    '5–7 menit ke UNSRI Bukit Besar. Ada juga rumah kontrakan 5 kamar. Booking langsung ke pemilik via WhatsApp.';
  return {
    path: '/',
    title,
    description,
    image: DEFAULT_OG_IMAGE,
    imageAlt: 'Bangunan Kost Nyaman 2 di Bukit Baru, Palembang',
    coords: BUSINESS.coords,
    preloadImage: '/images/kos-nyaman/8.webp',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteNode(),
        businessNode(),
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: title,
          description,
          inLanguage: 'id-ID',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': BUSINESS_ID },
        },
        {
          '@type': 'ItemList',
          name: 'Pilihan kost dan kontrakan',
          itemListElement: properties.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: pageUrl(propertyPath(p)),
            name: p.name,
          })),
        },
        faqNode(),
      ],
    },
  };
}

export function propertyMeta(p: Property): PageMeta {
  const path = propertyPath(p);
  const url = pageUrl(path);
  const priceShort = `${shortPrice(p.price)}/${periodWord(p)}`;
  const title =
    p.type === 'kost'
      ? `${p.name}: Kost AC ${priceShort}, Bukit Baru Palembang`
      : `${p.name}: Rumah Kontrakan ${priceShort}, Palembang`;
  const description = `${p.priceLabel}${p.pricePeriod} · ${STATUS_SHORT[p.status]}. ${p.shortDescription} Lokasi: ${p.location}.`;
  return {
    path,
    title,
    description,
    image: p.ogImage ?? p.heroImage,
    imageAlt: `${p.name} — ${p.tagline}`,
    coords: p.coords,
    preloadImage: p.heroImage,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteNode(),
        businessNode(),
        accommodationNode(p),
        offerNode(p),
        {
          '@type': 'RealEstateListing',
          '@id': `${url}#webpage`,
          url,
          name: title,
          description,
          inLanguage: 'id-ID',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': `${url}#accommodation` },
          offers: { '@id': `${url}#offer` },
          primaryImageOfPage: { '@type': 'ImageObject', url: absUrl(p.heroImage) },
          breadcrumb: { '@id': `${url}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: p.name, item: url },
          ],
        },
      ],
    },
  };
}

export function notFoundMeta(path = '/404'): PageMeta {
  return {
    path,
    title: 'Halaman Tidak Ditemukan — Kos Nyaman Bukit Baru',
    description: 'Halaman yang Anda cari tidak ditemukan. Lihat pilihan kost dan kontrakan kami di Palembang.',
    image: DEFAULT_OG_IMAGE,
    imageAlt: BUSINESS.name,
    coords: BUSINESS.coords,
    noindex: true,
  };
}

export function metaForPath(pathname: string): PageMeta {
  if (pathname === '/' || pathname === '') return homeMeta();
  const match = pathname.match(/^\/properti\/([^/]+)\/?$/);
  const property = match && properties.find((p) => p.id === match[1]);
  return property ? propertyMeta(property) : notFoundMeta(pathname);
}

/* ── Rendering (build time) ──────────────────────────────────────────────── */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

const robotsContent = (meta: PageMeta) =>
  meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large';

/** HTML <head> tags for a page — injected by the prerender script. */
export function renderHeadTags(meta: PageMeta): string {
  const url = pageUrl(meta.path);
  const image = absUrl(meta.image);
  const [lat, lng] = meta.coords;
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${robotsContent(meta)}" />`,
    meta.noindex ? '' : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(BUSINESS.name)}" />`,
    `<meta property="og:locale" content="id_ID" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:alt" content="${esc(meta.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="geo.region" content="${BUSINESS.address.regionCode}" />`,
    `<meta name="geo.placename" content="${BUSINESS.address.city}" />`,
    `<meta name="geo.position" content="${lat};${lng}" />`,
    `<meta name="ICBM" content="${lat}, ${lng}" />`,
    meta.preloadImage
      ? `<link rel="preload" href="${esc(meta.preloadImage)}" as="image" fetchpriority="high" />`
      : '',
    meta.jsonLd
      ? `<script type="application/ld+json" id="ld-json">${jsonForScript(meta.jsonLd)}</script>`
      : '',
  ];
  return tags.filter(Boolean).join('\n    ');
}

/* ── Client-side sync ────────────────────────────────────────────────────── */

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const metaEl = (key: 'name' | 'property', name: string) => () => {
  const el = document.createElement('meta');
  el.setAttribute(key, name);
  return el;
};

/** Keeps <head> tags in sync with the current page during client-side navigation. */
export function useSeo(meta: PageMeta) {
  useEffect(() => {
    const url = pageUrl(meta.path);
    const image = absUrl(meta.image);
    document.title = meta.title;

    const metas: Array<['name' | 'property', string, string]> = [
      ['name', 'description', meta.description],
      ['name', 'robots', robotsContent(meta)],
      ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['property', 'og:image:alt', meta.imageAlt],
      ['name', 'twitter:title', meta.title],
      ['name', 'twitter:description', meta.description],
      ['name', 'twitter:image', image],
      ['name', 'geo.position', `${meta.coords[0]};${meta.coords[1]}`],
      ['name', 'ICBM', `${meta.coords[0]}, ${meta.coords[1]}`],
    ];
    for (const [key, name, value] of metas) {
      upsert(`meta[${key}="${name}"]`, metaEl(key, name), 'content', value);
    }

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (meta.noindex) {
      canonical?.remove();
    } else {
      upsert('link[rel="canonical"]', () => {
        const el = document.createElement('link');
        el.rel = 'canonical';
        return el;
      }, 'href', url);
    }

    const ld = document.getElementById('ld-json');
    if (meta.jsonLd) {
      const el = ld ?? Object.assign(document.createElement('script'), { type: 'application/ld+json', id: 'ld-json' });
      el.textContent = JSON.stringify(meta.jsonLd);
      if (!ld) document.head.appendChild(el);
    } else {
      ld?.remove();
    }
  }, [meta]);
}
