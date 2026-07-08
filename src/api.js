import { getToken, removeUser, getRefreshToken, setToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// ── Response handler ──────────────────────────────────────────────────────────

const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    data._status = res.status;
    return data;
};

// Authenticated request — coba refresh token jika 401, baru redirect
const handleAuthResponse = async (res, retryFn) => {
    if (res.status === 401) {
        // Coba refresh token dulu
        const refresh = getRefreshToken();
        if (refresh) {
            try {
                const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/token-refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh }),
                });
                const refreshData = await refreshRes.json();
                if (refreshData.access) {
                    setToken(refreshData.access, refreshData.refresh || refresh);
                    // Retry request dengan token baru
                    if (retryFn) return retryFn();
                }
            } catch { /* refresh gagal, lanjut logout */ }
        }
        // Token tidak bisa di-refresh — logout
        removeUser();
        window.location.href = '/login';
        throw new Error('Sesi berakhir. Silakan login kembali.');
    }
    const data = await res.json().catch(() => ({}));
    data._status = res.status;
    return data;
};

// ── Request helpers ───────────────────────────────────────────────────────────

const get = (url) =>
    fetch(`${BASE_URL}${url}`).then(handleResponse);

const authGet = (url) => {
    const doFetch = () =>
        fetch(`${BASE_URL}${url}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        }).then(res => handleAuthResponse(res, doFetch));
    return doFetch();
};

const authPost = (url, body) => {
    const doFetch = () =>
        fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(body),
        }).then(res => handleAuthResponse(res, doFetch));
    return doFetch();
};

const post = (url, body) =>
    fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(handleResponse);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginAPI = (username, password) =>
    post('/api/v1/auth/sign-in', { username, password });

export const registerAPI = (data) =>
    post('/api/v1/register/', data);

export const refreshTokenAPI = (refresh) =>
    post('/api/v1/auth/token-refresh', { refresh });

// ── Protected endpoints ───────────────────────────────────────────────────────

export const getMe         = ()     => authGet('/api/v1/me/');
export const getMyBookings = ()     => authGet('/api/v1/my-bookings/');
export const createBooking = (data) => authPost('/api/v1/create-booking/', data);
export const createReview  = (data) => authPost('/api/v1/create-review/', data);

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
export const getPhotographerStats = ()   => get('/api/v1/photographers/');

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

export const getReviewStat = () => get('/api/v1/review-stats/');

// ── Legacy ────────────────────────────────────────────────────────────────────
export const getCourseStats  = () => get('/api/v1/package-stats/');
export const getCourseDetail = (id) => get(`/api/v1/bookings/${id}/`);
export const getBookings     = () => getMyBookings();
