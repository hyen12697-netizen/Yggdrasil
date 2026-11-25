import axiosClient from './axiosClient';

/**
 * Cart API Module
 * Đối chiếu với OpenAPI spec: http://localhost:8080/v3/api-docs
 *
 * Cart là stateless – tính toán server-side theo giá DB, không lưu session.
 *
 * CartCalculateRequest:
 * { items: [{ productId: number, quantity: number }] }
 *
 * CartCalculateResponse:
 * { items: [{ productId, productName, price, quantity, subtotal }], grandTotal }
 *
 * StockValidateResponse:
 * { valid: boolean, items: [{ productId, available, requested, sufficient }] }
 */

/**
 * Tính tổng tiền giỏ hàng theo giá thực tế từ DB
 * POST /cart/calculate
 * @param {{ items: Array<{ productId: number, quantity: number }> }} cartPayload
 * @returns {CartCalculateResponse}
 */
export const calculateCart = (cartPayload) =>
  axiosClient.post('/cart/calculate', cartPayload);

/**
 * Kiểm tra tồn kho trước khi checkout
 * POST /cart/validate-stock
 * @param {{ items: Array<{ productId: number, quantity: number }> }} cartPayload
 * @returns {StockValidateResponse}
 */
export const validateCartStock = (cartPayload) =>
  axiosClient.post('/cart/validate-stock', cartPayload);
