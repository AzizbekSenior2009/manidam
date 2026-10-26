import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Trash2, Check, Home, Building2 } from 'lucide-react';
import './AddressesModal.css';

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    title: 'Uy',
    address: "Toshkent shahar, Yunusobod tumani, 12-mavze, 45-uy",
    landmark: "15-maktab yonida",
    isDefault: true
  },
  {
    id: 'addr-2',
    title: 'Ishxona',
    address: "Toshkent shahar, Mirobod tumani, Nukus ko'chasi, 21-uy",
    landmark: "Rossiya elchixonasi ro'parasi",
    isDefault: false
  }
];

export default function AddressesModal({ isOpen, onClose }) {
  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('manidam_saved_addresses');
      return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
    } catch (e) {
      return DEFAULT_ADDRESSES;
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('Uy');
  const [newAddress, setNewAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('manidam_saved_addresses', JSON.stringify(addresses));
    } catch (e) {}
  }, [addresses]);

  if (!isOpen) return null;

  const handleSelectDefault = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const newAddr = {
      id: 'addr-' + Date.now(),
      title: newTitle.trim() || 'Manzil',
      address: newAddress.trim(),
      landmark: newLandmark.trim(),
      isDefault: addresses.length === 0
    };

    setAddresses([newAddr, ...addresses]);
    setNewAddress('');
    setNewLandmark('');
    setShowAddForm(false);
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="address-modal-header">
          <div className="address-header-left">
            <div className="address-icon-box">
              <MapPin size={20} className="gold-text" />
            </div>
            <div>
              <h2 className="address-modal-title">Yetkazib berish manzillari</h2>
              <span className="address-modal-sub">Buyurtmalaringiz uchun saqlangan manzillar</span>
            </div>
          </div>
          <button type="button" className="notif-close-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        {/* List of Addresses */}
        <div className="address-list-content">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-item-card ${addr.isDefault ? 'active' : ''}`}
              onClick={() => handleSelectDefault(addr.id)}
            >
              <div className="address-type-icon">
                {addr.title.toLowerCase().includes('ish') ? (
                  <Building2 size={20} />
                ) : (
                  <Home size={20} />
                )}
              </div>
              <div className="address-text-col">
                <div className="address-title-row">
                  <strong>{addr.title}</strong>
                  {addr.isDefault && <span className="default-pill">Asosiy manzil</span>}
                </div>
                <p className="address-full-text">{addr.address}</p>
                {addr.landmark && (
                  <small className="address-landmark-text">Mo'ljal: {addr.landmark}</small>
                )}
              </div>
              <button
                type="button"
                className="address-delete-btn"
                onClick={(e) => handleDelete(addr.id, e)}
                title="O'chirish"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {addresses.length === 0 && !showAddForm && (
            <div className="empty-address-box">
              <MapPin size={34} className="gold-text" />
              <p>Hozircha saqlangan manzillar yo'q</p>
            </div>
          )}

          {/* Add Address Form Toggle / Box */}
          {showAddForm ? (
            <form onSubmit={handleAddAddress} className="add-address-form animate-fade-in">
              <h3 className="add-form-heading">Yangi manzil kiritish</h3>
              
              <div className="address-form-field">
                <label>Manzil nomi</label>
                <div className="quick-titles-row">
                  {['Uy', 'Ishxona', 'Ota-onam', 'Boshqa'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`title-pill-btn ${newTitle === name ? 'active' : ''}`}
                      onClick={() => setNewTitle(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="address-form-field">
                <label>To'liq manzil *</label>
                <textarea
                  rows={2}
                  placeholder="Shahar, tuman, ko'cha, uy raqami, xonadon..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                />
              </div>

              <div className="address-form-field">
                <label>Mo'ljal (ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Masalan: 12-maktab yonida"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                />
              </div>

              <div className="add-form-buttons-row">
                <button
                  type="button"
                  className="btn-outline-gold cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary save-btn">
                  Saqlash
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn-add-address-trigger"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={18} />
              <span>Yangi manzil qo'shish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
