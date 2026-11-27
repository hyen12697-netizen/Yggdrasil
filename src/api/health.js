import { apiRequest } from './client';

/**
 * Calls Spring Boot's public health endpoint.
 */
export const getApiHealth = ({ signal } = {}) => (
  apiRequest('/api/v1/health', { signal })
);
