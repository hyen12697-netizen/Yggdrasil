const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status ?? 0;
    this.statusText = details.statusText ?? '';
    this.data = details.data ?? null;
    this.url = details.url ?? '';
    this.method = details.method ?? 'GET';

    if (details.cause) {
      this.cause = details.cause;
    }
  }
}

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = isAbsoluteUrl(path) ? path : `${API_BASE_URL}${normalizedPath}`;
  const searchParams = new URLSearchParams();

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  if (!queryString) return baseUrl;

  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}`;
};

const isJsonBody = (body) => {
  if (body === null || body === undefined) return false;
  if (typeof body !== 'object') return false;
  if (typeof FormData !== 'undefined' && body instanceof FormData) return false;
  if (typeof Blob !== 'undefined' && body instanceof Blob) return false;
  if (body instanceof URLSearchParams) return false;
  return true;
};

const parseResponseBody = async (response) => {
  if (response.status === 204 || response.status === 205) return null;

  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json') || contentType.includes('+json')) {
    try {
      return JSON.parse(text);
    } catch {
      // Return the original body so callers can still inspect an invalid JSON response.
      return text;
    }
  }

  return text;
};

const getErrorMessage = (data, response) => {
  if (data && typeof data === 'object') {
    return data.message || data.error || response.statusText || 'API request failed';
  }

  if (typeof data === 'string' && data.trim()) return data;
  return response.statusText || 'API request failed';
};

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    query,
    body,
    headers,
    signal,
    credentials = 'same-origin',
  } = options;

  const normalizedMethod = method.toUpperCase();
  const url = buildUrl(path, query);
  const requestHeaders = new Headers({ Accept: 'application/json' });
  new Headers(headers || {}).forEach((value, key) => {
    requestHeaders.set(key, value);
  });
  let requestBody = body;

  if (isJsonBody(body)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, {
      method: normalizedMethod,
      headers: requestHeaders,
      body: requestBody,
      signal,
      credentials,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    throw new ApiError('Không thể kết nối đến máy chủ API.', {
      status: 0,
      url,
      method: normalizedMethod,
      cause: error,
    });
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data, response), {
      status: response.status,
      statusText: response.statusText,
      data,
      url,
      method: normalizedMethod,
    });
  }

  // Successful responses are returned unchanged instead of being wrapped.
  return data;
};
