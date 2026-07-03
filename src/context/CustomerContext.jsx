import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCustomers } from '../data/mockData';

const CustomerContext = createContext();

export const useCustomers = () => {
  return useContext(CustomerContext);
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    // Initialize from localStorage if available, otherwise use mockCustomers
    const saved = localStorage.getItem('yggdrasil_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockCustomers;
      }
    }
    return mockCustomers;
  });

  // Save to localStorage whenever customers change
  useEffect(() => {
    localStorage.setItem('yggdrasil_customers', JSON.stringify(customers));
  }, [customers]);

  // Lắng nghe sự kiện để đồng bộ dữ liệu khách hàng theo thời gian thực (giữa các tab hoặc cùng tab)
  useEffect(() => {
    const syncData = (e) => {
      if (e.type === 'customers_updated' || e.key === 'yggdrasil_customers') {
        const saved = localStorage.getItem('yggdrasil_customers');
        if (saved) {
          try {
            setCustomers(JSON.parse(saved));
          } catch (error) {}
        }
      }
    };
    
    window.addEventListener('storage', syncData);
    window.addEventListener('customers_updated', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('customers_updated', syncData);
    };
  }, []);

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const updateCustomer = (id, data) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  return (
    <CustomerContext.Provider value={{ customers, deleteCustomer, updateCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
