import axiosClient from './axiosClient';

/**
 * Products & Catalog API Module
 * Đối chiếu với OpenAPI spec từ: http://localhost:8080/v3/api-docs
 *
 * Chuẩn phân trang Spring Data JPA (PageResponse):
 * { content: [], pageNo, pageSize, totalElements, totalPages, last }
 */

// ─── Products ─────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách sản phẩm (public, có phân trang & multi-filter)
 * GET /products
 * @param {{
 *   keyword?: string,
 *   categoryId?: number,
 *   subcategoryId?: number,
 *   brandId?: number,
 *   minPrice?: number,
 *   maxPrice?: number,
 *   minRating?: number,
 *   isAvailable?: boolean,
 *   sortBy?: string,
 *   sortDir?: string,
 *   page?: number,
 *   size?: number,
 * }} params
 * @returns {PageResponse<ProductSummaryResponse>}
 */
export const getProducts = (params = {}) => {
  const query = {};

  if (params.page !== undefined) query.page = params.page;
  if (params.size !== undefined) query.size = params.size;

  // keyword search (mapped from 'search' or 'keyword')
  const keyword = params.keyword ?? params.search;
  if (keyword) query.keyword = keyword;

  // Filter params (align với backend query param names)
  if (params.categoryId) query.categoryId = params.categoryId;
  if (params.subcategoryId) query.subcategoryId = params.subcategoryId;
  if (params.brandId) query.brandId = params.brandId;
  if (params.minPrice !== undefined) query.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;
  if (params.minRating !== undefined) query.minRating = params.minRating;
  if (params.isAvailable !== undefined) query.isAvailable = params.isAvailable;

  // Sort
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortDir) query.sortDir = params.sortDir;

  return axiosClient.get('/products', { params: query });
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 * GET /products/{id}
 * @param {string|number} id
 * @returns {ProductDetailResponse}
 */
export const getProductById = (id) =>
  axiosClient.get(`/products/${id}`);

/**
 * Upload ảnh sản phẩm (STAFF/MANAGER only)
 * POST /products/upload-image  (multipart/form-data)
 * @param {FormData} formData
 * @returns {{ imageUrl: string }}
 */
export const uploadProductImage = (formData) =>
  axiosClient.post('/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Tạo sản phẩm mới (STAFF/MANAGER only)
 * POST /products
 * @param {object} productData – CreateProductRequest
 * @returns {ProductDetailResponse}
 */
export const createProduct = (productData) =>
  axiosClient.post('/products', productData);

/**
 * Cập nhật sản phẩm (STAFF/MANAGER only)
 * PUT /products/{id}
 * @param {string|number} id
 * @param {object} productData – UpdateProductRequest
 * @returns {ProductDetailResponse}
 */
export const updateProduct = (id, productData) =>
  axiosClient.put(`/products/${id}`, productData);

/**
 * Cập nhật tồn kho sản phẩm (STAFF/MANAGER only)
 * PATCH /products/{id}/stock
 * @param {string|number} id
 * @param {{ quantity: number }} data
 */
export const updateProductStock = (id, data) =>
  axiosClient.patch(`/products/${id}/stock`, data);

/**
 * Xóa mềm sản phẩm (STAFF/MANAGER only)
 * DELETE /products/{id}
 * @param {string|number} id
 */
export const deleteProduct = (id) =>
  axiosClient.delete(`/products/${id}`);

// ─── Product Reviews ───────────────────────────────────────────────────────────

// ─── Categories ───────────────────────────────────────────────────────────────

/**
 * Lấy danh sách danh mục (paginated)
 * GET /categories
 * @param {{ keyword?: string, active?: boolean, page?: number, size?: number, sortBy?: string, sortDir?: string }} params
 * @returns {PageResponse<CategoryResponse>}
 */
export const getCategories = (params = {}) =>
  axiosClient.get('/categories', { params });

/**
 * Tạo danh mục (STAFF/MANAGER only)
 * POST /categories
 * @param {{ name: string, description?: string }} data
 * @returns {CategoryResponse}
 */
export const createCategory = (data) =>
  axiosClient.post('/categories', data);

/**
 * Cập nhật danh mục (STAFF/MANAGER only)
 * PUT /categories/{id}
 * @param {string|number} id
 * @param {object} data – UpdateCategoryRequest
 * @returns {CategoryResponse}
 */
export const updateCategory = (id, data) =>
  axiosClient.put(`/categories/${id}`, data);

/**
 * Xóa danh mục (STAFF/MANAGER only)
 * DELETE /categories/{id}
 */
export const deleteCategory = (id) =>
  axiosClient.delete(`/categories/${id}`);

// ─── Brands ───────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách thương hiệu (paginated)
 * GET /brands
 * @param {{ keyword?: string, active?: boolean, page?: number, size?: number }} params
 * @returns {PageResponse<BrandResponse>}
 */
export const getBrands = (params = {}) =>
  axiosClient.get('/brands', { params });

/**
 * Tạo thương hiệu (STAFF/MANAGER only)
 * POST /brands
 * @param {{ name: string, description?: string, logo?: string, country?: string }} data
 * @returns {BrandResponse}
 */
export const createBrand = (data) =>
  axiosClient.post('/brands', data);

/**
 * Cập nhật thương hiệu (STAFF/MANAGER only)
 * PUT /brands/{id}
 * @param {string|number} id
 * @param {object} data – UpdateBrandRequest
 * @returns {BrandResponse}
 */
export const updateBrand = (id, data) =>
  axiosClient.put(`/brands/${id}`, data);

/**
 * Xóa thương hiệu (STAFF/MANAGER only)
 * DELETE /brands/{id}
 */
export const deleteBrand = (id) =>
  axiosClient.delete(`/brands/${id}`);

// ─── Product Reviews ──────────────────────────────────────────────────────────

/**
 * Lấy danh sách đánh giá của sản phẩm (public)
 * GET /products/{productId}/reviews?page=0&size=10
 * @param {number} productId
 * @param {{ page?: number, size?: number }} params
 * @returns {PageResponse<ReviewResponse>}
 *   ReviewResponse: { id, userFullName, userAvatarUrl, rating, comment, createdAt }
 */
export const getProductReviews = (productId, params = {}) =>
  axiosClient.get(`/products/${productId}/reviews`, {
    params: { page: params.page ?? 0, size: params.size ?? 20 },
  });

/**
 * Gửi đánh giá mới (yêu cầu đăng nhập)
 * POST /products/{productId}/reviews
 * @param {number} productId
 * @param {{ rating: number, comment: string }} data – CreateReviewRequest
 * @returns {ReviewResponse}
 */
export const createProductReview = (productId, data) =>
  axiosClient.post(`/products/${productId}/reviews`, data);

