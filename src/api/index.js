// ─── Axios client & utilities ─────────────────────────────────────────────────
export { default as axiosClient, tokenStorage, BASE_URL } from './axiosClient';

// ─── Legacy fetch-based client (giữ lại để không break code cũ) ──────────────
export { API_BASE_URL, ApiError, apiRequest } from './client';
export { getApiHealth } from './health';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  uploadAvatar,
  logout,
} from './auth';

// ─── Products & Catalog ───────────────────────────────────────────────────────
export {
  getProducts,
  getProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
  getProductReviews,
  createProductReview,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from './products';

// ─── Cart ─────────────────────────────────────────────────────────────────────
export {
  calculateCart,
  validateCartStock,
} from './cart';

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from './wishlist';

// ─── Promotions ───────────────────────────────────────────────────────────────
export {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionActive,
  applyCoupon,
} from './promotions';

// ─── Banners ──────────────────────────────────────────────────────────────────
export {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from './banners';

// ─── Orders ───────────────────────────────────────────────────────────────────
export {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from './orders';

// ─── Customers ────────────────────────────────────────────────────────────────
export {
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
  formatCustomerStatus,
} from './customers';
