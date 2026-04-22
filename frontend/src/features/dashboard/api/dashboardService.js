import httpClient from '../../../services/httpClient.js';

export async function getDashboard() {
  const { data } = await httpClient.get('/api/dashboard');
  return data;
}
