'use client';
import { useState, useEffect } from 'react';

export default function Contact({ t, currentInquiry, lang, onResetInquiry }) {
  const [messageBody, setMessageBody] = useState('');
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (currentInquiry) {
      const prefixKey = currentInquiry.type === 'category' ? 'formInquiryDefaultCategory' : 'formInquiryDefaultProduct';
      const prefixText = t[prefixKey] || "Halo, saya tertarik dengan: ";
      setMessageBody(`${prefixText}${currentInquiry.translatedName}`);
    }
  }, [currentInquiry, t]);

  const copyEmail = () => {
    navigator.clipboard.writeText('sipasokari@gmail.com').then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
        await fetch('https://formspree.io/f/xgvnbkoe', { 
            method: 'POST', 
            body: new FormData(e.target), 
            headers: {'Accept': 'application/json'} 
        });
        setFormStatus({type:'success', message: t.formSuccess}); 
        e.target.reset(); 
        setMessageBody(''); 
        onResetInquiry(); 
    } catch {
        setFormStatus({type:'error', message: t.formErrorServer});
    } finally { setIsSubmitting(false); }
  };

  return (
    <section id="contact" className="section-container contact-section">
        <h2 className="section-title">{t.contactTitle}</h2>
        <p className="contact-subtitle">{t.contactSubtitle}</p>
        
        <div className="contact-layout-grid">
            {/* BAGIAN KIRI: INFO + MAPS */}
            <div className="contact-info hidden-on-load">
                <h3>{t.contactInfoTitle}</h3>
                
                <div className="info-block">
                    <strong>{t.contactAddressTitle}</strong>
                    <p dangerouslySetInnerHTML={{ __html: t.contactAddressText }} />
                </div>
                
                <div className="info-block email-copy-block">
                    <strong>{t.contactEmailTitle}</strong>
                    <p>
                        <a href="mailto:sipasokari@gmail.com">sipasokari@gmail.com</a>
                        <button className="copy-btn" onClick={copyEmail}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                <path d="M7 3.5A1.5 1.5 0 018.5 2h5A1.5 1.5 0 0115 3.5v10A1.5 1.5 0 0113.5 15h-5A1.5 1.5 0 017 13.5v-10z" />
                                <path d="M5.5 4A1.5 1.5 0 004 5.5v10A1.5 1.5 0 005.5 17h5A1.5 1.5 0 0012 15.5v-1a.75.75 0 01-1.5 0v1A.5.5 0 0110 16H6a.5.5 0 01-.5-.5v-9A.5.5 0 016 6h1a.75.75 0 010-1.5H6A1.5 1.5 0 004.5 4h1z" />
                            </svg>
                        </button>
                    </p>
                    <span className={`copy-success ${copySuccess ? 'visible' : ''}`}>{t.copySuccess}</span>
                </div>
                
                <div className="info-block">
                    <strong>{t.contactSocialTitle}</strong>
                    <div className="contact-social-icons">
                        <a href="https://wa.me/628111289655" target="_blank"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WA" /></a>
                        <a href="mailto:sipasokari@gmail.com"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Email" /></a>
                        <a href="https://www.instagram.com/pasokari/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="IG" /></a>
                        <a href="https://www.tiktok.com/@pasokari_id" target="_blank"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" /></a>
                    </div>
                </div>

                {/* --- GOOGLE MAPS EMBED --- */}
                <div className="contact-map">
                    <iframe 
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.860559773308!2d106.8588411153728!3d-6.541032195269094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c086e77c369f%3A0x4e31ac1a59912404!2sCitra%20Sentul%20Raya!5e0!3m2!1s${lang}!2sid!4v1700000000000!5m2!1s${lang}!2sid`}
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Pasokari"
                    ></iframe>
                </div>
                {/* ------------------------------------------------- */}

            </div>

            {/* BAGIAN KANAN: FORMULIR */}
            <div className="contact-form-container hidden-on-load">
                <h3>{t.contactFormTitleAlt}</h3>
                <p>{t.contactFormDescAlt}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><input type="text" name="name" placeholder={t.formNamePlaceholder} required /></div>
                    <div className="form-group"><input type="tel" name="phone" placeholder={t.formPhonePlaceholder} required /></div>
                    <div className="form-group"><input type="email" name="email" placeholder={t.formEmailPlaceholder} required /></div>
                    <div className="form-group">
                        <textarea 
                            name="message" 
                            rows="5" 
                            placeholder={t.formMessagePlaceholder} 
                            required 
                            value={messageBody} 
                            onChange={(e) => {
                                setMessageBody(e.target.value);
                                if(currentInquiry) onResetInquiry();
                            }}
                        ></textarea>
                    </div>
                    {formStatus.message && <div id="formStatus" className={formStatus.type}>{formStatus.message}</div>}
                    <button type="submit" className="cta-button form-submit-btn" disabled={isSubmitting}>{isSubmitting ? t.formSending : t.formSend}</button>
                </form>
            </div>
        </div>
    </section>
  );
}