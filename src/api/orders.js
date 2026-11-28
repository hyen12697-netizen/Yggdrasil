import axiosClient, { BASE_URL } from './axiosClient';

// Endpoint Order Controller trên Spring Boot nằm ở /api/order (không có prefix /v1)
const ORDER_API_BASE = `${BASE_URL.replace(/\/?$/, '').replace(/\/+$/, '')}/order`;

export const createOrder = async (orderPayload) => {
  return await axiosClient.post(`${ORDER_API_BASE}/check-out`, orderPayload);
};

export const getMyOrders = async (userId) => {
  const response = await axiosClient.get(
      `${ORDER_API_BASE}/my-orders/${userId}/check-history`
  );

  const data = response?.data ?? response;

  return typeof data === "string"
      ? JSON.parse(data)
      : data;
};

export const getOrderById = async (orderId) => {
  return await axiosClient.get(`${ORDER_API_BASE}/my-orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  return await axiosClient.get(`${ORDER_API_BASE}/my-orders/${orderId}/cancel_order`);
};
