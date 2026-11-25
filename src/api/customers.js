import axiosClient from './axiosClient';

/**
 * Customer Management API Module
 * Base path: /api/customers
 * Yêu cầu role: STAFF hoặc MANAGER
 *
 * DTOs:
 *   CustomerListResponse  { id, fullName, email, phone, status }
 *   CustomerDetailResponse { id, fullName, email, phone, status, totalSpending, totalOrders, purchaseHistory[] }
 *   CustomerStatusResponse { id, status, message }
 *   PageResponse<T>        { content, page, size, totalElements, totalPages, first, last }
 *   OrderHistoryResponse   { id, totalPrice, shippingAddress, status, orderDate, paymentStatus }
 *
 * Status values (từ BE): "ACTIVE" | "LOCKED"
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Chuyển đổi status từ BE sang nhãn hiển thị tiếng Việt
 * @param {string} status - "ACTIVE" | "LOCKED"
 * @returns {string}
 */
export const formatCustomerStatus = (status) => {
  if (status === 'ACTIVE') return 'Hoạt động';
  if (status === 'LOCKED') return 'Đã khóa';
  return status ?? 'Không rõ';
};

// ─── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách khách hàng (có phân trang + tìm kiếm)
 * GET /api/customers
 *
 * @param {{
 *   page?: number,      // 0-indexed, default 0
 *   size?: number,      // default 10
 *   search?: string,    // tìm theo tên / email / SĐT
 *   status?: string,    // "ACTIVE" | "LOCKED" | undefined (all)
 * }} params
 * @returns {Promise<PageResponse<CustomerListResponse>>}
 *   { content, page, size, totalElements, totalPages, first, last }
 */
export const getCustomers = (params = {}) => {
  const query = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.size !== undefined) query.size = params.size;
  if (params.search)             query.search = params.search;
  if (params.status)             query.status = params.status;
  return axiosClient.get('/customers', { params: query });
};

/**
 * Lấy chi tiết một khách hàng (thống kê + lịch sử đơn hàng)
 * GET /api/customers/:id
 *
 * @param {number|string} id
 * @returns {Promise<CustomerDetailResponse>}
 *   { id, fullName, email, phone, status, totalSpending, totalOrders, purchaseHistory }
 */
export const getCustomerById = (id) =>
  axiosClient.get(`/customers/${id}`);

/**
 * Khóa / Mở khóa tài khoản khách hàng (toggle)
 * PATCH /api/customers/:id/status
 *
 * @param {number|string} id
 * @returns {Promise<CustomerStatusResponse>}
 *   { id, status, message }
 */
export const toggleCustomerStatus = (id) =>
  axiosClient.patch(`/customers/${id}/status`);
