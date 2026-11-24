import { properties } from './properties';
import { BUSINESS } from './site';

export interface FaqItem {
  q: string;
  a: string;
}

const statusLabel = {
  available: 'tersedia',
  limited: 'hampir penuh',
  rented: 'sedang tersewa',
} as const;

// Generated from the property data so prices/availability never go stale.
const priceAnswer = properties
  .map((p) => `${p.name}: ${p.priceLabel}${p.pricePeriod} (${statusLabel[p.status]})`)
  .join('; ');

/**
 * FAQ shown on the home page and published as FAQPage structured data.
 * Answers are written as complete, factual sentences so search engines and
 * AI assistants can quote them directly.
 */
export const FAQ_DATA: FaqItem[] = [
  {
    q: 'Berapa harga sewa kost dan kontrakan di Kos Nyaman?',
    a: `${priceAnswer}. Harga bisa dikonfirmasi langsung ke pemilik via WhatsApp.`,
  },
  {
    q: 'Di mana alamat Kos Nyaman Bukit Baru?',
    a: `Kost Nyaman 2 berada di ${BUSINESS.address.street}, Kecamatan ${BUSINESS.address.district}, ${BUSINESS.address.city}. Kontrakan Macan Putih berada di Jl. Parameswara Lr. Macan Putih No. 88, Palembang, sekitar 50 meter dari Jalan Raya Parameswara.`,
  },
  {
    q: 'Berapa jarak ke Universitas Sriwijaya?',
    a: 'Baik Kost Nyaman maupun Kontrakan Macan Putih berjarak sangat dekat, hanya sekitar 5–7 menit ke kampus UNSRI Bukit Besar.',
  },
  {
    q: 'Apakah bisa survei lokasi terlebih dahulu?',
    a: 'Tentu saja! Kami sangat menyarankan survei lokasi sebelum booking. Silakan hubungi kami via WhatsApp untuk menjadwalkan kunjungan di waktu yang nyaman bagi Anda.',
  },
  {
    q: 'Bagaimana cara booking dan berapa uang mukanya?',
    a: 'Booking dilakukan langsung ke pemilik via WhatsApp. Untuk kost, uang muka biasanya 1 bulan sewa pertama. Untuk kontrakan, pembayaran sesuai kesepakatan — bisa per tahun atau per semester.',
  },
  {
    q: 'Apakah tersedia WiFi dan AC di setiap kamar?',
    a: 'Ya, setiap kamar kost dilengkapi AC, kamar mandi dalam, dan akses WiFi. Untuk kontrakan, 3 dari 5 kamar sudah ber-AC, dan ruang tamu juga ber-AC.',
  },
  {
    q: 'Kost ini untuk putra, putri, atau campur?',
    a: 'Kost Nyaman 2 adalah kost campur, cocok untuk mahasiswa maupun karyawan.',
  },
  {
    q: 'Apakah listrik sudah termasuk harga sewa?',
    a: 'Untuk Kost Nyaman 2 Tipe B, token listrik sudah termasuk dalam harga sewa bulanan. Untuk Tipe A, silakan tanyakan rincian tagihan listrik langsung ke pemilik via WhatsApp.',
  },
  {
    q: 'Apakah bisa sewa bulanan atau harus kontrak tahunan?',
    a: 'Untuk kost, pembayaran dilakukan per bulan. Untuk kontrakan, kami menerima kontrak tahunan. Bisa juga dinegosiasikan langsung dengan pemilik.',
  },
];
