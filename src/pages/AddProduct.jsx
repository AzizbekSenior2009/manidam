import React, { useState } from 'react';
import { ChevronLeft, Camera, UploadCloud, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useLang } from '../context/LangContext';
import { CATEGORIES } from '../data/categories';
import laganImg from '../assets/images/lagan.svg';
import phoneImg from '../assets/images/smartphone.svg';
import teapotImg from '../assets/images/teapot.svg';
import earbudsImg from '../assets/images/earbuds.svg';
import { compressImage } from '../utils/imageCompressor';
import './AddProduct.css';

const PRESET_IMAGES = [
  { name: 'Sopol lagan', src: laganImg },
  { name: 'Smartfon', src: phoneImg },
  { name: 'Choynak', src: teapotImg },
  { name: 'Quloqchin', src: earbudsImg }
];

export default function AddProduct() {
  const navigate = useNavigate();
  const { adminUnlocked } = useAuth();
  const { addProduct } = useProducts();
  const { t } = useLang();

  // Protected route
  if (!adminUnlocked) {
    navigate('/admin-login');
    return null;
  }

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('phones');
  const [location, setLocation] = useState("Toshkent, O'zbekiston");
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([null, null, null, null]);
  const [successToast, setSuccessToast] = useState(false);

  // Auto-calculate discount % when price & oldPrice change
  const handlePriceChange = (newPriceVal) => {
    setPrice(newPriceVal);
    const p = parseFloat(newPriceVal);
    const op = parseFloat(oldPrice);
    if (p && op && op > p) {
      const calcDiscount = Math.round(((op - p) / op) * 100);
      setDiscount(calcDiscount.toString());
    }
  };

  const handleOldPriceChange = (newOldPriceVal) => {
    setOldPrice(newOldPriceVal);
    const p = parseFloat(price);
    const op = parseFloat(newOldPriceVal);
    if (p && op && op > p) {
      const calcDiscount = Math.round(((op - p) / op) * 100);
      setDiscount(calcDiscount.toString());
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 500, 500, 0.75);
      if (compressed) {
        setImagePreview(compressed);
      }
    }
  };

  const handleExtraFileChange = async (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 400, 400, 0.7);
      if (compressed) {
        const updated = [...extraPhotos];
        updated[index] = compressed;
        setExtraPhotos(updated);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const allImages = [imagePreview || phoneImg, ...extraPhotos.filter(Boolean)];

    const newProduct = {
      name: name.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : Number(price),
      discount: discount ? Number(discount) : 0,
      stock: Number(stock) || 10,
      category,
      location,
      description: description.trim() || `${name} original mahsulot. Kafolat bor.`,
      image: imagePreview || phoneImg,
      images: allImages.length > 0 ? allImages : [phoneImg],
      rating: 5.0,
      ratingCount: 1
    };

    addProduct(newProduct);
    setSuccessToast(true);

    setTimeout(() => {
      navigate('/home');
    }, 1200);
  };

  return (
    <div className="add-product-page-wrapper">
      <StatusBar />

      {/* Header */}
      <header className="add-product-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate('/admin')}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="add-product-page-title">Mahsulot qo'shish</h1>
        <div className="header-spacer-right"></div>
      </header>

      <main className="page-container">
        <div className="add-product-intro-text">
          <p>Yangi tovar joylash va narxlash bo'limi.</p>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Dashed Image Upload Box with camera icon */}
          <div className="image-upload-wrapper">
            <label className="image-upload-dashed-box" htmlFor="product-file-input">
              {imagePreview ? (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="Preview" className="uploaded-preview-img" />
                  <div className="change-photo-badge">
                    <Camera size={14} />
                    <span>Rasmni almashtirish</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder-content">
                  <Camera size={34} className="gold-text" />
                  <span className="upload-text">Rasm yuklash</span>
                  <small className="upload-hint">(bir nechta rasm)</small>
                </div>
              )}
            </label>
            <input
              id="product-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* 4 Extra Photo Slots matching Mockup 9 */}
            <div className="extra-photos-slots-row">
              {extraPhotos.map((photo, idx) => (
                <label key={idx} className="extra-photo-slot" htmlFor={`extra-file-${idx}`}>
                  {photo ? (
                    <img src={photo} alt={`Extra ${idx}`} className="extra-slot-img" />
                  ) : (
                    <span className="slot-plus-text">+</span>
                  )}
                  <input
                    id={`extra-file-${idx}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleExtraFileChange(idx, e)}
                    style={{ display: 'none' }}
                  />
                </label>
              ))}
            </div>

            {/* Quick preset selector */}
            <div className="preset-images-strip">
              <span className="preset-label">Tayyor rasmlar:</span>
              <div className="preset-buttons">
                {PRESET_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className="preset-btn"
                    onClick={() => setImagePreview(img.src)}
                  >
                    <img src={img.src} alt={img.name} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields matching Mockup 9 */}
          <div className="form-card">
            {/* Mahsulot nomi */}
            <div className="form-group">
              <label>Mahsulot nomi *</label>
              <input
                type="text"
                placeholder="Masalan: iPhone 15"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Price & Old Price Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label>Narxi *</label>
                <input
                  type="number"
                  placeholder="12000000"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Eski narxi</label>
                <input
                  type="number"
                  placeholder="15000000"
                  value={oldPrice}
                  onChange={(e) => handleOldPriceChange(e.target.value)}
                />
              </div>
            </div>

            {/* Discount & Stock Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label>Chegirma %</label>
                <input
                  type="number"
                  placeholder="20"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Qancha qolgan?</label>
                <input
                  type="number"
                  placeholder="10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="form-group">
              <label>Mahsulot turi</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div className="form-group">
              <label>Qayerda?</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="Toshkent">Toshkent</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Farg'ona">Farg'ona</option>
                <option value="Namangan">Namangan</option>
                <option value="Andijon">Andijon</option>
                <option value="Xorazm">Xorazm</option>
                <option value="Qashqadaryo">Qashqadaryo</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label>{t('addProductForm.description')}</label>
              <textarea
                rows={4}
                placeholder={t('addProductForm.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button: "Sotuvga chiqarish" */}
          <div className="form-submit-wrap">
            <button type="submit" className="btn-primary add-product-submit-btn">
              {t('addProductForm.submitBtn')}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />

      {/* Success Notification */}
      {successToast && (
        <div className="floating-toast animate-fade-in">
          <CheckCircle2 size={18} className="gold-text" />
          <span>{t('addProductForm.successMsg')}</span>
        </div>
      )}
    </div>
  );
}
