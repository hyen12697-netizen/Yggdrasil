import axiosClient from './axiosClient';

/**
 * Promotions API Module (STAFF/MANAGER + authenticated customers)
 * Đối chiếu với OpenAPI spec: http://localhost:8080/v3/api-docs
 *
 * PromotionResponse: { id, code, name, discountType, discountValue, minOrderAmount,
 *   maxDiscountAmount, startDate, endDate, isActive, usageCount, usageLimit }
 *
 * PageResponse: { content, pageNo, pageSize, totalElements, totalPages, last }
 */

/**
 * Lấy danh sách khuyến mãi (STAFF/MANAGER only, có phân trang & filter)
 * GET /promotions
 * @param {{ keyword?: string, isActive?: boolean, discountType?: string, page?: number, size?: number, sortBy?: string, sortDir?: string }} params
 * @returns {PageResponse<PromotionResponse>}
 */
export const getPromotions = (params = {}) =>
  axiosClient.get('/promotions', { params });

/**
 * Tạo khuyến mãi mới (STAFF/MANAGER only)
 * POST /promotions
 * @param {object} data – CreatePromotionRequest
 * @returns {PromotionResponse}
 */
export const createPromotion = (data) =>
  axiosClient.post('/promotions', data);

/**
 * Cập nhật khuyến mãi (STAFF/MANAGER only)
 * PUT /promotions/{id}
 * @param {number} id
 * @param {object} data – UpdatePromotionRequest
 * @returns {PromotionResponse}
 */
export const updatePromotion = (id, data) =>
  axiosClient.put(`/promotions/${id}`, data);

/**
 * Xóa mềm khuyến mãi (STAFF/MANAGER only)
 * DELETE /promotions/{id}
 * @param {number} id
 */
export const deletePromotion = (id) =>
  axiosClient.delete(`/promotions/${id}`);

/**
 * Bật/Tắt trạng thái khuyến mãi (STAFF/MANAGER only)
 * PATCH /promotions/{id}/toggle-active
 * @param {number} id
 * @returns {PromotionResponse}
 */
export const togglePromotionActive = (id) =>
  axiosClient.patch(`/promotions/${id}/toggle-active`);

/**
 * Áp dụng / xem trước coupon (authenticated customers)
 * POST /promotions/apply
 * @param {{ code: string, orderAmount: number }} data – ApplyCouponRequest
 * @returns {{ valid: boolean, message: string, discountAmount: number, finalAmount: number }}
 */
export const applyCoupon = (data) =>
  axiosClient.post('/promotions/apply', data);
