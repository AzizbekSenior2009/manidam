const STORAGE_KEY = 'manidam_products';

// Default to 0 products as requested: "mahsulotlar defolt 0 ta tursun man uzim qoshman"
const DEFAULT_PRODUCTS = [];

// In-memory fallback if localStorage quota is exceeded
let memoryProducts = null;

const safeSave = (products) => {
  memoryProducts = products;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (err) {
    console.warn('LocalStorage quota exceeded! Keeping products in memory', err);
    // Try to remove oldest products or large images if quota exceeded
    try {
      const lightweight = products.slice(0, 15).map(p => ({
        ...p,
        images: [p.image] // keep only main image
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch (e2) {
      console.warn('Could not save even lightweight products', e2);
    }
    return false;
  }
};

export const productService = {
  getProducts: () => {
    if (memoryProducts) {
      return memoryProducts;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryProducts = parsed;
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    memoryProducts = DEFAULT_PRODUCTS;
    return DEFAULT_PRODUCTS;
  },

  getProductById: (id) => {
    const products = productService.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  addProduct: (newProduct) => {
    const products = productService.getProducts();
    const product = {
      ...newProduct,
      id: Date.now().toString(),
      rating: newProduct.rating || 5.0,
      ratingCount: newProduct.ratingCount || 1,
      stock: Number(newProduct.stock) || 1,
      price: Number(newProduct.price) || 0,
      oldPrice: Number(newProduct.oldPrice) || 0,
      discount: newProduct.discount ? Number(newProduct.discount) : 0,
      createdAt: new Date().toISOString()
    };
    const updated = [product, ...products];
    safeSave(updated);
    return product;
  },

  updateProduct: (id, updates) => {
    const products = productService.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    safeSave(updated);
    return updated.find(p => p.id === id);
  },

  deleteProduct: (id) => {
    const products = productService.getProducts();
    const updated = products.filter(p => p.id !== id);
    safeSave(updated);
    return true;
  },

  /**
   * Deduct stock upon purchase.
   * "va soni ni yozib qoyman nichita qolgan nin va u tugasa uuchib kerttadi shunnaqa"
   * If stock reaches 0 or less, the product is removed from catalog!
   */
  deductStock: (orderItems) => {
    if (!orderItems || !orderItems.length) return;
    const products = productService.getProducts();
    const updated = [];

    for (const prod of products) {
      const purchased = orderItems.find(it => String(it.id) === String(prod.id));
      if (purchased) {
        const remainingStock = (Number(prod.stock) || 0) - (Number(purchased.quantity) || 1);
        if (remainingStock > 0) {
          updated.push({
            ...prod,
            stock: remainingStock
          });
        } else {
          // Stock finished: automatically removed ("u tugasa o'chib ketadi")
          console.log(`Product ${prod.name} (#${prod.id}) stock finished, removed from catalog.`);
        }
      } else {
        updated.push(prod);
      }
    }

    safeSave(updated);
    return updated;
  },

  resetToDefault: () => {
    safeSave([]);
    return [];
  }
};
