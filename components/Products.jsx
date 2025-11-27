'use client';
import { useState } from 'react';

export default function Products({ t, categoryData, onOpenModal, categoryKeys }) {
  const [showAll, setShowAll] = useState(false);

  const allCategories = Object.keys(categoryData);
  // Tampilkan 3 kategori jika showAll false, tampilkan semua jika true
  const visibleCategories = showAll ? allCategories : allCategories.slice(0, 3);

  const getCategoryImg = (cat) => {
      const map = { 
        'Sayuran': 'sayuran.jpg', 
        'Herbs & Spices': 'herbs_spices.jpg', 
        'Buah-buahan': 'buah_buahan.jpg', 
        'Bahan Pangan Lain': 'bahan_pangan_lain.jpg', 
        'Frozen Food': 'frozen_food.jpg' 
      };
      return `/assets/categories/${map[cat]}`;
  };

  const handle3DTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * -12;
    const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const reset3DTilt = (e) => e.currentTarget.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;

  return (
    <section id="products" className="section-container">
      <h2 className="section-title" style={{ textAlign: 'center' }}>{t.productsTitle}</h2>
      
      <div className="product-grid">
        {visibleCategories.map((cat) => (
            <div 
              key={cat} 
              className="product-card" 
              onClick={() => onOpenModal(cat)} 
              onMouseMove={handle3DTilt} 
              onMouseLeave={reset3DTilt}
            >
                <img src={getCategoryImg(cat)} alt={cat} loading="lazy" />
                {/* Gunakan mapping categoryKeys dari parent untuk judul */}
                <h3>{t[categoryKeys[cat]?.title] || cat}</h3>
            </div>
        ))}
      </div>

      {/* Tombol Load More / Less - Hanya muncul jika kategori lebih dari 3 */}
      {allCategories.length > 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', width: '100%' }}>
           <button 
             className="cta-button secondary" 
             onClick={() => setShowAll(!showAll)}
           >
             {/* Logika Dual Bahasa */}
             {showAll 
                ? (t.showLess || "Tampilkan Lebih Sedikit") 
                : (t.showMore || "Lihat Lebih Banyak")}
           </button>
        </div>
      )}

    </section>
  );
}