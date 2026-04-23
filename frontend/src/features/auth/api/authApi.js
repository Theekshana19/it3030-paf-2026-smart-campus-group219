import httpClient from '../../../services/httpClient';

export const loginWithGoogle = (googleToken) =>
  httpClient.post('/api/auth/google', { googleToken }).then((r) => r.data);

export const getMe = () =>
  httpClient.get('/api/auth/me').then((r) => r.data);

export const registerManual = ({ displayName, email, password }) =>
  httpClient.post('/api/auth/register', { displayName, email, password }).then((r) => r.data);

export const loginManual = ({ email, password }) =>
  httpClient.post('/api/auth/login', { email, password }).then((r) => r.data);
