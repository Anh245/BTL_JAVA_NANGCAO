/**
 * API Client for Customer App
 * Calls reservation-service (:8081) and waitlist-service (:8082) via Vite proxy
 */

const BASE = ''; // Uses Vite proxy, so no base URL needed

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || `Request failed: ${res.status}`);
  }
  // Handle empty responses (204 No Content)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Guest API ───────────────────────────────────────────
export const guestApi = {
  create: (data) => request(`${BASE}/api/guests`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getById: (id) => request(`${BASE}/api/guests/${id}`),

  list: () => request(`${BASE}/api/guests`),
};

// ─── Table API ───────────────────────────────────────────
export const tableApi = {
  list: () => request(`${BASE}/api/tables`),

  filter: ({ zone, available = true }) =>
    request(`${BASE}/api/tables/filter?zone=${encodeURIComponent(zone)}&available=${available}`),
};

// ─── Reservation API ─────────────────────────────────────
export const reservationApi = {
  create: (data) => request(`${BASE}/api/reservations`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  list: () => request(`${BASE}/api/reservations`),

  getById: (id) => request(`${BASE}/api/reservations/${id}`),

  filter: ({ status }) => {
    const statusParam = Array.isArray(status) ? status.join(',') : status;
    return request(`${BASE}/api/reservations/filter?status=${encodeURIComponent(statusParam)}`);
  },

  update: (id, data) => request(`${BASE}/api/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Customer self-service: lookup by phone
  lookupByPhone: (phone) =>
    request(`${BASE}/api/reservations/lookup?phone=${encodeURIComponent(phone)}`),

  // Customer self-service: update with phone verification
  updateByPhone: (id, phone, data) =>
    request(`${BASE}/api/reservations/${id}/update-by-phone?phone=${encodeURIComponent(phone)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Waitlist API ────────────────────────────────────────
export const waitlistApi = {
  create: (data) => request(`${BASE}/api/waitlist`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  list: () => request(`${BASE}/api/waitlist`),

  update: (id, data) => request(`${BASE}/api/waitlist/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
