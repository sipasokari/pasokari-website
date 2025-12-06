import { Translations } from '../types';

interface HeroProps {
  t: Translations;
  onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function Hero({ t, onSmoothScroll }: HeroProps) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h1 className="hidden-on-load" style={{ transitionDelay: '100ms' }}>{t.heroTitle}</h1>
        <p className="hidden-on-load" style={{ transitionDelay: '300ms' }}>{t.heroSubtitle}</p>
        <a 
          href="#products" 
          className="cta-button hidden-on-load" 
          style={{ transitionDelay: '500ms' }}
          onClick={(e) => onSmoothScroll(e, 'products')}
        >
          {t.heroCTA}
        </a>
      </div>
    </section>
  );
}