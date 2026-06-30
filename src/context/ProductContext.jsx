import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories as initialCategories, brands as initialBrands } from '../data/mockData';

const ProductContext = createContext();

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ygg_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(p => {
        if (p.stock === undefined) {
          const initP = initialProducts.find(ip => ip.id === p.id);
          return { ...p, stock: initP ? initP.stock : 100 };
        }
        return p;
      });
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('ygg_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: if saved categories are strings, convert them to objects
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map((catName, idx) => ({
          id: `cat_${idx}`,
          name: catName,
          description: '',
          image: '',
          order: idx,
          isActive: true
        }));
      }
      return parsed;
    }
    return initialCategories;
  });

  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('ygg_brands');
    if (saved) return JSON.parse(saved);
    return initialBrands;
  });

  useEffect(() => {
    localStorage.setItem('ygg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ygg_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ygg_brands', JSON.stringify(brands));
  }, [brands]);

  // --- Product Actions ---
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      soldCount: 0,
      rating: 5,
      isNew: true
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedData };
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- Category Actions ---
  const addCategory = (category) => {
    setCategories(prev => [...prev, { ...category, id: `cat_${Date.now()}` }]);
  };

  const updateCategory = (id, updatedData) => {
    setCategories(prev => {
      const oldCat = prev.find(c => c.id === id);
      if (!oldCat) return prev;
      
      const newName = updatedData.name || oldCat.name;
      // Sync products if name changed
      if (newName !== oldCat.name) {
        setProducts(allProds => allProds.map(p => p.category === oldCat.name ? { ...p, category: newName } : p));
      }

      return prev.map(c => c.id === id ? { ...c, ...updatedData } : c);
    });
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const toggleCategoryStatus = (id) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  // --- Brand Actions ---
  const addBrand = (brand) => {
    setBrands(prev => [...prev, { ...brand, id: `brand_${Date.now()}` }]);
  };

  const updateBrand = (id, updatedData) => {
    setBrands(prev => {
      const oldBrand = prev.find(b => b.id === id);
      if (!oldBrand) return prev;

      const newName = updatedData.name || oldBrand.name;
      // Sync products if name changed
      if (newName !== oldBrand.name) {
        setProducts(allProds => allProds.map(p => p.brand === oldBrand.name ? { ...p, brand: newName } : p));
      }

      return prev.map(b => b.id === id ? { ...b, ...updatedData } : b);
    });
  };

  const deleteBrand = (id) => {
    const brandToDelete = brands.find(b => b.id === id);
    if (!brandToDelete) return;
    
    // Check if any product is using this brand
    const isUsed = products.some(p => p.brand === brandToDelete.name);
    if (isUsed) {
      throw new Error('Không thể xóa vì vẫn còn sản phẩm thuộc thương hiệu này.');
    }

    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const toggleBrandStatus = (id) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const value = {
    products,
    categories,
    brands,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandStatus
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
