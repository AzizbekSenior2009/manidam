import React from 'react';
import {
  LayoutGrid,
  Smartphone,
  WashingMachine,
  Shirt,
  Sparkles,
  Headphones
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductsContext';
import { useLang } from '../context/LangContext';
import './CategoryCarousel.css';

export default function CategoryCarousel() {
  const { selectedCategory, setSelectedCategory } = useProducts();
  const { t } = useLang();
  const trackRef = React.useRef(null);
  const isDownRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);

  // Mouse drag-to-scroll support for desktop
  const handleMouseDown = (e) => {
    isDownRef.current = true;
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Mouse wheel horizontal scroll
  const handleWheel = (e) => {
    if (trackRef.current && e.deltaY !== 0) {
      trackRef.current.scrollLeft += e.deltaY;
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'all':
        return <LayoutGrid size={22} strokeWidth={1.8} />;
      case 'phones':
        return <Smartphone size={22} strokeWidth={1.8} />;
      case 'appliances':
        return <WashingMachine size={22} strokeWidth={1.8} />;
      case 'clothing':
        return <Shirt size={22} strokeWidth={1.8} />;
      case 'pottery':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2h4M9 2v3c0 2-2 3-2 5v9a3 3 0 003 3h4a3 3 0 003-3v-9c0-2-2-3-2-5V2" />
            <ellipse cx="12" cy="14" rx="4" ry="2" />
          </svg>
        );
      case 'accessories':
        return <Headphones size={22} strokeWidth={1.8} />;
      default:
        return <Sparkles size={22} strokeWidth={1.8} />;
    }
  };

  return (
    <div className="category-carousel-section">
      <div
        className="category-scroll-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className={`category-icon-circle ${isActive ? 'active-ring' : ''}`}>
                {getCategoryIcon(cat.id)}
              </div>
              <span className="category-label">
                {t(`home.${cat.key}`, cat.name)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
