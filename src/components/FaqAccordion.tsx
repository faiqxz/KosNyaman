import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import './FaqAccordion.css';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
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
    a: 'Ya, setiap kamar kost dilengkapi AC dan akses WiFi. Untuk kontrakan, 3 dari 5 kamar sudah ber-AC, dan ruang tamu juga ber-AC.',
  },
  {
    q: 'Berapa jarak ke Universitas Sriwijaya?',
    a: 'Baik Kost Nyaman maupun Kontrakan Macan Putih berjarak sangat dekat, hanya sekitar 5–7 menit ke kampus UNSRI Bukit Besar.',
  },
  {
    q: 'Apakah bisa sewa bulanan atau harus kontrak tahunan?',
    a: 'Untuk kost, pembayaran dilakukan per bulan. Untuk kontrakan, kami menerima kontrak tahunan. Bisa juga dinegosiasikan langsung dengan pemilik.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  useReveal();

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="faq-section" id="faq">
      <div className="container faq-section__grid">
        {/* Left – Headline */}
        <div className="faq-section__left reveal">
          <span className="eyebrow faq-section__eyebrow">FAQ</span>
          <h2 className="section-headline faq-section__headline">
            Pertanyaan<br />yang Sering Ditanyakan
          </h2>
          <p className="body-lg faq-section__sub">
            Belum menemukan jawaban? Hubungi kami langsung via WhatsApp.
          </p>
        </div>

        {/* Right – Accordion */}
        <div className="faq-section__right reveal reveal-delay-1">
          {FAQ_DATA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
              >
                <button
                  className="faq-item__trigger"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="faq-item__question">{item.q}</span>
                  <span className="faq-item__icon">{isOpen ? '−' : '+'}</span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-item__answer-wrap"
                  role="region"
                  style={{
                    maxHeight: isOpen ? '300px' : '0',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="faq-item__answer">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
