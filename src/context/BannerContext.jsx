import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getBanners as apiGetBanners,
  createBanner as apiCreateBanner,
  updateBanner as apiUpdateBanner,
  deleteBanner as apiDeleteBanner,
} from '../api/banners';

const BannerContext = createContext();

export const useBanner = () => {
  return useContext(BannerContext);
};

const fallbackBanners = [
  {
    id: 1,
    title: 'Khuyến mãi hạt giống mùa hè',
    link: '/category/hat-giong',
    image: 'https://images.unsplash.com/photo-1592424001806-646a7df118ea?q=80&w=1200&auto=format&fit=crop',
    bannerType: 'FORUM',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Phân bón hữu cơ giảm 20%',
    link: '/category/phan-bon-huu-co',
    image: 'https://images.unsplash.com/photo-1592862024794-0cf16e917d5c?q=80&w=1200&auto=format&fit=crop',
    bannerType: 'FORUM',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const normalizeBanner = (b) => ({
  ...b,
  image: b.imageUrl ?? b.image ?? '',
  imageUrl: b.imageUrl ?? b.image ?? '',
  link: b.linkUrl ?? b.link ?? '',
  linkUrl: b.linkUrl ?? b.link ?? '',
  bannerType: b.bannerType ?? 'FORUM',
  order: Number(b.displayOrder ?? b.order ?? 1),
  displayOrder: Number(b.displayOrder ?? b.order ?? 1),
  isActive: b.isActive ?? b.active ?? true,
});

const toBannerPayload = (data) => ({
  title: data.title ?? '',
  imageUrl: data.imageUrl ?? data.image ?? '',
  linkUrl: data.linkUrl ?? data.link ?? '',
  bannerType: data.bannerType ?? 'FORUM',
  displayOrder: Number(data.displayOrder ?? data.order ?? 1),
  isActive: data.isActive ?? true,
});

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState(fallbackBanners);

  const fetchBanners = useCallback(async (params = {}) => {
    try {
      const response = await apiGetBanners(params);
      const list = response?.content ?? (Array.isArray(response) ? response : null);
      if (Array.isArray(list)) {
        setBanners(list.map(normalizeBanner).sort((a, b) => (a.order ?? 1) - (b.order ?? 1)));
      }
    } catch (err) {
      console.warn('[BannerContext] Banners API unavailable, using fallback:', err.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchBanners());
  }, [fetchBanners]);

  const addBanner = async (bannerData) => {
    const created = await apiCreateBanner(toBannerPayload(bannerData));
    const normalized = normalizeBanner(created);
    setBanners((prev) => [...prev, normalized].sort((a, b) => a.order - b.order));
    return normalized;
  };

  const updateBanner = async (id, updatedData) => {
    const updated = await apiUpdateBanner(id, toBannerPayload(updatedData));
    const normalized = normalizeBanner(updated);
    setBanners((prev) =>
      prev.map((banner) => (banner.id === id ? normalized : banner))
        .sort((a, b) => a.order - b.order)
    );
    return normalized;
  };

  const deleteBanner = async (id) => {
    await apiDeleteBanner(id);
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  const toggleBannerStatus = async (id) => {
    const target = banners.find((b) => b.id === id);
    if (!target) return;
    return updateBanner(id, { ...target, isActive: !target.isActive });
  };

  const value = {
    banners,
    fetchBanners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};
