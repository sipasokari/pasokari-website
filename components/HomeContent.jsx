'use client';
import { useState, useEffect, useCallback } from 'react';
import fullData from '../data.json';

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
const categoryKeys = {
  'Sayuran': { title: 'categoryVegetables', desc: 'modalSayuranDesc' },
  'Herbs & Spices': { title: 'categoryHerbs', desc: 'modalHerbsDesc' },
  'Buah-buahan': { title: 'categoryFruits', desc: 'modalBuahDesc' },
  'Bahan Pangan Lain': { title: 'categoryStaples', desc: 'modalPanganDesc' },
  'Frozen Food': { title: 'categoryFrozen', desc: 'modalFrozenDesc' }
};

export default function HomeContent() {
  // --- STATE GLOBAL ---
  const [lang, setLang] = useState('id');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // --- STATE MODAL ---
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // --- STATE INQUIRY (Data Produk ke Kontak) ---
  const [currentInquiry, setCurrentInquiry] = useState(null);

  // Helper Data
  const t = fullData.translations[lang];
  const categoryData = fullData.categoryData;

  // --- EFFECTS ---

  // 1. Init (Preloader, Theme, Cookie)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
    
    if (!localStorage.getItem('cookie_consent_given')) {
      setTimeout(() => setShowCookieBanner(true), 1000);
    }
    return () => clearTimeout(timer);
  }, []);

  // 2. Theme Applicator
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // 3. Scroll Logic (Active Section & Fade In)
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      if (window.scrollY > 200) {
        sections.forEach(sec => {
          if (window.scrollY >= sec.offsetTop - 150) current = sec.getAttribute('id');
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
    
    if (!loading) {
        setTimeout(() => {
            document.querySelectorAll('.hidden-on-load').forEach(el => observer.observe(el));
        }, 100);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // 4. Keyboard Listener (Esc)
  useEffect(() => {
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            setCategoryModalOpen(false);
            setProductDetailOpen(false);
        }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // --- ACTIONS ---

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        window.scrollTo({ top: el.offsetTop - navbarHeight, behavior: 'smooth' });
    }
  };

  // Helper untuk Modal Kategori (Filter Produk)
  const getModalProducts = useCallback(() => {
      if (!selectedCategory) return [];
      const prodIds = categoryData[selectedCategory].id.products;
      const prodDisplays = categoryData[selectedCategory][lang]?.products || prodIds;
      const folder = selectedCategory.toLowerCase().replace(/[\(\)\/& -]/g, '_').replace(/_+/g, '_');
      
      return prodIds.map((id, i) => ({
          id: id,
          display: prodDisplays[i],
          imgSrc: `/assets/katalog/${folder}/${id.toLowerCase().replace(/[\(\)\/]/g, '').replace(/ /g, '_').replace(/,/g,'.')}.jpg`
      })).filter(p => p.display.toLowerCase().includes(modalSearchTerm.toLowerCase()));
  }, [selectedCategory, lang, modalSearchTerm, categoryData]);

  // Helper untuk Menyiapkan Data Inquiry Terjemahan ke Kontak
  const getTranslatedInquiry = () => {
      if (!currentInquiry) return null;
      let translatedName = currentInquiry.id;
      
      if (currentInquiry.type === 'category') {
          const key = categoryKeys[currentInquiry.id]?.title;
          translatedName = key ? t[key] : currentInquiry.id;
      } else if (currentInquiry.type === 'product') {
          const catRaw = currentInquiry.category;
          const pID = currentInquiry.id;
          if (categoryData[catRaw]) {
              const idx = categoryData[catRaw].id.products.indexOf(pID);
              if (idx !== -1) translatedName = categoryData[catRaw][lang]?.products[idx] || pID;
          }
      }
      return { ...currentInquiry, translatedName };
  };

  return (
    <>
      {/* PRELOADER */}
      <div className={`preloader ${!loading ? 'hidden' : ''}`}>
        <img src="/assets/logo.png" className="preloader-icon" alt="Loading" />
      </div>

      {/* NAVBAR */}
      <Navbar 
        t={t} 
        lang={lang} setLang={setLang} 
        darkMode={darkMode} setDarkMode={setDarkMode} 
        onSmoothScroll={handleSmoothScroll} 
        activeSection={activeSection} 
      />

      <main>
        {/* SECTIONS */}
        <Hero t={t} onSmoothScroll={handleSmoothScroll} />
        
        <Products 
            t={t} 
            categoryData={categoryData} 
            categoryKeys={categoryKeys}
            onOpenModal={(cat) => { 
                setSelectedCategory(cat); 
                setCategoryModalOpen(true); 
                setModalSearchTerm(''); 
            }}
        />
        
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

      {/* --- FLOATING ELEMENTS --- */}
      
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      
      <a href="https://wa.me/628111289655" className="whatsapp-cta" target="_blank" rel="noopener noreferrer">
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" style={{width: '24px', filter: 'invert(1)'}} alt="WA" />
      </a>

      {showCookieBanner && (
        <div className="cookie-banner visible">
            <p>{t.cookieText}</p>
            <button className="cta-button" onClick={() => {localStorage.setItem('cookie_consent_given', 'true'); setShowCookieBanner(false);}}>
                {t.cookieAccept}
            </button>
        </div>
      )}

      {/* --- MODALS (Menggunakan Komponen ui/Modal) --- */}

      {/* 1. Modal Kategori Produk */}
      <Modal 
        isOpen={categoryModalOpen} 
        onClose={() => setCategoryModalOpen(false)}
        className="category-modal-content"
      >
          <h2>{selectedCategory && (t[categoryKeys[selectedCategory]?.title] || selectedCategory)}</h2>
          <p>{selectedCategory && t[categoryKeys[selectedCategory]?.desc]}</p>
          <hr className="modal-divider" />
          
          <h3>{t.modalProductsTitle}</h3>
          
          <div className="modal-search-container">
              <input 
                  type="search" 
                  placeholder={t.modalSearchPlaceholder} 
                  value={modalSearchTerm} 
                  onChange={e => setModalSearchTerm(e.target.value)} 
              />
          </div>
          
          <div className="modal-product-grid">
              {getModalProducts().map(p => (
                  <div 
                    key={p.id} 
                    className="modal-product-item" 
                    onClick={() => { setSelectedProductDetail(p); setProductDetailOpen(true); }}
                  >
                      <img src={p.imgSrc} onError={(e) => e.target.style.display='none'} alt={p.display} />
                      <p>{p.display}</p>
                  </div>
              ))}
          </div>
          
          <a href="#contact" className="cta-button modal-cta" onClick={(e) => { 
              e.preventDefault(); 
              setCurrentInquiry({ type: 'category', id: selectedCategory }); 
              setCategoryModalOpen(false); 
              handleSmoothScroll(e, 'contact'); 
          }}>
              {t.modalCTA}
          </a>
      </Modal>

      {/* 2. Modal Detail Produk */}
      <Modal
        isOpen={productDetailOpen}
        onClose={() => setProductDetailOpen(false)}
        className="product-detail-content"
      >
          <img src={selectedProductDetail?.imgSrc} id="productDetailImage" alt="Detail" />
          <h3>{selectedProductDetail?.display}</h3>
          
          <a href="#contact" className="cta-button modal-cta" onClick={(e) => { 
              e.preventDefault(); 
              setCurrentInquiry({ 
                  type: 'product', 
                  id: selectedProductDetail.id, 
                  category: selectedCategory 
              }); 
              setProductDetailOpen(false); 
              setCategoryModalOpen(false); 
              handleSmoothScroll(e, 'contact'); 
          }}>
              {t.productDetailCTA}
          </a>
      </Modal>

    </>
  );
}