import httpClient from '../../../services/httpClient.js';

/**
 * build clean query params, skip empty values
 * @param {Record<string, unknown>} raw
 */
function buildListQuery(raw) {
  const out = {};
  const keys = [
    'resourceId', 'status', 'userEmail', 'dateFrom', 'dateTo',
    'search', 'page', 'size', 'sortBy', 'sortDir',
  ];
  for (const k of keys) {
    const v = raw[k];
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

/**
 * get all bookings with filters and pagination
 * @param {import('../types/booking.types.js').BookingListQuery} params
 * @returns {Promise<import('../types/booking.types.js').BookingListResponse>}
 */
export async function listBookings(params = {}) {
  const { data } = await httpClient.get('/api/bookings', { params: buildListQuery(params) });
  return data;
}

/**
 * create a new booking request
 * @param {import('../types/booking.types.js').BookingCreatePayload} payload
 */
export async function createBooking(payload) {
  const { data } = await httpClient.post('/api/bookings', payload);
  return data;
}

/**
 * get a single booking by id
 * @param {number|string} id
 */
export async function getBookingById(id) {
  const { data } = await httpClient.get(`/api/bookings/${id}`);
  return data;
}

/**
 * update a pending booking
 * @param {number|string} id
 * @param {import('../types/booking.types.js').BookingCreatePayload} payload
 */
export async function updateBooking(id, payload) {
  const { data } = await httpClient.put(`/api/bookings/${id}`, payload);
  return data;
}

/**
 * delete a booking
 * @param {number|string} id
 */
export async function deleteBooking(id) {
  await httpClient.delete(`/api/bookings/${id}`);
}

/**
 * admin approves or rejects a booking
 * @param {number|string} id
 * @param {{ approved: boolean; adminRemark?: string; reviewerEmail: string }} payload
 */
export async function reviewBooking(id, payload) {
  const { data } = await httpClient.patch(`/api/bookings/${id}/review`, payload);
  return data;
}

/**
 * user cancels their approved booking
 * @param {number|string} id
 * @param {string} userEmail
 */
export async function cancelBooking(id, userEmail) {
  const { data } = await httpClient.patch(`/api/bookings/${id}/cancel`, null, {
    params: { userEmail },
  });
  return data;
}

/**
 * check for time conflicts before booking
 * @param {number} resourceId
 * @param {string} date - ISO date string
 * @param {string} startTime - HH:mm
 * @param {string} endTime - HH:mm
 * @returns {Promise<import('../types/booking.types.js').ConflictDetail[]>}
 */
export async function checkConflicts(resourceId, date, startTime, endTime) {
  const { data } = await httpClient.get('/api/bookings/conflicts', {
    params: { resourceId, date, startTime, endTime },
  });
  return data;
}
