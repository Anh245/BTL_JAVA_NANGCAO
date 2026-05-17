/**
 * API Client for Admin App
 * Includes JWT Authorization header for authenticated requests
 */

const TOKEN_KEY = 'aurelian_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { headers, ...options });

  if (res.status === 401 || res.status === 403) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || `Request failed: ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Auth API ────────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setToken(data.token);
    return data;
  },

  logout: () => {
    clearToken();
    window.location.href = '/login';
  },
};

// ─── Guest API ───────────────────────────────────────────
export const guestApi = {
  create: (data) => request('/api/guests', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id) => request(`/api/guests/${id}`),
  list: () => request('/api/guests'),
};

// ─── Table API ───────────────────────────────────────────
export const tableApi = {
  list: () => request('/api/tables'),
  filter: ({ zone, available = true }) => request(`/api/tables/filter?zone=${encodeURIComponent(zone)}&available=${available}`),
};

// ─── Reservation API ─────────────────────────────────────
export const reservationApi = {
  create: (data) => request('/api/reservations', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/api/reservations'),
  getById: (id) => request(`/api/reservations/${id}`),
  filter: ({ status }) => {
    const s = Array.isArray(status) ? status.join(',') : status;
    return request(`/api/reservations/filter?status=${encodeURIComponent(s)}`);
  },
  update: (id, data) => request(`/api/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Waitlist API ────────────────────────────────────────
export const waitlistApi = {
  create: (data) => request('/api/waitlist', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/api/waitlist'),
  update: (id, data) => request(`/api/waitlist/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
