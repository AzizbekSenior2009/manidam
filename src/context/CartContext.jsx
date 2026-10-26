import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const CartContext = createContext();

const STORAGE_KEY = 'manidam_cart';
const COUPON_KEY = 'manidam_coupon';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial cart matching mockup 4
    // Mockup 4: Sopol lagan 33 500 so'm (1x) + Smartfon 23 000 so'm (1x) = 56 500 so'm
    return [
      {
        id: '1',
        name: "Sopol lagan (milliy)",
        price: 33500,
        image: INITIAL_PRODUCTS[0]?.image || '',
        quantity: 1
      },
      {
        id: '2',
        name: "Smartfon",
        price: 23000,
        image: INITIAL_PRODUCTS[1]?.image || '',
        quantity: 1
      }
    ];
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(COUPON_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  }, [coupon]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => String(item.id) === String(product.id));
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: String(product.id),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => String(item.id) !== String(productId)));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (String(item.id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const setItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (String(item.id) === String(productId) ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MANIDAM10' || clean === 'KUZ30' || clean === 'BONUS') {
      const discountPct = clean === 'KUZ30' ? 30 : 10;
      setCoupon({ code: clean, percent: discountPct });
      return { success: true, percent: discountPct };
    }
    return { success: false, message: 'Invalid code' };
  };

  const clearPromoCode = () => {
    setCoupon(null);
  };

  // Calculations
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const deliveryFee = 0; // Free delivery
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        discountAmount,
        deliveryFee,
        totalAmount,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        setItemQuantity,
        clearCart,
        applyPromoCode,
        clearPromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
