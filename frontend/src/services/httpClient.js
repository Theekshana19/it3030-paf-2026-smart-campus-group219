import axios from 'axios';
import { clearAuth, getToken } from '../features/auth/utils/tokenStorage';

// Empty / unset → same-origin `/api/...` so Vite dev proxy (vite.config.js) can reach Spring Boot
const apiBase = String(import.meta.env.VITE_API_BASE_URL ?? '').trim();
const httpClient = axios.create({
  baseURL: apiBase.length > 0 ? apiBase : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Attach JWT to every request
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear stored auth and redirect to login
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      globalThis.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data && typeof data.message === 'string') return data.message;
  if (error.message) return error.message;
  return 'Request failed';
}

export default httpClient;
