export default function Hero({ t, onSmoothScroll }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
        <a href="#products" className="cta-button" onClick={(e) => onSmoothScroll(e, 'products')}>
          {t.heroCTA}
        </a>
      </div>
    </section>
  );
}