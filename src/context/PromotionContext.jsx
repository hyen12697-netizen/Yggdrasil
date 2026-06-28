import { createContext, useState, useContext, useEffect } from 'react';

const PromotionContext = createContext();

export const usePromotion = () => useContext(PromotionContext);

const initialPromotions = [
  {
    id: 1,
    title: 'Khuyến mãi Hè Xanh',
    description: 'Giảm giá cực mạnh các loại phân bón hữu cơ chào đón mùa hè.',
    type: 'percentage', // 'percentage' hoặc 'fixed'
    value: 20, // 20%
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    status: 'active', // 'active', 'paused', 'expired'
    targetType: 'category', // 'all', 'category', 'product'
    targetCategories: ['Phân bón hữu cơ'],
    targetProducts: [],
    isActive: true
  },
  {
    id: 2,
    title: 'Trợ giá mùa bão',
    description: 'Giảm trực tiếp 50k cho tất cả các đơn hàng thuộc dòng thuốc bảo vệ thực vật.',
    type: 'fixed',
    value: 50000,
    startDate: '2026-06-15',
    endDate: '2026-08-15',
    status: 'active',
    targetType: 'category',
    targetCategories: ['Thuốc bảo vệ thực vật'],
    targetProducts: [],
    isActive: true
  }
];

export const PromotionProvider = ({ children }) => {
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_promotions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialPromotions;
      }
    }
    return initialPromotions;
  });

  useEffect(() => {
    localStorage.setItem('yggdrasil_promotions', JSON.stringify(promotions));
  }, [promotions]);

  const addPromotion = (promo) => {
    const newPromo = {
      ...promo,
      id: Date.now(),
      status: promo.isActive ? 'active' : 'paused'
    };
    setPromotions(prev => [newPromo, ...prev]);
  };

  const updatePromotion = (id, updatedData) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedData,
          status: updatedData.isActive !== undefined ? (updatedData.isActive ? 'active' : 'paused') : p.status
        };
      }
      return p;
    }));
  };

  const deletePromotion = (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  const togglePromotionStatus = (id) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        const newIsActive = !p.isActive;
        return { ...p, isActive: newIsActive, status: newIsActive ? 'active' : 'paused' };
      }
      return p;
    }));
  };

  // Helper để lấy tất cả các khuyến mãi đang chạy (đang active và trong thời hạn hợp lệ)
  const getActivePromotions = () => {
    const today = new Date().toISOString().split('T')[0];
    return promotions.filter(p => {
      if (!p.isActive) return false;
      if (p.startDate && p.startDate > today) return false;
      if (p.endDate && p.endDate < today) return false;
      return true;
    });
  };

  return (
    <PromotionContext.Provider value={{
      promotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
      togglePromotionStatus,
      getActivePromotions
    }}>
      {children}
    </PromotionContext.Provider>
  );
};
