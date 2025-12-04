'use client';
import { useState, useEffect, useCallback } from 'react';
import fullData from '../data.json';
import NextImage from 'next/image';
import { ProductData, CategoryItem, CategoryData, Translations, FullData, Inquiry } from '../types';

// --- IMPORT KOMPONEN ---
import Navbar from './Navbar';
import Hero from './Hero';
import Products from './Products';
import Gallery from './Gallery';
import About from './About';
import FAQ from './FAQ';
import Clients from './Clients';
import Contact from './Contact';
import Footer from './Footer';
import Modal from './ui/Modal';

// --- DATA STATIS ---
const categoryKeys: Record<string, { title: string; desc: string }> = {
  'Sayuran': { title: 'categoryVegetables', desc: 'modalSayuranDesc' },
  'Herbs & Spices': { title: 'categoryHerbs', desc: 'modalHerbsDesc' },
  'Buah-buahan': { title: 'categoryFruits', desc: 'modalBuahDesc' },
  'Bahan Pangan Lain': { title: 'categoryStaples', desc: 'modalPanganDesc' },
  'Frozen Food': { title: 'categoryFrozen', desc: 'modalFrozenDesc' }
};

interface HomeContentProps {
  initialCategoryData: CategoryData | null;
}

export default function HomeContent({ initialCategoryData }: HomeContentProps) {
  // --- GLOBAL STATE ---
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- MODAL STATE ---
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<{ id: string; display: string; imgSrc: string } | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // --- INQUIRY STATE ---
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  // --- DATA STATE (PRODUK DARI DATABASE) ---
  const [categoryData, setCategoryData] = useState<CategoryData | null>(initialCategoryData); 
  
  // Terjemahan UI tetap dari file lokal
  const t = (fullData.translations as any)[lang] as Translations; 

  // --- EFFECTS ---

  // --- 1. FETCH DATA REMOVED (Server Side now) ---

  // 2. Init (Preloader, Theme, Cookie)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
    
    if (!localStorage.getItem('cookie_consent_given')) setTimeout(() => setShowCookieBanner(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 3. Theme Applicator
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 4. Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      if (window.scrollY > 200) {
        sections.forEach(sec => {
          if (window.scrollY >= (sec as HTMLElement).offsetTop - 150) current = sec.getAttribute('id') || 'home';
        });
      }
      setActiveSection(current);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    window.addEventListener('scroll', handleScroll);
    if (!loading) setTimeout(() => document.querySelectorAll('.hidden-on-load').forEach(el => observer.observe(el)), 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // 5. Keyboard Listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setCategoryModalOpen(false);
            setProductDetailOpen(false);
        }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // --- HELPER FUNCTIONS ---
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
        const navbar = document.querySelector('.navbar') as HTMLElement;
        const navbarHeight = navbar?.offsetHeight || 70;
        window.scrollTo({ top: (el as HTMLElement).offsetTop - navbarHeight, behavior: 'smooth' });
    }
  };

  const getModalProducts = useCallback(() => {
      if (!selectedCategory || !categoryData) return [];
      
      const categoryItem = categoryData[selectedCategory];
      if (!categoryItem) return [];

      const prodIds = categoryItem.id.products;
      const prodDisplays = categoryItem[lang]?.products || prodIds;
      const folder = selectedCategory.toLowerCase().replace(/[\(\)\/& -]/g, '_').replace(/_+/g, '_');
      
      return prodIds.map((id, i) => ({
          id: id,
          display: prodDisplays[i],
          imgSrc: `/assets/katalog/${folder}/${id.toLowerCase().replace(/[\(\)\/]/g, '').replace(/ /g, '_').replace(/,/g,'.')}.jpg`
      })).filter(p => p.display.toLowerCase().includes(modalSearchTerm.toLowerCase()));
  }, [selectedCategory, lang, modalSearchTerm, categoryData]);

  const getTranslatedInquiry = () => {
      if (!currentInquiry || !categoryData) return null;
      let translatedName = currentInquiry.id;
      if (currentInquiry.type === 'category') {
          const key = categoryKeys[currentInquiry.id]?.title;
          translatedName = key ? t[key] : currentInquiry.id;
      } else if (currentInquiry.type === 'product') {
          const catRaw = currentInquiry.category;
          const pID = currentInquiry.id;
          if (catRaw && categoryData[catRaw]) {
              const idx = categoryData[catRaw].id.products.indexOf(pID);
              if (idx !== -1) translatedName = categoryData[catRaw][lang]?.products[idx] || pID;
          }
      }
      return { ...currentInquiry, translatedName };
  };

  return (
    <>
      <div className={`preloader ${!loading ? 'hidden' : ''}`}><img src="/assets/logo.png" className="preloader-icon" alt="Loading" /></div>

      <Navbar 
        t={t} lang={lang} setLang={setLang} 
        darkMode={darkMode} setDarkMode={setDarkMode} 
        onSmoothScroll={handleSmoothScroll} activeSection={activeSection} 
      />

      <main>
        <Hero t={t} onSmoothScroll={handleSmoothScroll} />
        
        {/* MENAMPILKAN PRODUK */}
        {categoryData ? (
            <Products 
                t={t} categoryData={categoryData} categoryKeys={categoryKeys}
                onOpenModal={(cat: string) => { setSelectedCategory(cat); setCategoryModalOpen(true); setModalSearchTerm(''); }}
            />
        ) : (
            <div className="py-20 text-center text-gray-500">Loading Products...</div>
        )}
        
        <Gallery t={t} />
        <About t={t} />
        <FAQ t={t} />
        <Clients t={t} />
        
        <Contact 
            t={t} 
            currentInquiry={getTranslatedInquiry()} 
            lang={lang}
            onResetInquiry={() => setCurrentInquiry(null)}
        />
      </main>

      <Footer t={t} />

      <button className={`back-to-top ${showBackToTop ? 'visible' : ''}`} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
      </button>
      
      <a href="https://wa.me/628111289655" className="whatsapp-cta"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" style={{width: '24px', filter: 'invert(1)'}} alt="WA" /></a>

      {showCookieBanner && <div className="cookie-banner visible"><p>{t.cookieText}</p><button className="cta-button" onClick={() => {localStorage.setItem('cookie_consent_given', 'true'); setShowCookieBanner(false);}}>{t.cookieAccept}</button></div>}

      {/* MODALS */}
      <Modal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} className="category-modal-content">
          <h2>{selectedCategory ? (t[categoryKeys[selectedCategory]?.title] || selectedCategory) : ''}</h2>
          <p>{selectedCategory && t[categoryKeys[selectedCategory]?.desc]}</p>
          <hr className="modal-divider" />
          <h3>{t.modalProductsTitle}</h3>
          <div className="modal-search-container"><input type="search" placeholder={t.modalSearchPlaceholder} value={modalSearchTerm} onChange={e => setModalSearchTerm(e.target.value)} /></div>
          <div className="modal-product-grid">
              {getModalProducts().map(p => (
                  <div key={p.id} className="modal-product-item" onClick={() => { setSelectedProductDetail(p); setProductDetailOpen(true); }}>
                      <div style={{ position: 'relative', width: '100%', height: '150px' }}>
                        <NextImage 
                          src={p.imgSrc} 
                          alt={p.display} 
                          fill 
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          onError={(e) => (e.target as HTMLImageElement).style.display='none'} 
                        />
                      </div>
                      <p>{p.display}</p>
                  </div>
              ))}
          </div>
          <a href="#contact" className="cta-button modal-cta" onClick={(e) => { e.preventDefault(); if (selectedCategory) { setCurrentInquiry({ type: 'category', id: selectedCategory, category: selectedCategory }); setCategoryModalOpen(false); handleSmoothScroll(e, 'contact'); } }}>{t.modalCTA}</a>
      </Modal>

      <Modal isOpen={productDetailOpen} onClose={() => setProductDetailOpen(false)} className="product-detail-content">
          <div style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '1rem' }}>
            <NextImage 
              src={selectedProductDetail?.imgSrc || ''} 
              id="productDetailImage" 
              alt="Detail" 
              fill
              className="object-contain"
            />
          </div>
          <h3>{selectedProductDetail?.display}</h3>
          <a href="#contact" className="cta-button modal-cta" onClick={(e) => { e.preventDefault(); if (selectedProductDetail && selectedCategory) { setCurrentInquiry({ type: 'product', id: selectedProductDetail.id, category: selectedCategory }); setProductDetailOpen(false); setCategoryModalOpen(false); handleSmoothScroll(e, 'contact'); } }}>{t.productDetailCTA}</a>
      </Modal>
    </>
  );
}