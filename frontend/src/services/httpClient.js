import axios from 'axios';

const httpClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
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
