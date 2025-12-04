import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Translations, Inquiry } from '../types';

interface ContactProps {
  t: Translations;
  currentInquiry: Inquiry | null;
  lang: 'id' | 'en';
  onResetInquiry: () => void;
}

export default function Contact({ t, currentInquiry, lang, onResetInquiry }: ContactProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) 
        });
        
        const result = await response.json();

        if (response.ok) {
            setFormStatus({type:'success', message: t.formSuccess}); 
            (e.target as HTMLFormElement).reset(); 
            setMessageBody(''); 
            if (onResetInquiry) onResetInquiry(); 
        } else {
            throw new Error(result.message || 'Gagal mengirim pesan.');
        }
    } catch (error) {
        console.error("Error:", error);
        setFormStatus({type:'error', message: t.formErrorServer});
    } finally { 
        setIsSubmitting(false); 
    }
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
                        <a href="https://wa.me/628111289655" target="_blank"><Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WA" width={22} height={22} /></a>
                        <a href="mailto:sipasokari@gmail.com"><Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Email" width={22} height={22} /></a>
                        <a href="https://www.instagram.com/pasokari/" target="_blank"><Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="IG" width={22} height={22} /></a>
                        <a href="https://www.tiktok.com/@pasokari_id" target="_blank"><Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" width={22} height={22} /></a>
                    </div>
                </div>

                <div className="contact-map">
                    <iframe 
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15855.386889167872!2d106.858841!3d-6.541032!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c1eb3be9c391%3A0x716f08e5ede1c9c9!2sCitra%20Sentul%20Raya%20Sirkuit%20Sentul%20Ciputra%20Group!5e0!3m2!1sid!2sid!4v1763793523072!5m2!1sid!2sid`}
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Pasokari"
                    ></iframe>
                </div>
            </div>

            <div className="contact-form-container hidden-on-load">
                <h3>{t.contactFormTitleAlt}</h3>
                <p>{t.contactFormDescAlt}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><input type="text" name="name" placeholder={t.formNamePlaceholder} required /></div>
                    <div className="form-group"><input type="tel" name="phone" placeholder={t.formPhonePlaceholder} required /></div>
                    <div className="form-group"><input type="email" name="email" placeholder={t.formEmailPlaceholder} required /></div>
                    <div className="form-group">
                        <textarea name="message" rows={5} placeholder={t.formMessagePlaceholder} required value={messageBody} onChange={(e) => {setMessageBody(e.target.value); if(currentInquiry) onResetInquiry();}}></textarea>
                    </div>
                    {formStatus.message && <div id="formStatus" className={formStatus.type}>{formStatus.message}</div>}
                    <button type="submit" className="cta-button form-submit-btn" disabled={isSubmitting}>{isSubmitting ? t.formSending : t.formSend}</button>
                </form>
            </div>
        </div>
    </section>
  );
}