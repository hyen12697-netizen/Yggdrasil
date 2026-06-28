import React, { createContext, useContext, useState, useEffect } from 'react';
import { handbookArticles as initialHandbook, handbookCategories as initialCategories } from '../data/handbookData';
// We don't have initial news data yet, so we'll start with empty or basic mock
const initialNews = [
  { id: 1, title: 'Yggdrasil ra mắt phân bón hữu cơ thế hệ mới', summary: 'Sản phẩm hứa hẹn cải thiện năng suất 30%', date: '2023-10-15', content: '<p>Chi tiết...</p>', author: 'Admin' },
  { id: 2, title: 'Hướng dẫn chuẩn bị đất trồng vụ Đông Xuân', summary: 'Các bước cơ bản để vụ mùa bội thu', date: '2023-11-02', content: '<p>Chi tiết...</p>', author: 'Staff 1' }
];

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  // Handbook State
  const [handbookArticles, setHandbookArticles] = useState(() => {
    const saved = localStorage.getItem('ygg_handbook');
    if (saved) return JSON.parse(saved);
    return initialHandbook || [];
  });

  const [handbookCategories, setHandbookCategories] = useState(() => {
    const saved = localStorage.getItem('ygg_handbook_categories');
    if (saved) return JSON.parse(saved);
    return initialCategories || [];
  });

  // News State
  const [newsArticles, setNewsArticles] = useState(() => {
    const saved = localStorage.getItem('ygg_news');
    if (saved) return JSON.parse(saved);
    return initialNews;
  });

  useEffect(() => {
    localStorage.setItem('ygg_handbook', JSON.stringify(handbookArticles));
  }, [handbookArticles]);

  useEffect(() => {
    localStorage.setItem('ygg_handbook_categories', JSON.stringify(handbookCategories));
  }, [handbookCategories]);

  useEffect(() => {
    localStorage.setItem('ygg_news', JSON.stringify(newsArticles));
  }, [newsArticles]);

  // --- Handbook Actions ---
  const addHandbookArticle = (article) => {
    const newArticle = { ...article, id: Date.now().toString() };
    setHandbookArticles(prev => [newArticle, ...prev]);
  };

  const updateHandbookArticle = (id, updatedData) => {
    setHandbookArticles(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteHandbookArticle = (id) => {
    setHandbookArticles(prev => prev.filter(a => a.id !== id));
  };

  // --- News Actions ---
  const addNewsArticle = (article) => {
    const newArticle = { ...article, id: Date.now() };
    setNewsArticles(prev => [newArticle, ...prev]);
  };

  const updateNewsArticle = (id, updatedData) => {
    setNewsArticles(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const deleteNewsArticle = (id) => {
    setNewsArticles(prev => prev.filter(a => a.id !== id));
  };

  const value = {
    handbookArticles,
    handbookCategories,
    addHandbookArticle,
    updateHandbookArticle,
    deleteHandbookArticle,
    newsArticles,
    addNewsArticle,
    updateNewsArticle,
    deleteNewsArticle
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
