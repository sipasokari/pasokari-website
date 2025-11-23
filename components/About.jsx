export default function About({ t }) {
  return (
    <section id="about" className="section-container about-section">
        <div className="about-container">
            <div className="about-image-wrapper hidden-on-load">
                <img src="/assets/about-image.jpg" alt="Tentang Pasokari" />
                <div className="floating-badge">
                    <div className="icon">📦</div>
                    <div>
                        <strong>{t.aboutBadgeTitle}</strong>
                        <span>{t.aboutBadgeSubtitle}</span>
                    </div>
                </div>
            </div>
            <div className="about-text hidden-on-load">
                <h2 className="section-title">{t.aboutTitle}</h2>
                <div className="about-description">
                    <div dangerouslySetInnerHTML={{ __html: t.aboutText1 }} />
                    <div className="about-quote-box">
                       <div dangerouslySetInnerHTML={{ __html: t.aboutText2 }} />
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}