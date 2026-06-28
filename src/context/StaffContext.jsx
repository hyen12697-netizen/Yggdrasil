import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStaff } from '../data/mockData';

const StaffContext = createContext();

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

export const StaffProvider = ({ children }) => {
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('ygg_staff');
    if (saved) {
      return JSON.parse(saved);
    }
    return mockStaff;
  });

  useEffect(() => {
    localStorage.setItem('ygg_staff', JSON.stringify(staffList));
  }, [staffList]);

  const addStaff = (newStaff) => {
    const staff = {
      ...newStaff,
      id: `NV${Date.now().toString().slice(-4)}`, // Generate a dummy ID
      status: 'Hoạt động',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Chưa từng đăng nhập',
    };
    setStaffList(prev => [...prev, staff]);
  };

  const updateStaff = (id, updatedData) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStaff = (id) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  const toggleStaffLock = (id) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động' };
      }
      return s;
    }));
  };

  const resetPassword = (id) => {
    // In a real app, this would call an API. 
    // Here we just simulate a success action, state doesn't need to change for password reset.
    return true;
  };

  return (
    <StaffContext.Provider value={{
      staffList,
      addStaff,
      updateStaff,
      deleteStaff,
      toggleStaffLock,
      resetPassword
    }}>
      {children}
    </StaffContext.Provider>
  );
};
