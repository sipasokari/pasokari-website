'use client';
import { useState, useEffect } from 'react';

const galleryImages = [
  { src: 'selada_romaine_hijau.jpg', key: 'galleryAlt1' },
  { src: 'jahe_gajah.jpg', key: 'galleryAlt2' },
  { src: 'stroberi_merah.jpg', key: 'galleryAlt3' },
  { src: 'telur.jpg', key: 'galleryAlt4' },
  { src: 'shoestring.jpg', key: 'galleryAlt5' },
  { src: 'beetroot.jpg', key: 'galleryAlt6' },
  { src: 'kunyit.jpg', key: 'galleryAlt7' },
  { src: 'semangka.jpg', key: 'galleryAlt8' },
  { src: 'tahu_&_tempe.jpg', key: 'galleryAlt9' },
  { src: 'bakso_&_sosis.jpg', key: 'galleryAlt10' }
];

export default function Gallery({ t }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Keyboard Nav untuk Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      <section id="gallery" className="section-container">
        <h2 className="section-title">{t.galleryTitle}</h2>
        <div className="gallery-grid">
          {galleryImages.slice(0, visibleCount).map((item, idx) => (
              <div 
                key={idx} 
                className="gallery-item hidden-on-load" 
                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
              >
                  <img src={`/assets/gallery/${item.src}`} alt={t[item.key]} loading="lazy" />
                  <div className="gallery-overlay"><span>{t[item.key]}</span></div>
              </div>
          ))}
        </div>
        {visibleCount < galleryImages.length && (
          <button id="loadMoreGallery" className="cta-button secondary" onClick={() => setVisibleCount(prev => prev + 5)}>
              {t.galleryLoadMore}
          </button>
        )}
      </section>

      {/* LIGHTBOX UI */}
      <div className={`lightbox ${lightboxOpen ? 'visible' : ''}`} onClick={(e) => e.target.className.includes('lightbox') && setLightboxOpen(false)}>
        <span className="lightbox-close" onClick={() => setLightboxOpen(false)}>&times;</span>
        <button className="lightbox-prev" onClick={() => setLightboxIndex((idx) => (idx - 1 + galleryImages.length) % galleryImages.length)}>&#10094;</button>
        <button className="lightbox-next" onClick={() => setLightboxIndex((idx) => (idx + 1) % galleryImages.length)}>&#10095;</button>
        <div className="lightbox-content">
            <img id="lightboxImage" src={`/assets/gallery/${galleryImages[lightboxIndex].src}`} alt="Zoomed" />
            <div className="lightbox-caption">{t[galleryImages[lightboxIndex].key]} - {t.galleryCaption}</div>
        </div>
      </div>
    </>
  );
}