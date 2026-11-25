import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
  changePassword as apiChangePassword,
  uploadAvatar as apiUploadAvatar,
  logout as apiLogout,
} from '../api/auth';
import { tokenStorage } from '../api/axiosClient';
import { useNotification } from './NotificationContext';

// ─── Refresh token storage ─────────────────────────────────────────────────────
const REFRESH_KEY = 'ygg_refresh_token';
const refreshTokenStorage = {
  get: () => localStorage.getItem(REFRESH_KEY),
  set: (token) => localStorage.setItem(REFRESH_KEY, token),
  remove: () => localStorage.removeItem(REFRESH_KEY),
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('yggdrasil_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!tokenStorage.get());

  // ─── Persist user info ──────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      localStorage.setItem('yggdrasil_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yggdrasil_user');
    }
  }, [user]);

  // ─── Handle 401 (token expired) từ axiosClient ─────────────────────────────
  const handleUnauthorized = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    showNotification({ type: 'error', message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
  }, [showNotification]);

  useEffect(() => {
    window.addEventListener('ygg:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('ygg:unauthorized', handleUnauthorized);
  }, [handleUnauthorized]);

  // ─── Lấy profile từ API nếu có token nhưng chưa có user ───────────────────
  useEffect(() => {
    const token = tokenStorage.get();
    if (token && !user) {
      setIsLoading(true);
      apiGetProfile()
        .then((profileData) => {
          setUser(profileData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token không hợp lệ → xóa hết
          tokenStorage.remove();
          setIsAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Login ──────────────────────────────────────────────────────────────────
  /**
   * @param {{ email: string, password: string } | string} credentials
   * @param {string} [optionalPassword]
   * @returns {Promise<object|false>} user object nếu thành công, false nếu thất bại
   */
  const login = async (credentials, optionalPassword) => {
    setIsLoading(true);
    try {
      // Tự động phòng vệ: Nếu lỡ truyền login(email, password) thay vì object
      let payload;
      if (typeof credentials === 'string') {
        payload = {
          email: credentials.trim(),
          password: optionalPassword
        };
      } else {
        payload = {
          email: credentials?.email?.trim(),
          password: credentials?.password
        };
      }

      // Kiểm tra sơ bộ trước khi gửi lên Backend
      if (!payload.email || !payload.password) {
        throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.');
      }

      // Gọi API đăng nhập
      const data = await apiLogin(payload);

      // BE trả về AuthResponse: { accessToken, refreshToken, tokenType, user: {...} }
      const token = data.accessToken ?? data.token;
      const userData = data.user ?? data;

      if (!token) throw new Error('Không nhận được token từ server.');

      tokenStorage.set(token);
      if (data.refreshToken) refreshTokenStorage.set(data.refreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      showNotification({ type: 'success', message: 'Đăng nhập thành công!' });
      return userData;
    } catch (err) {
      showNotification({
        type: 'error',
        message: err.message || 'Email hoặc mật khẩu không chính xác.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Register ───────────────────────────────────────────────────────────────
  /**
   * @param {{ fullName: string, email: string, password: string }} userData
   * @returns {Promise<boolean>}
   */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Chuẩn hóa dữ liệu gửi sang Backend (khớp DTO RegisterRequest: fullName, email, password, phone?)
      const payload = {
        fullName: userData.fullName || userData.name || userData.fullname || '',
        email: (userData.email || '').trim(),
        password: userData.password,
      };
      if (userData.phone?.trim()) {
        payload.phone = userData.phone.trim();
      }

      if (!payload.fullName || !payload.email || !payload.password) {
        throw new Error('Vui lòng điền đầy đủ họ tên, email và mật khẩu.');
      }

      await apiRegister(payload);
      showNotification({ type: 'success', message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.' });
      return true;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      showNotification({ type: 'error', message: errorMessage });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    apiLogout(); // xóa access token + refresh token khỏi localStorage
    refreshTokenStorage.remove();
    setUser(null);
    setIsAuthenticated(false);
    showNotification({ type: 'success', message: 'Đã đăng xuất.' });
  };

  // ─── Update Profile ─────────────────────────────────────────────────────────
  /**
   * Cập nhật hồ sơ – gọi PUT /auth/profile và đồng bộ state
   * @param {{ fullName?: string, phone?: string }} updatedData – UpdateProfileRequest
   */
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      // Chỉ gửi các trường BE cho phép chỉnh sửa: fullName, phone
      const payload = {};
      if (updatedData.fullName !== undefined) payload.fullName = updatedData.fullName;
      if (updatedData.phone !== undefined) payload.phone = updatedData.phone;

      const newUser = await apiUpdateProfile(payload);
      setUser((prev) => ({ ...prev, ...newUser }));
      showNotification({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
      return true;
    } catch (err) {
      showNotification({ type: 'error', message: err.message || 'Cập nhật thất bại.' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Upload Avatar ──────────────────────────────────────────────────────────
  /**
   * Upload ảnh đại diện – gọi POST /users/avatar (multipart/form-data)
   * @param {File} file
   * @returns {Promise<string|null>} avatarUrl nếu thành công
   */
  const uploadAvatar = async (file) => {
    if (!file) return null;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiUploadAvatar(formData);
      const newAvatarUrl = res?.avatarUrl ?? res?.url ?? res?.data?.avatarUrl ?? null;
      if (newAvatarUrl) {
        setUser((prev) => (prev ? { ...prev, avatarUrl: newAvatarUrl, avatar: newAvatarUrl } : prev));
      }
      showNotification({ type: 'success', message: 'Cập nhật ảnh đại diện thành công!' });
      return newAvatarUrl;
    } catch (err) {
      showNotification({ type: 'error', message: err.message || 'Tải ảnh đại diện thất bại.' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Change Password ────────────────────────────────────────────────────────
  /**
   * Đổi mật khẩu – gọi POST /auth/change-password
   * @param {{ oldPassword: string, newPassword: string }} data
   * @returns {boolean}
   */
  const changePassword = async (data) => {
    setIsLoading(true);
    try {
      await apiChangePassword(data);
      showNotification({ type: 'success', message: 'Đổi mật khẩu thành công!' });
      return true;
    } catch (err) {
      showNotification({ type: 'error', message: err.message || 'Đổi mật khẩu thất bại.' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Context value ──────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
