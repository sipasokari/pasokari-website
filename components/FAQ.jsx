'use client';
import { useState } from 'react';

export default function FAQ({ t }) {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section id="faq" className="section-container">
        <h2 className="section-title">{t.faqTitle}</h2>
        <div className="faq-container">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <div key={num} className={`faq-item ${activeFaq === num ? 'active' : ''}`}>
                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === num ? null : num)}>
                        <span>{t[`faq${num}q`]}</span>
                        <div className="faq-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </button>
                    <div className="faq-answer" style={{ maxHeight: activeFaq === num ? '500px' : '0' }}>
                        <p>{t[`faq${num}a`]}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}