import httpClient from '../../../services/httpClient.js';

export async function getMyBookings() {
  const { data } = await httpClient.get('/api/bookings/mine');
  return data;
}

export async function getPendingBookings() {
  const { data } = await httpClient.get('/api/bookings/pending');
  return data;
}

/**
 * @param {{ resourceId: number, startAt: string, endAt: string }} payload
 */
export async function createBooking(payload) {
  const { data } = await httpClient.post('/api/bookings', payload);
  return data;
}

/**
 * @param {number|string} bookingId
 * @param {{ approved: boolean, note?: string }} payload
 */
export async function decideBooking(bookingId, payload) {
  const { data } = await httpClient.patch(`/api/bookings/${bookingId}/decision`, payload);
  return data;
}
