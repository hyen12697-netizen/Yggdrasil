import { createContext, useContext, useState, useEffect } from 'react';

const HeroBannerContext = createContext();

export const useHeroBanner = () => {
  return useContext(HeroBannerContext);
};

export const HeroBannerProvider = ({ children }) => {
  const [heroBanners, setHeroBanners] = useState(() => {
    const saved = localStorage.getItem('heroBanners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Lỗi khi tải hero banners từ localStorage:', error);
      }
    }
    // Dữ liệu mặc định nếu chưa có
    return [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1592424001806-538421319246?auto=format&fit=crop&q=80&w=2000',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1592862024794-0cf16e917d5c?auto=format&fit=crop&q=80&w=2000',
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('heroBanners', JSON.stringify(heroBanners));
  }, [heroBanners]);

  const addHeroBanner = (bannerData) => {
    const newBanner = {
      id: Date.now(),
      image: bannerData.image,
      createdAt: new Date().toISOString()
    };
    setHeroBanners((prev) => [...prev, newBanner]);
  };

  const updateHeroBanner = (id, updatedData) => {
    setHeroBanners((prev) => 
      prev.map(banner => banner.id === id ? { ...banner, image: updatedData.image } : banner)
    );
  };

  const deleteHeroBanner = (id) => {
    setHeroBanners((prev) => prev.filter(banner => banner.id !== id));
  };

  const duplicateHeroBanner = (id) => {
    setHeroBanners((prev) => {
      const bannerToCopy = prev.find(b => b.id === id);
      if (!bannerToCopy) return prev;
      
      const newBanner = {
        id: Date.now(),
        image: bannerToCopy.image,
        createdAt: new Date().toISOString()
      };
      
      // Chèn ngay sau banner được copy
      const index = prev.findIndex(b => b.id === id);
      const newBanners = [...prev];
      newBanners.splice(index + 1, 0, newBanner);
      return newBanners;
    });
  };

  const value = {
    heroBanners,
    setHeroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    duplicateHeroBanner
  };

  return (
    <HeroBannerContext.Provider value={value}>
      {children}
    </HeroBannerContext.Provider>
  );
};
