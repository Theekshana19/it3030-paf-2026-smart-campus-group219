import axios from 'axios';

const httpClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

httpClient.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.includes('/api/auth/google')) {
    return config;
  }
  const token = localStorage.getItem('googleToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
