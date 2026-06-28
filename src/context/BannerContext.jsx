import { createContext, useContext, useState } from 'react';

const BannerContext = createContext();

export const useBanner = () => {
  return useContext(BannerContext);
};

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Khuyến mãi hạt giống mùa hè',
      link: '/category/hat-giong',
      image: 'https://images.unsplash.com/photo-1592424001806-646a7df118ea?q=80&w=1200&auto=format&fit=crop',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Phân bón hữu cơ giảm 20%',
      link: '/category/phan-bon-huu-co',
      image: 'https://images.unsplash.com/photo-1592862024794-0cf16e917d5c?q=80&w=1200&auto=format&fit=crop',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const addBanner = (bannerData) => {
    const newBanner = {
      ...bannerData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setBanners((prev) => [...prev, newBanner].sort((a, b) => a.order - b.order));
  };

  const updateBanner = (id, updatedData) => {
    setBanners((prev) => 
      prev.map(banner => banner.id === id ? { ...banner, ...updatedData } : banner)
          .sort((a, b) => a.order - b.order)
    );
  };

  const deleteBanner = (id) => {
    setBanners((prev) => prev.filter(banner => banner.id !== id));
  };

  const toggleBannerStatus = (id) => {
    setBanners((prev) => 
      prev.map(banner => banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)
    );
  };

  const value = {
    banners,
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
