import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  getPromotions as apiGetPromotions,
  createPromotion as apiCreatePromotion,
  updatePromotion as apiUpdatePromotion,
  deletePromotion as apiDeletePromotion,
  togglePromotionActive as apiTogglePromotionActive,
} from '../api/promotions';
import { tokenStorage } from '../api/axiosClient';

const PromotionContext = createContext();

export const usePromotion = () => useContext(PromotionContext);

const normalizePromotion = (p) => {
  if (!p) return null;
  const discountType = p.discountType ?? (p.type === 'fixed' ? 'FIXED_AMOUNT' : 'PERCENTAGE');
  const isPercentage = discountType === 'PERCENTAGE' || p.type === 'percentage';
  const isActive = p.isActive ?? p.active ?? true;
  const value = Number(p.discountValue ?? p.value ?? 0);

  return {
    ...p,
    code: p.code ?? '',
    name: p.name ?? p.title ?? '',
    title: p.title ?? p.name ?? p.code ?? '',
    description: p.description ?? (p.minOrderAmount ? `Đơn tối thiểu ${Number(p.minOrderAmount).toLocaleString('vi-VN')}đ` : ''),
    discountType,
    discountValue: value,
    type: isPercentage ? 'percentage' : 'fixed',
    value,
    minOrderAmount: Number(p.minOrderAmount ?? 0),
    maxDiscountAmount: p.maxDiscountAmount != null ? Number(p.maxDiscountAmount) : null,
    usageCount: Number(p.usageCount ?? 0),
    usageLimit: p.usageLimit != null ? Number(p.usageLimit) : null,
    startDate: p.startDate ? String(p.startDate).slice(0, 10) : '',
    endDate: p.endDate ? String(p.endDate).slice(0, 10) : '',
    isActive,
    status: isActive ? 'active' : 'paused',
    targetType: p.targetType ?? 'all',
    targetCategories: p.targetCategories ?? [],
    targetProducts: p.targetProducts ?? [],
  };
};

const toPromotionPayload = (data) => {
  const isPercentage = data.discountType === 'PERCENTAGE' || data.type === 'percentage';
  return {
    code: (data.code ?? '').trim().toUpperCase(),
    name: (data.name ?? data.title ?? '').trim(),
    discountType: isPercentage ? 'PERCENTAGE' : 'FIXED_AMOUNT',
    discountValue: Number(data.discountValue ?? data.value ?? 0),
    minOrderAmount: data.minOrderAmount !== '' && data.minOrderAmount != null ? Number(data.minOrderAmount) : 0,
    maxDiscountAmount: data.maxDiscountAmount !== '' && data.maxDiscountAmount != null ? Number(data.maxDiscountAmount) : null,
    usageLimit: data.usageLimit !== '' && data.usageLimit != null ? Number(data.usageLimit) : null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isActive: data.isActive ?? true,
  };
};

const isStaffOrManager = () => {
  if (!tokenStorage.get()) return false;
  try {
    const saved = localStorage.getItem('yggdrasil_user');
    const parsed = saved ? JSON.parse(saved) : null;
    const role = parsed?.role?.toUpperCase();
    return role === 'MANAGER' || role === 'STAFF' || role === 'ADMIN';
  } catch {
    return false;
  }
};

export const PromotionProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromotions = useCallback(async (params = {}) => {
    if (!isStaffOrManager()) return;
    setIsLoading(true);
    try {
      const response = await apiGetPromotions({ page: 0, size: 100, ...params });
      const list = response?.content ?? (Array.isArray(response) ? response : []);
      setPromotions(list.map(normalizePromotion).filter(Boolean));
    } catch (err) {
      console.warn('[PromotionContext] Không thể tải danh sách khuyến mãi:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const addPromotion = async (promo) => {
    const created = await apiCreatePromotion(toPromotionPayload(promo));
    const normalized = normalizePromotion(created);
    setPromotions((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updatePromotion = async (id, updatedData) => {
    const updated = await apiUpdatePromotion(id, toPromotionPayload(updatedData));
    const normalized = normalizePromotion(updated);
    setPromotions((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    return normalized;
  };

  const deletePromotion = async (id) => {
    await apiDeletePromotion(id);
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePromotionStatus = async (id) => {
    const updated = await apiTogglePromotionActive(id);
    const normalized = normalizePromotion(updated);
    setPromotions((prev) => prev.map((p) => (p.id === id ? normalized : p)));
    return normalized;
  };

  // Helper để lấy tất cả các khuyến mãi đang chạy (đang active và trong thời hạn hợp lệ)
  const getActivePromotions = () => {
    const today = new Date().toISOString().split('T')[0];
    return promotions.filter((p) => {
      if (!p.isActive) return false;
      if (p.startDate && p.startDate > today) return false;
      if (p.endDate && p.endDate < today) return false;
      return true;
    });
  };

  return (
    <PromotionContext.Provider
      value={{
        promotions,
        isLoading,
        fetchPromotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
        togglePromotionStatus,
        getActivePromotions,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};
