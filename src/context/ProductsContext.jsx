import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => productService.getProducts());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshProducts = () => {
    const list = productService.getProducts();
    setProducts(list);
  };

  const addProduct = (productData) => {
    const created = productService.addProduct(productData);
    setProducts(prev => [created, ...prev]);
    return created;
  };

  const updateProduct = (id, updates) => {
    const updated = productService.updateProduct(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return updated;
  };

  const deleteProduct = (id) => {
    productService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Filtered products calculation
  const filteredProducts = products.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesQuery;
  });

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
