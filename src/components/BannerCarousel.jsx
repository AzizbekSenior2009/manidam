import React, { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import { useProducts } from '../context/ProductsContext';
import bannerGiftsImg from '../assets/images/banner_gifts.svg';
import laganImg from '../assets/images/lagan.svg';
import earbudsImg from '../assets/images/earbuds.svg';
import './BannerCarousel.css';

export default function BannerCarousel() {
  const { t } = useLang();
  const { setSelectedCategory } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: t('home.autumnDiscountTitle'),
      subtitle: t('home.autumnDiscountSubtitle'),
      buttonText: t('home.shopNow'),
      image: bannerGiftsImg,
      action: () => setSelectedCategory('all')
    },
    {
      id: 2,
      tag: "MILLIY SAN'AT",
      subtitle: "Rishton sopol idishlariga -25%",
      buttonText: t('home.shopNow'),
      image: laganImg,
      action: () => setSelectedCategory('pottery')
    },
    {
      id: 3,
      tag: "YANGI AVLOD",
      subtitle: "Zamonaviy gadjet va aksessuarlar",
      buttonText: t('home.shopNow'),
      image: earbudsImg,
      action: () => setSelectedCategory('accessories')
    }
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[currentSlide];

  return (
    <div className="banner-carousel-container">
      <div className="banner-card" onClick={active.action}>
        {/* Decorative gold frame trim */}
        <div className="banner-gold-rim"></div>

        <div className="banner-content">
          <div className="banner-text-col">
            <h2 className="banner-tag font-serif">{active.tag}</h2>
            <p className="banner-subtitle">{active.subtitle}</p>
            <button
              type="button"
              className="banner-cta-btn"
              onClick={(e) => {
                e.stopPropagation();
                active.action();
              }}
            >
              {active.buttonText}
            </button>
          </div>

          <div className="banner-img-col">
            <img
              src={active.image}
              alt="Promotion illustration"
              className="banner-illustration"
            />
          </div>
        </div>

        {/* Carousel pagination dots */}
        <div className="banner-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`banner-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
