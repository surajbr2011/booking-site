/**
 * Central API Client for The Exotica Agonda frontend.
 * All calls are proxied through Next.js rewrites to the backend (port 3000).
 * Usage: import { api } from '@/lib/apiClient';
 */

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: res.statusText };
    }
    throw new Error(error?.message || error?.error || `Request failed with status ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  // ── Rooms ──────────────────────────────────────────────────────────────
  getRooms: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/rooms${qs ? `?${qs}` : ''}`);
  },
  getRoom: (id) => request(`/rooms/${id}`),

  // ── Bookings ───────────────────────────────────────────────────────────
  createBooking: (data) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookingByReference: (ref) => request(`/bookings/${ref}`),
  checkAvailability: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bookings/availability?${qs}`);
  },

  // ── Payments ───────────────────────────────────────────────────────────
  createPaymentOrder: (bookingReference) =>
    request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingReference }),
    }),

  // ── Contact ────────────────────────────────────────────────────────────
  submitContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  checkInquiries: (inquiryIds) =>
    request('/contact/check', { method: 'POST', body: JSON.stringify({ inquiryIds }) }),

  // ── Gallery ────────────────────────────────────────────────────────────
  getGallery: (category) => {
    const qs = category ? `?category=${category}` : '';
    return request(`/gallery${qs}`);
  },

  // ── Admin — Auth ───────────────────────────────────────────────────────
  adminLogin: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ── Admin — Dashboard ──────────────────────────────────────────────────
  getAdminDashboard: () => request('/admin/dashboard'),

  // ── Admin — Bookings ───────────────────────────────────────────────────
  getAdminBookings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/bookings${qs ? `?${qs}` : ''}`);
  },
  updateAdminBooking: (id, data) =>
    request(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // ── Admin — Rooms ──────────────────────────────────────────────────────
  getAdminRooms: () => request('/admin/rooms'),
  createAdminRoom: (data) =>
    request('/admin/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminRoom: (id, data) =>
    request(`/admin/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // ── Admin — Inquiries ──────────────────────────────────────────────────
  getAdminInquiries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/inquiries${qs ? `?${qs}` : ''}`);
  },
  updateAdminInquiry: (id, data) =>
    request(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminInquiry: (id) =>
    request(`/admin/inquiries/${id}`, { method: 'DELETE' }),
  bulkDeleteInquiries: (ids = []) =>
    request('/admin/inquiries', { method: 'DELETE', body: JSON.stringify({ ids }) }),

  // ── Admin — Gallery ───────────────────────────────────────────────────
  getAdminGallery: (category) => {
    const qs = category ? `?category=${category}` : '';
    return request(`/gallery${qs}`);
  },
  createAdminGalleryImage: (data) =>
    request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminGalleryImage: (id, data) =>
    request(`/admin/gallery/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminGalleryImage: (id) =>
    request(`/admin/gallery/${id}`, { method: 'DELETE' }),

  // ── Admin — Settings / Users ──────────────────────────────────────────
  getAdminUsers: () => request('/admin/settings/users'),
  createAdminUser: (data) =>
    request('/admin/settings/users', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminUser: (id, data) =>
    request(`/admin/settings/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAdminUser: (id) =>
    request(`/admin/settings/users/${id}`, { method: 'DELETE' }),

  // ── Admin — Export ─────────────────────────────────────────────────────
  exportBookings: () => fetch(`${BASE}/admin/export?type=bookings`),
};
