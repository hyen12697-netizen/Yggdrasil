import axios from 'axios';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'ygg_token';
const REFRESH_KEY = 'ygg_refresh_token';
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── Axios instance ───────────────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// ─── Request interceptor: đính kèm Bearer token ───────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Refresh Token Mutex ──────────────────────────────────────────────────────
let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Gọi trực tiếp bằng axios gốc để tránh lặp vô hạn qua interceptor
  const response = await axios.post(
    `${BASE_URL}/auth/refresh-token`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000,
    }
  );

  const data = response.data;
  const newToken = data?.accessToken ?? data?.token;
  if (!newToken) {
    throw new Error('Refresh response did not contain accessToken');
  }

  tokenStorage.set(newToken);
  if (data?.refreshToken) {
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
  }

  return newToken;
};

// ─── Response interceptor: xử lý lỗi tập trung ───────────────────────────────
axiosClient.interceptors.response.use(
  // Thành công: trả thẳng data, bỏ qua wrapper của axios
  (response) => response.data,

  // Lỗi: xử lý tập trung theo status code
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh-token');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      const hasRefreshToken = !!localStorage.getItem(REFRESH_KEY);
      if (hasRefreshToken) {
        originalRequest._retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
              refreshPromise = null;
            });
          }
          const newToken = await refreshPromise;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        } catch {
          // Refresh thất bại → xóa token và yêu cầu đăng nhập lại
        }
      }

      tokenStorage.remove();
      localStorage.removeItem(REFRESH_KEY);
      window.dispatchEvent(new CustomEvent('ygg:unauthorized'));
    } else if (status === 401 && !isAuthEndpoint) {
      tokenStorage.remove();
      localStorage.removeItem(REFRESH_KEY);
      window.dispatchEvent(new CustomEvent('ygg:unauthorized'));
    }

    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Có lỗi xảy ra';

    if (status === 403) {
      console.warn('[Yggdrasil API] 403 Forbidden – không đủ quyền truy cập.');
    }

    if (status === 404) {
      console.warn('[Yggdrasil API] 404 Not Found:', error.config?.url);
    }

    if (status >= 500) {
      console.error('[Yggdrasil API] Server error:', status, serverMessage);
    }

    // Trả về error chuẩn để các caller dễ catch
    const normalizedError = new Error(serverMessage);
    normalizedError.status = status ?? 0;
    normalizedError.data = error.response?.data ?? null;
    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
