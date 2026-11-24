/**
 * Descriptive alt text for gallery photos, keyed by image path.
 * Good alt text helps Google Images, AI search, and screen-reader users.
 * Photos without an entry fall back to "<property name> – foto N".
 */
export const IMAGE_ALTS: Record<string, string> = {
  // Kost Nyaman 2 (Tipe A + shared areas)
  '/images/kos-nyaman/1.webp': 'Kamar mandi dalam dengan kloset jongkok dan lantai keramik',
  '/images/kos-nyaman/2.webp': 'Kamar mandi dalam kost dengan dinding keramik',
  '/images/kos-nyaman/3.webp': 'Interior kamar kost: lemari pakaian, meja, dan pintu kamar mandi dalam',
  '/images/kos-nyaman/4.webp': 'Kamar kost ber-AC dengan kasur, meja, dan lemari',
  '/images/kos-nyaman/5.webp': 'Tampak depan deretan kamar kost dengan AC di tiap kamar',
  '/images/kos-nyaman/6.webp': 'Halaman dan area parkir mobil di lingkungan kost',
  '/images/kos-nyaman/7.webp': 'Area bersama yang teduh dengan pepohonan dan gazebo',
  '/images/kos-nyaman/8.webp': 'Bangunan Kost Nyaman 2 di Bukit Baru, Palembang, dikelilingi pepohonan',
  '/images/kos-nyaman/9.webp': 'Jalan masuk kost yang rindang',
  '/images/kos-nyaman/10.webp': 'Gazebo kayu dengan tempat duduk di area bersama kost',
  '/images/kos-nyaman/11.webp': 'Kamar kost dengan kasur, cermin, dan lantai keramik',
  '/images/kos-nyaman/12.webp': 'Pintu kamar mandi dalam di kamar kost',

  // Kost Nyaman 2 Tipe B (kamar depan)
  '/images/kos-nyaman/kamar-depan-1.webp': 'Tampak depan kamar Tipe B dengan teras dan kursi',
  '/images/kos-nyaman/kamar-depan-2.webp': 'Interior kamar dengan lemari laci dan pintu kamar mandi dalam',
  '/images/kos-nyaman/kamar-depan-3.webp': 'Kamar dengan kasur, meja kerja, kursi, dan jendela bergorden',
  '/images/kos-nyaman/kamar-depan-4.webp': 'Kamar ber-AC dengan kasur, meja, kursi, dan lemari',
  '/images/kos-nyaman/kamar-depan-5.webp': 'Pintu kamar mandi dalam dan cermin dinding',
  '/images/kos-nyaman/kamar-depan-6.webp': 'Kamar mandi dalam dengan kloset jongkok',
  '/images/kos-nyaman/kamar-depan-7.webp': 'Area bersama yang teduh dengan pepohonan dan gazebo',
  '/images/kos-nyaman/kamar-depan-8.webp': 'Bangunan kost dikelilingi pepohonan',
  '/images/kos-nyaman/kamar-depan-10.webp': 'Gazebo kayu dengan tempat duduk di area bersama kost',
  '/images/kos-nyaman/kamar-depan-11.webp': 'Halaman dan area parkir mobil di lingkungan kost',

  // Kontrakan Macan Putih
  '/images/macan-putih/13.webp': 'Tampak depan rumah Kontrakan Macan Putih dengan pagar dan carport',
  '/images/macan-putih/1.webp': 'Ruang tamu luas dengan lampu gantung',
  '/images/macan-putih/2.webp': 'Tampak samping rumah dan pagar dari jalan lorong',
  '/images/macan-putih/3.webp': 'Ruang keluarga dengan lemari kayu besar',
  '/images/macan-putih/4.webp': 'Kamar mandi dengan pemanas air (water heater)',
  '/images/macan-putih/5.webp': 'Area belakang rumah dengan tangga besi',
  '/images/macan-putih/6.webp': 'Dapur dengan kitchen set dan wastafel',
  '/images/macan-putih/7.webp': 'Kamar tidur dengan jendela',
  '/images/macan-putih/8.webp': 'Kamar tidur ber-AC dengan jendela teralis',
  '/images/macan-putih/9.webp': 'Kamar tidur ber-AC',
  '/images/macan-putih/10.webp': 'Kamar tidur ber-AC dengan dua jendela',
  '/images/macan-putih/11.webp': 'Ruang tengah dengan lemari pajangan kayu',
  '/images/macan-putih/12.webp': 'Garasi beratap untuk 2 mobil',
};

export function imageAlt(src: string, propertyName: string, index: number): string {
  const alt = IMAGE_ALTS[src];
  return alt ? `${alt} – ${propertyName}` : `${propertyName} – foto ${index + 1}`;
}
