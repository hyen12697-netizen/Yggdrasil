import axiosClient from './axiosClient';

/**
 * Wishlist API Module  (requires authentication)
 *
 * WishlistItemResponse: { id, product: { id, name, price, mainImageUrl, ... }, createdAt }
 * WishlistRequest: { productId: Long }
 */

/**
 * Lấy danh sách yêu thích của người dùng hiện tại
 * GET /wishlist
 * @returns {WishlistItemResponse[]}
 */
export const getWishlist = () =>
  axiosClient.get('/wishlist');

/**
 * Thêm sản phẩm vào danh sách yêu thích
 * POST /wishlist   body: { productId }
 * @param {number} productId
 */
export const addToWishlist = (productId) =>
  axiosClient.post('/wishlist', { productId });

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 * DELETE /wishlist  body: { productId }  (BE nhận @RequestBody WishlistRequest hoặc @RequestParam)
 * @param {number} productId
 */
export const removeFromWishlist = (productId) =>
  axiosClient.delete('/wishlist', { data: { productId } });
