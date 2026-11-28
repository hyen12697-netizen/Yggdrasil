import axiosClient from './axiosClient';

/**
 * Banners API Module
 * Đối chiếu với OpenAPI spec: http://localhost:8080/v3/api-docs
 *
 * BannerResponse: { id, title, imageUrl, linkUrl, bannerType, displayOrder, isActive }
 */

/**
 * Lấy danh sách banner đang active (public)
 * GET /banners?type=HOMEPAGE|FORUM
 * @param {{ type?: 'HOMEPAGE'|'FORUM' }} params
 * @returns {BannerResponse[]}
 */
export const getBanners = (params = {}) =>
  axiosClient.get('/banners', { params });

/**
 * Tạo banner mới (STAFF/MANAGER only)
 * POST /banners
 * @param {object} data – CreateBannerRequest
 * @returns {BannerResponse}
 */
export const createBanner = (data) =>
  axiosClient.post('/banners', data);

/**
 * Cập nhật banner (STAFF/MANAGER only)
 * PUT /banners/{id}
 * @param {number} id
 * @param {object} data – UpdateBannerRequest
 * @returns {BannerResponse}
 */
export const updateBanner = (id, data) =>
  axiosClient.put(`/banners/${id}`, data);

/**
 * Xóa mềm banner (STAFF/MANAGER only)
 * DELETE /banners/{id}
 * @param {number} id
 */
export const deleteBanner = (id) =>
  axiosClient.delete(`/banners/${id}`);
