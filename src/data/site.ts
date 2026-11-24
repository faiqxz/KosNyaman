/**
 * Site-wide business facts. Single source of truth for contact details,
 * the public URL, and the business address — used by the UI, the SEO tags,
 * the structured data (JSON-LD), sitemap.xml and llms.txt.
 *
 * If you move to a custom domain (e.g. kosnyaman.com), change SITE_URL only.
 */
export const SITE_URL = 'https://kos-nyaman.vercel.app';

export const BUSINESS = {
  name: 'Kos Nyaman Bukit Baru',
  shortName: 'Kos Nyaman',
  alternateNames: ['Kost Nyaman 2', 'Kos Nyaman Palembang'],
  tagline: 'Kost & kontrakan nyaman di Palembang',
  /** International format without "+" — used for wa.me links */
  waNumber: '6287899677415',
  /** E.164 format — used for tel: links and structured data */
  phoneE164: '+6287899677415',
  /** Human-friendly format shown on the page */
  phoneDisplay: '0878 9967 7415',
  address: {
    street: 'Jln Bukit Baru, Lorong Bukit Jaya, No Ujung',
    district: 'Ilir Barat I',
    city: 'Palembang',
    region: 'Sumatera Selatan',
    regionCode: 'ID-SS',
    country: 'ID',
  },
  coords: [-2.9836, 104.7349] as [number, number],
  mapsUrl: 'https://maps.app.goo.gl/7WT1v7Fidvf7xHrb9',
  nearby: [
    'Universitas Sriwijaya (UNSRI) Bukit Besar',
    'RS Permata Palembang',
    'Pusat kota Palembang',
    'Bandara Sultan Mahmud Badaruddin II (SMB II)',
  ],
} as const;

/** Build a WhatsApp click-to-chat link with a pre-filled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${BUSINESS.waNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "Rp1,4 Jt" style short price used in compact UI and titles. */
export function shortPrice(value: number): string {
  if (value >= 1_000_000) {
    const jt = value / 1_000_000;
    const label = Number.isInteger(jt) ? jt.toString() : jt.toFixed(1).replace('.', ',');
    return `Rp${label} jt`;
  }
  return `Rp${Math.round(value / 1_000)} rb`;
}
