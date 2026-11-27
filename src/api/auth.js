import { apiRequest } from './client';

export const authLogin = (credentials) => apiRequest('/api/v1/auth/login', {
  method: 'POST',
  body: credentials,
});

export const authRegister = (account) => apiRequest('/api/v1/auth/register', {
  method: 'POST',
  body: account,
});

export const authCurrentUser = () => apiRequest('/api/v1/auth/me');

export const authUpdateProfile = (profile) => apiRequest('/api/v1/auth/profile', {
  method: 'PUT',
  body: profile,
});
