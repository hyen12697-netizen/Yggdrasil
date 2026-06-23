import { createContext, useState, useContext, useEffect } from 'react';
import { mockUsers } from '../data/mockData';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('yggdrasil_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_users_list');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const register = (name, email, phone, password) => {
    if (usersList.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('Email này đã được sử dụng!');
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
    return true;
  };

  const login = (email, password) => {
    const foundUser = usersList.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Exclude password from saved state
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('yggdrasil_user', JSON.stringify(userWithoutPassword));
      toast.success('Đăng nhập thành công!');
      return true;
    }
    toast.error('Email hoặc mật khẩu không chính xác');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yggdrasil_user');
    toast.success('Đã đăng xuất');
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
