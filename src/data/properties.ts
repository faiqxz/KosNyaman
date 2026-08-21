export interface Facility {
  name: string;
  type: 'private' | 'shared';
}

export interface Spec {
  label: string;
  value: string;
}

export interface Property {
  id: string;
  type: 'kost' | 'kontrakan';
  name: string;
  tagline: string;
  location: string;
  price: number;
  priceLabel: string;
  originalPriceLabel?: string;
  pricePeriod: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  gallery: string[];
  facilities: Facility[];
  specs?: Spec[];
  status: 'available' | 'limited' | 'rented';
  mapsUrl: string;
  coords: [number, number];
  badge?: string;
}

export const properties: Property[] = [
  {
    id: 'kos-nyaman-bukit-baru',
    type: 'kost',
    name: 'Kost Nyaman 2 Tipe A',
    tagline: 'Kamar AC, WiFi, dan Kamar Mandi Dalam di Bukit Baru',
    location: 'Jln Bukit Baru, Lorong Bukit Jaya, No Ujung, Palembang',
    price: 1_400_000,
    priceLabel: 'Rp1.400.000',
    originalPriceLabel: 'Rp1.500.000',
    pricePeriod: '/bulan',
    shortDescription:
      'Kost siap huni dengan AC, WiFi, kamar mandi dalam, dan fasilitas lengkap. Cocok untuk mahasiswa dan karyawan.',
    description:
      'Kost dengan fasilitas lengkap, suasana tenang, dan area yang nyaman untuk tinggal harian.\n\nTersedia kamar ber-AC dengan kamar mandi pribadi di dalam, dilengkapi kasur, meja, dan lemari. Lingkungan aman dengan keamanan malam dan akses parkiran luas.\n\nLokasi sangat strategis — dekat Universitas Sriwijaya, RS Permata Palembang, pusat kota Palembang, dan Bandara SMB II.',
    heroImage: '/images/kos-nyaman/8.webp',
    gallery: [
      '/images/kos-nyaman/1.webp',
      '/images/kos-nyaman/2.webp',
      '/images/kos-nyaman/3.webp',
      '/images/kos-nyaman/4.webp',
      '/images/kos-nyaman/5.webp',
      '/images/kos-nyaman/6.webp',
      '/images/kos-nyaman/7.webp',
      '/images/kos-nyaman/8.webp',
      '/images/kos-nyaman/9.webp',
      '/images/kos-nyaman/10.webp',
      '/images/kos-nyaman/11.webp',
      '/images/kos-nyaman/12.webp',
    ],
    facilities: [
      { name: 'AC', type: 'private' },
      { name: 'Kasur & Bantal', type: 'private' },
      { name: 'Meja Belajar & Kursi', type: 'private' },
      { name: 'Lemari Pakaian', type: 'private' },
      { name: 'KM Dalam (Air PAM)', type: 'private' },
      { name: 'WiFi', type: 'shared' },
      { name: 'Dapur Umum', type: 'shared' },
      { name: 'Jemuran Umum', type: 'shared' },
      { name: 'Parkiran Motor & Mobil', type: 'shared' },
      { name: 'Keamanan Malam', type: 'shared' },
      { name: 'Gazebo', type: 'shared' },
    ],
    specs: [
      { label: 'Tipe Kost', value: 'Campur' },
      { label: 'Kamar Mandi', value: 'Dalam' },
      { label: 'AC', value: 'Tiap Kamar' },
      { label: 'Tagihan', value: 'Bulanan' },
    ],
    status: 'rented',
    mapsUrl: 'https://maps.app.goo.gl/7WT1v7Fidvf7xHrb9',
    coords: [-2.9836, 104.7349],
    badge: 'Sudah Tersewa',
  },
  {
    id: 'kos-nyaman-tipe-b',
    type: 'kost',
    name: 'Kost Nyaman 2 Tipe B',
    tagline: 'Kamar AC, WiFi, Listrik, dan Kamar Mandi Dalam di Bukit Baru',
    location: 'Jln Bukit Baru, Lorong Bukit Jaya, No Ujung, Palembang',
    price: 1_400_000,
    priceLabel: 'Rp1.400.000',
    originalPriceLabel: 'Rp1.500.000',
    pricePeriod: '/bulan',
    shortDescription:
      'Kost siap huni dengan AC, WiFi, kamar mandi dalam, token listrik termasuk, dan fasilitas lengkap. Cocok untuk mahasiswa dan karyawan.',
    description:
      'Kost dengan fasilitas lengkap, suasana tenang, dan area yang nyaman untuk tinggal harian.\n\nTersedia kamar ber-AC dengan kamar mandi pribadi di dalam, dilengkapi kasur, meja, dan lemari. Tagihan bulanan sudah termasuk token listrik.\n\nLingkungan aman dengan keamanan malam dan akses parkiran luas.\n\nLokasi sangat strategis — dekat Universitas Sriwijaya, RS Permata Palembang, pusat kota Palembang, dan Bandara SMB II.',
    heroImage: '/images/kos-nyaman/kamar-depan-1.webp',
    gallery: [
      '/images/kos-nyaman/kamar-depan-1.webp',
      '/images/kos-nyaman/kamar-depan-2.webp',
      '/images/kos-nyaman/kamar-depan-3.webp',
      '/images/kos-nyaman/kamar-depan-4.webp',
      '/images/kos-nyaman/kamar-depan-5.webp',
      '/images/kos-nyaman/kamar-depan-6.webp',
      '/images/kos-nyaman/kamar-depan-7.webp',
      '/images/kos-nyaman/kamar-depan-8.webp',
      '/images/kos-nyaman/kamar-depan-10.webp',
      '/images/kos-nyaman/kamar-depan-11.webp',
    ],
    facilities: [
      { name: 'Listrik (Sudah Termasuk)', type: 'private' },
      { name: 'AC', type: 'private' },
      { name: 'Kasur & Bantal', type: 'private' },
      { name: 'Meja Belajar & Kursi', type: 'private' },
      { name: 'Lemari Pakaian', type: 'private' },
      { name: 'KM Dalam (Air PAM)', type: 'private' },
      { name: 'WiFi', type: 'shared' },
      { name: 'Dapur Umum', type: 'shared' },
      { name: 'Jemuran Umum', type: 'shared' },
      { name: 'Parkiran Motor & Mobil', type: 'shared' },
      { name: 'Keamanan Malam', type: 'shared' },
      { name: 'Gazebo', type: 'shared' },
    ],
    specs: [
      { label: 'Tipe Kost', value: 'Campur' },
      { label: 'Kamar Mandi', value: 'Dalam' },
      { label: 'AC', value: 'Tiap Kamar' },
      { label: 'Tagihan', value: 'Bulanan (Include Listrik)' },
    ],
    status: 'rented',
    mapsUrl: 'https://maps.app.goo.gl/7WT1v7Fidvf7xHrb9',
    coords: [-2.9836, 104.7349],
    badge: 'Sudah Tersewa',
  },
  {
    id: 'kontrakan-macan-putih',
    type: 'kontrakan',
    name: 'Kontrakan Macan Putih',
    tagline: 'Rumah Luas 5 Kamar di Tengah Kota Palembang',
    location: 'Jl. Parameswara Lr. Macan Putih No. 88, Palembang',
    price: 37_000_000,
    priceLabel: 'Rp37.000.000',
    originalPriceLabel: 'Rp38.000.000',
    pricePeriod: '/tahun',
    shortDescription:
      'Rumah kontrakan luas 5 kamar tidur, 3 kamar mandi, garasi 2 mobil, PDAM 24 jam, dan lokasi strategis.',
    description:
      'Rumah luas dan nyaman untuk keluarga besar, karyawan, atau hunian staf. Lokasinya sangat strategis, hanya sekitar 50 meter dari Jalan Raya Parameswara.\n\nArea sekitar dekat pasar tradisional, sekolah SD–SMA, Universitas Sriwijaya, rumah sakit, dokter praktik, Bandara SMB II, dan pusat perkotaan Palembang.\n\nDilengkapi PDAM Tirta Musi 24 jam, tandon air 900 liter, dua meteran listrik, dan sistem one gate untuk keamanan optimal.',
    heroImage:
      '/images/macan-putih/13.webp',
    gallery: [
      '/images/macan-putih/13.webp',
      '/images/macan-putih/1.webp',
      '/images/macan-putih/2.webp',
      '/images/macan-putih/3.webp',
      '/images/macan-putih/4.webp',
      '/images/macan-putih/5.webp',
      '/images/macan-putih/6.webp',
      '/images/macan-putih/7.webp',
      '/images/macan-putih/8.webp',
      '/images/macan-putih/9.webp',
      '/images/macan-putih/10.webp',
      '/images/macan-putih/11.webp',
      '/images/macan-putih/12.webp',
    ],
    facilities: [
      { name: '5 Kamar Tidur (3 ber-AC)', type: 'private' },
      { name: '3 Kamar Mandi (1 air panas)', type: 'private' },
      { name: 'Garasi 2 Mobil + Motor', type: 'private' },
      { name: 'Ruang Tamu ber-AC', type: 'private' },
      { name: 'Ruang Makan & Dapur', type: 'private' },
      { name: 'Gudang', type: 'private' },
      { name: 'PDAM Tirta Musi 24 Jam', type: 'shared' },
      { name: 'Tandon Air 900 Liter', type: 'shared' },
      { name: 'Listrik 3500 & 1300 Watt', type: 'shared' },
      { name: '2 Meteran Listrik', type: 'shared' },
      { name: 'Bebas Banjir', type: 'shared' },
      { name: 'One Gate System', type: 'shared' },
    ],
    specs: [
      { label: 'Luas Tanah', value: '276 m²' },
      { label: 'Luas Bangunan', value: '208 m²' },
      { label: 'Kamar Tidur', value: '5 Kamar' },
      { label: 'Kamar Mandi', value: '3 Kamar' },
    ],
    status: 'rented',
    mapsUrl: 'https://share.google/yiFTIDSfcfwLxVrNU',
    coords: [-2.9641, 104.7456],
    badge: 'Sudah Disewa',
  },
];
