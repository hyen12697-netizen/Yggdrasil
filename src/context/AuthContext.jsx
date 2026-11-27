import { createContext, useState, useContext, useEffect } from 'react';
import { mockUsers, mockCustomers } from '../data/mockData';
import { authCurrentUser, authLogin, authRegister, authUpdateProfile } from '../api';
import { isDemoAuth } from '../config/authMode';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

// The auth hook is a stable API exported beside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const mapApiUser = (apiUser) => {
  if (!apiUser) return null;

  const role = String(apiUser.role || 'CUSTOMER').toUpperCase();
  return {
    id: String(apiUser.id),
    name: apiUser.fullName || apiUser.name || '',
    email: apiUser.email || '',
    phone: apiUser.phone || '',
    role: role === 'STAFF' ? 'Staff' : ['MANAGER', 'ADMIN'].includes(role) ? 'Manager' : 'Customer',
    avatar: apiUser.avatarUrl || apiUser.avatar || '',
  };
};

const readSessionUser = () => {
  try {
    const saved = sessionStorage.getItem('yggdrasil_api_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const persistSession = (tokens, user) => {
  sessionStorage.setItem('yggdrasil_access_token', tokens.accessToken);
  if (tokens.refreshToken) sessionStorage.setItem('yggdrasil_refresh_token', tokens.refreshToken);
  sessionStorage.setItem('yggdrasil_api_user', JSON.stringify(user));
};

const clearSession = () => {
  sessionStorage.removeItem('yggdrasil_access_token');
  sessionStorage.removeItem('yggdrasil_refresh_token');
  sessionStorage.removeItem('yggdrasil_api_user');
};

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();

  const [user, setUser] = useState(() => (
    isDemoAuth
      ? JSON.parse(localStorage.getItem('yggdrasil_user') || 'null')
      : readSessionUser()
  ));

  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('yggdrasil_users_list');
    if (saved) {
      const merged = [...JSON.parse(saved)];
      mockUsers.forEach((mockUser) => {
        if (!merged.find((entry) => entry.email === mockUser.email)) merged.push(mockUser);
      });
      localStorage.setItem('yggdrasil_users_list', JSON.stringify(merged));
      return merged;
    }
    return mockUsers;
  });

  useEffect(() => {
    if (isDemoAuth || !sessionStorage.getItem('yggdrasil_access_token')) return undefined;

    let active = true;
    authCurrentUser()
      .then((response) => {
        if (!active) return;
        const currentUser = mapApiUser(response);
        setUser(currentUser);
        sessionStorage.setItem('yggdrasil_api_user', JSON.stringify(currentUser));
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        setUser(null);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    const clearExpiredSession = () => setUser(null);
    window.addEventListener('yggdrasil:auth-expired', clearExpiredSession);
    return () => window.removeEventListener('yggdrasil:auth-expired', clearExpiredSession);
  }, []);

  const register = async (name, email, phone, password) => {
    if (isDemoAuth) {
      if (usersList.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
        showNotification({ type: 'error', message: 'Email này đã được sử dụng!' });
        return false;
      }

      const newUser = {
        id: `u_${Date.now()}`,
        name,
        email,
        phone,
        password,
        role: 'Customer',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      };
      const updatedList = [...usersList, newUser];
      setUsersList(updatedList);
      localStorage.setItem('yggdrasil_users_list', JSON.stringify(updatedList));

      let currentCustomers = mockCustomers;
      try {
        const savedCustomers = localStorage.getItem('yggdrasil_customers');
        if (savedCustomers) currentCustomers = JSON.parse(savedCustomers);
      } catch {
        currentCustomers = [...mockCustomers];
      }
      currentCustomers.push({
        id: `KH_${Date.now().toString().slice(-6)}`,
        name,
        email,
        phone,
        totalSpent: 0,
        ordersCount: 0,
        status: 'Hoạt động',
        joinDate: new Date().toISOString().split('T')[0],
        username: email.split('@')[0],
        password,
      });
      localStorage.setItem('yggdrasil_customers', JSON.stringify(currentCustomers));
      window.dispatchEvent(new Event('customers_updated'));
      return true;
    }

    try {
      const response = await authRegister({
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      const registeredUser = mapApiUser(response);
      const updatedList = [...usersList.filter((entry) => entry.email !== registeredUser.email), registeredUser];
      setUsersList(updatedList);
      localStorage.setItem('yggdrasil_users_list', JSON.stringify(updatedList));
      return true;
    } catch (error) {
      showNotification({ type: 'error', message: error.message || 'Không thể tạo tài khoản.' });
      return false;
    }
  };

  const login = async (email, password) => {
    if (isDemoAuth) {
      const foundUser = usersList.find((entry) => entry.email === email && entry.password === password);
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('yggdrasil_user', JSON.stringify(userWithoutPassword));
        showNotification({ type: 'success', message: 'Đăng nhập thành công!' });
        return userWithoutPassword;
      }
      showNotification({ type: 'error', message: 'Email hoặc mật khẩu không chính xác' });
      return false;
    }

    try {
      const response = await authLogin({ email: email.trim(), password });
      const authenticatedUser = mapApiUser(response.user);
      persistSession(response, authenticatedUser);
      setUser(authenticatedUser);
      showNotification({ type: 'success', message: 'Đăng nhập thành công!' });
      return authenticatedUser;
    } catch (error) {
      showNotification({ type: 'error', message: error.message || 'Email hoặc mật khẩu không chính xác.' });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    clearSession();
    localStorage.removeItem('yggdrasil_user');
    showNotification({ type: 'success', message: 'Đã đăng xuất' });
  };

  const updateProfile = async (updatedData) => {
    if (!user) return false;

    if (!isDemoAuth) {
      try {
        const response = await authUpdateProfile({
          fullName: updatedData.fullName || updatedData.name || user.name,
          phone: updatedData.phone ?? user.phone,
        });
        const updatedUser = { ...user, ...mapApiUser(response) };
        setUser(updatedUser);
        sessionStorage.setItem('yggdrasil_api_user', JSON.stringify(updatedUser));
        return updatedUser;
      } catch (error) {
        showNotification({ type: 'error', message: error.message || 'Không thể cập nhật hồ sơ.' });
        return false;
      }
    }

    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('yggdrasil_user', JSON.stringify(newUser));
    const updatedList = usersList.map((entry) => (entry.id === user.id ? { ...entry, ...updatedData } : entry));
    setUsersList(updatedList);
    localStorage.setItem('yggdrasil_users_list', JSON.stringify(updatedList));
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, usersList, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
