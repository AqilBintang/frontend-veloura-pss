import { getToken, removeUser } from './auth';

// URL backend — dari env var, fallback localhost untuk development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// ── Response handler ──────────────────────────────────────────────────────────

const handleResponse = async (res) => {
    // Token expired atau tidak valid — hapus session lokal
    if (res.status === 401) {
        removeUser();
        window.location.href = '/login';
        throw new Error('Sesi berakhir. Silakan login kembali.');
    }
    // Parse JSON untuk semua response (termasuk error)
    const data = await res.json().catch(() => ({}));
    return data;
};

// ── Request helpers ───────────────────────────────────────────────────────────

const get = (url) =>
    fetch(`${BASE_URL}${url}`).then(handleResponse);

// Request dengan JWT token di header Authorization
const authGet = (url) =>
    fetch(`${BASE_URL}${url}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    }).then(handleResponse);

const authPost = (url, body) =>
    fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
    }).then(handleResponse);

const post = (url, body) =>
    fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(handleResponse);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginAPI        = (username, password) =>
    post('/api/v1/auth/sign-in', { username, password });

export const registerAPI     = (data) =>
    post('/api/v1/register/', data);

export const refreshTokenAPI = (refresh) =>
    post('/api/v1/auth/token-refresh', { refresh });

// ── Protected endpoints (butuh JWT) ──────────────────────────────────────────

export const getMe          = ()     => authGet('/api/v1/me/');
export const getMyBookings  = ()     => authGet('/api/v1/my-bookings/');
export const createBooking  = (data) => authPost('/api/v1/bookings/create/', data);
export const createReview   = (data) => authPost('/api/v1/reviews/create/', data);

// ── Public endpoints ──────────────────────────────────────────────────────────

export const getPackages = () =>
    get('/api/v1/packages/').then(list =>
        Array.isArray(list)
            ? list.map(p => ({ ...p, type: p.package_type, tier: p.package_tier }))
            : []
    );

export const getPackageDetail = (id) =>
    get(`/api/v1/packages/${id}/`).then(p => ({
        ...p, type: p.package_type, tier: p.package_tier,
    }));

export const getPackageStat       = ()   => get('/api/v1/package-stats/');
export const getBookingStat       = ()   => get('/api/v1/booking-stats/');
export const getBookingDetail     = (id) => get(`/api/v1/bookings/${id}/`);

export const getReviews = () =>
    get('/api/v1/reviews/').then(list =>
        Array.isArray(list)
            ? list.map(r => ({
                ...r,
                client: { username: r.client_username, fullname: r.client_fullname },
                package: { name: r.package_name, type: r.package_type },
            }))
            : []
    );

export const getReviewStat        = ()   => get('/api/v1/review-stats/');
export const getPhotographerStats = ()   => get('/api/v1/photographers/');

// ── Legacy ────────────────────────────────────────────────────────────────────
export const getCourseStats  = ()   => get('/api/v1/package-stats/');
export const getCourseDetail = (id) => get(`/api/v1/bookings/${id}/`);
