import httpClient from '../../../services/httpClient.js';

export async function getDashboard() {
  const { data } = await httpClient.get('/api/dashboard');
  return data;
}

export async function getRecentChanges(params = {}) {
  const { data } = await httpClient.get('/api/dashboard/recent-changes', { params });
  return data;
}
