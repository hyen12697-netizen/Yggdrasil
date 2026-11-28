import axiosClient, { tokenStorage } from './axiosClient';

/**
 * Auth API Module
 * Base path: /auth/login, /auth/register, /auth/profile, etc.
 * Đối chiếu với OpenAPI spec: http://localhost:8080/v3/api-docs
 *
 * AuthResponse: { accessToken, refreshToken, tokenType, user: { id, fullName, email, phone, role, avatarUrl } }
 */

/**
 * Đăng nhập
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ accessToken, refreshToken, tokenType, user }} – AuthResponse
 */
export const login = (credentials) =>
  axiosClient.post('/auth/login', credentials);

/**
 * Đăng ký tài khoản khách hàng mới
 * POST /auth/register
 * @param {{ fullName: string, email: string, password: string }} userData
 * @returns {object} UserResponse (id, fullName, email, phone, role, avatarUrl)
 */
export const register = (userData) =>
  axiosClient.post('/auth/register', userData);

/**
 * Lấy thông tin tài khoản đang đăng nhập
 * GET /auth/profile
 * @returns {object} UserResponse
 */
export const getProfile = () =>
  axiosClient.get('/auth/me');

/**
 * Cập nhật hồ sơ cá nhân (fullName, phone)
 * PUT /auth/profile
 * @param {{ fullName?: string, phone?: string }} data
 * @returns {object} UserResponse đã cập nhật
 */
export const updateProfile = (data) =>
  axiosClient.put('/auth/profile', data);

/**
 * Lấy lịch sử đơn hàng của user hiện tại.
 * Backend hiện chưa có endpoint riêng cho customer — trả về empty array
 * để Profile hiển thị trạng thái "Chưa có đơn hàng" thân thiện.
 * TODO: Cập nhật lại khi BE thêm endpoint GET /orders/my-orders
 * @returns {Promise<[]>}
 */
export const getMyOrders = () =>
  Promise.resolve([]);

/**
 * Đổi mật khẩu
 * POST /auth/change-password
 * @param {{ oldPassword: string, newPassword: string }} data
 */
export const changePassword = (data) =>
  axiosClient.post('/auth/change-password', data);

/**
 * Làm mới access token bằng refresh token
 * POST /auth/refresh-token
 * @param {{ refreshToken: string }} data
 * @returns {{ accessToken, tokenType }} TokenRefreshResponse
 */
export const refreshToken = (data) =>
  axiosClient.post('/auth/refresh-token', data);

/**
 * Upload avatar người dùng
 * POST /users/avatar  (multipart/form-data)
 * @param {FormData} formData
 * @returns {{ avatarUrl: string }}
 */
export const uploadAvatar = (formData) =>
  axiosClient.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Đăng xuất phía client – xóa token khỏi localStorage
 * (Backend không có endpoint logout server-side theo spec)
 */
export const logout = () => {
  tokenStorage.remove();
  localStorage.removeItem('ygg_refresh_token');
};