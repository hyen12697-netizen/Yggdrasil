import { createContext, useState, useContext, useEffect } from 'react';
import { mockUsers, mockCustomers } from '../data/mockData';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('yggdrasil_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_users_list');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      mockUsers.forEach(mu => {
        if (!merged.find(u => u.email === mu.email)) {
          merged.push(mu);
        }
      });
      localStorage.setItem('yggdrasil_users_list', JSON.stringify(merged));
      return merged;
    }
    return mockUsers;
  });

  const register = (name, email, phone, password) => {
    if (usersList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showNotification({ type: 'error', message: 'Email này đã được sử dụng!' });
      return false;
    }
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      phone,
      password,
      role: 'Customer',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    };
    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);
    localStorage.setItem('yggdrasil_users_list', JSON.stringify(updatedList));

    // Đồng bộ với danh sách khách hàng trong CustomerContext
    const savedCustomers = localStorage.getItem('yggdrasil_customers');
    let currentCustomers = mockCustomers;
    if (savedCustomers) {
      try {
        currentCustomers = JSON.parse(savedCustomers);
      } catch(e) {}
    }
    const newCustomerData = {
      id: 'KH_' + Date.now().toString().slice(-6),
      name,
      email,
      phone,
      totalSpent: 0,
      ordersCount: 0,
      status: 'Hoạt động',
      joinDate: new Date().toISOString().split('T')[0],
      username: email.split('@')[0],
      password
    };
    currentCustomers.push(newCustomerData);
    localStorage.setItem('yggdrasil_customers', JSON.stringify(currentCustomers));
    window.dispatchEvent(new Event('customers_updated'));

    return true;
  };

  const login = (email, password) => {
    const foundUser = usersList.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Exclude password from saved state
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('yggdrasil_user', JSON.stringify(userWithoutPassword));
      showNotification({ type: 'success', message: 'Đăng nhập thành công!' });
      return userWithoutPassword;
    }
    showNotification({ type: 'error', message: 'Email hoặc mật khẩu không chính xác' });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yggdrasil_user');
    showNotification({ type: 'success', message: 'Đã đăng xuất' });
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('yggdrasil_user', JSON.stringify(newUser));
    
    // Also sync in the users list
    const updatedList = usersList.map(u => u.id === user.id ? { ...u, ...updatedData } : u);
    setUsersList(updatedList);
    localStorage.setItem('yggdrasil_users_list', JSON.stringify(updatedList));
  };

  return (
    <AuthContext.Provider value={{ user, usersList, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
