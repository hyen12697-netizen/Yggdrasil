import { apiRequest } from './client';

/**
 * Calls the only endpoint currently mounted in the repository.
 * This endpoint is served by Yggdrasil_fe/server/server.js, not Spring Boot.
 */
export const getApiHealth = ({ signal } = {}) => (
  apiRequest('/api/health', { signal })
);
