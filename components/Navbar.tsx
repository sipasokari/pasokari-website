import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Translations } from '../types';

interface NavbarProps {
  t: Translations;
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  onSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  activeSection: string;
}

export default function Navbar({ t, lang, setLang, onSmoothScroll, activeSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownOpen && langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langDropdownOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobileMenuOpen(false); setLangDropdownOpen(false); } };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
      onSmoothScroll(e, section);
      setMobileMenuOpen(false);
  }

  return (
    <header className="navbar">
        <div className="nav-left">
          <a href="#home" className="logo-container" onClick={(e) => handleNavClick(e, 'home')}>
            <Image src="/assets/logo.png" className="logo" alt="Logo" width={100} height={38} /> <span className="brand-name">PASOKARI</span>
          </a>
        </div>
        
        <nav className="nav-center">
          {['home', 'products', 'gallery', 'about', 'contact'].map(item => (
             <a key={item} href={`#${item}`} className={activeSection === item ? 'active' : ''} onClick={(e) => handleNavClick(e, item)}>
                {t[`nav${item.charAt(0).toUpperCase() + item.slice(1)}`]}
             </a>
          ))}
        </nav>

        <div className="nav-right">
            {/* Language Switcher Tanpa Separator & Toggle Tema */}
            <div className="language-switcher" ref={langRef}>
                <button className="lang-btn" onClick={() => setLangDropdownOpen(!langDropdownOpen)} aria-label="Pilih bahasa">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <span>{lang.toUpperCase()}</span>
                    <svg className="caret-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                <div className={`lang-dropdown ${langDropdownOpen ? 'active' : ''}`}>
                    <button className="lang-option" onClick={() => {setLang('id'); setLangDropdownOpen(false);}}>
                        <span className="flag-icon">🇮🇩</span> <span>Indonesia</span>
                    </button>
                    <button className="lang-option" onClick={() => {setLang('en'); setLangDropdownOpen(false);}}>
                        <span className="flag-icon">🇺🇸</span> <span>English</span>
                    </button>
                </div>
            </div>

            <button className={`menu-toggle ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <span></span><span></span><span></span>
            </button>
        </div>
        
        <nav className={`nav-mobile ${mobileMenuOpen ? 'active' : ''}`}>
            {['home', 'products', 'gallery', 'about', 'contact'].map(item => (
                <a key={item} href={`#${item}`} onClick={(e) => handleNavClick(e, item)}>{t[`nav${item.charAt(0).toUpperCase() + item.slice(1)}`]}</a>
            ))}
        </nav>
    </header>
  );
}