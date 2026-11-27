import { apiRequest } from './client';

export const createOrder = (order) => apiRequest('/api/v1/order/check-out', {
  method: 'POST',
  body: order,
});

export const listMyOrders = () => apiRequest('/api/v1/order/my-orders');

export const getMyOrder = (orderId) => apiRequest(
  `/api/v1/order/my-orders/${encodeURIComponent(orderId)}`,
);

export const cancelMyOrder = (orderId) => apiRequest(
  `/api/v1/order/my-orders/${encodeURIComponent(orderId)}/cancel`,
  { method: 'PATCH' },
);
