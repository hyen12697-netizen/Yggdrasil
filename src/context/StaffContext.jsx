import React, { createContext, useCallback, useContext, useState } from 'react';
import { createStaff as createStaffRequest, getStaffList } from '../api/staff';

const StaffContext = createContext();

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

export const StaffProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);

  const loadStaff = useCallback(async (params = {}) => {
    const response = await getStaffList(params);
    const content = response?.content ?? response?.data?.content;
    if (!Array.isArray(content)) {
      throw new Error('Phản hồi danh sách nhân viên từ BE không hợp lệ.');
    }
    setStaffList(content);
    return content;
  }, []);

  const addStaff = async (newStaff) => {
    const created = await createStaffRequest(newStaff);
    setStaffList(prev => [created, ...prev.filter(staff => staff.id !== created.id)]);
    return created;
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
      loadStaff,
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
