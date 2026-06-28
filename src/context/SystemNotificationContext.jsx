import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemNotificationContext = createContext();

export const useSystemNotification = () => {
  const context = useContext(SystemNotificationContext);
  if (!context) {
    throw new Error('useSystemNotification must be used within a SystemNotificationProvider');
  }
  return context;
};

// Types of notifications: 'news', 'promotion', 'system', 'handbook'
const defaultNotifications = [
  {
    id: '1',
    type: 'news',
    title: 'Chào mừng bạn đến với Yggdrasil',
    content: 'Cảm ơn bạn đã đồng hành cùng chúng tôi!',
    url: '/',
    date: new Date().toISOString(),
    isRead: false,
    isActive: true, // For staff to toggle visibility
    author: 'System'
  }
];

export const SystemNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ygg_system_notifications');
    if (saved) return JSON.parse(saved);
    return defaultNotifications;
  });

  useEffect(() => {
    localStorage.setItem('ygg_system_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions for Staff
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now().toString(),
      date: notification.date || new Date().toISOString(),
      isRead: false,
      isActive: notification.isActive !== undefined ? notification.isActive : true
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateNotification = (id, updatedData) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updatedData } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleNotificationActive = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n));
  };

  // Actions for User
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Get active notifications for users
  const activeNotifications = notifications.filter(n => n.isActive);
  const unreadCount = activeNotifications.filter(n => !n.isRead).length;

  const value = {
    notifications,
    activeNotifications,
    unreadCount,
    addNotification,
    updateNotification,
    deleteNotification,
    toggleNotificationActive,
    markAsRead,
    markAllAsRead
  };

  return (
    <SystemNotificationContext.Provider value={value}>
      {children}
    </SystemNotificationContext.Provider>
  );
};
