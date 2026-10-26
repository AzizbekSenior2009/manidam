import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import BottomNav from '../components/BottomNav';
import { useProducts } from '../context/ProductsContext';
import { useLang } from '../context/LangContext';
import './Home.css';

export default function Home() {
  const { filteredProducts, searchQuery, selectedCategory } = useProducts();
  const { t } = useLang();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // When selectedCategory changes, reset scroll to top immediately
  React.useEffect(() => {
    const pageEl = document.querySelector('.page-container');
    if (pageEl) {
      pageEl.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedCategory]);

  return (
    <div className="home-page-wrapper">
      <StatusBar />
      <Header onOpenFilter={() => setFilterModalOpen(prev => !prev)} />

      <main className="page-container">
        {/* Banner Carousel */}
        {!searchQuery && <BannerCarousel />}

        {/* Categories Carousel */}
        <CategoryCarousel />

        {/* Products Grid */}
        <section className="products-grid-section" aria-label="Products">
          {filteredProducts.length === 0 ? (
            <div className="empty-products-state">
              <p>{t('home.noProductsFound')}</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showFullAddBtn={product.id === '2'}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
