import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { FAQ_DATA } from '../data/faq';
import { waLink } from '../data/site';
import './FaqAccordion.css';

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
            Belum menemukan jawaban?{' '}
            <a
              href={waLink('Halo, saya punya pertanyaan tentang Kos Nyaman.')}
              target="_blank"
              rel="noopener noreferrer"
              className="faq-section__link"
            >
              Hubungi kami langsung via WhatsApp.
            </a>
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
                  id={`faq-question-${i}`}
                  className="faq-item__trigger"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="faq-item__question">{item.q}</span>
                  <span className="faq-item__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-item__answer-wrap"
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  style={{
                    maxHeight: isOpen ? '480px' : '0',
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
