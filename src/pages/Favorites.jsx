import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductsContext';
import { useLang } from '../context/LangContext';
import './Favorites.css';

export default function Favorites() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { favoriteIds } = useFavorites();
  const { products } = useProducts();

  const favoriteProducts = products.filter(p => favoriteIds.includes(String(p.id)));

  return (
    <div className="favorites-page-wrapper">
      <StatusBar />

      <header className="favorites-top-bar">
        <h1 className="favorites-page-title">{t('favorites.title')}</h1>
      </header>

      <main className="page-container">
        {favoriteProducts.length === 0 ? (
          <div className="favorites-empty-view">
            <div className="empty-fav-icon-circle">
              <Heart size={40} className="gold-text" strokeWidth={1.5} />
            </div>
            <h2>{t('favorites.emptyTitle')}</h2>
            <p>{t('favorites.emptySubtitle')}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/home')}
              style={{ maxWidth: '200px', marginTop: '12px' }}
            >
              {t('cart.startShopping')}
            </button>
          </div>
        ) : (
          <div className="favorites-grid-wrap">
            <div className="products-grid">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showFullAddBtn={true} // In Mockup 5, every card has the full "Savatga qo'shish" gold pill button!
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
