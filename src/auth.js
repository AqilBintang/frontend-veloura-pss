// Auth helper — user info + JWT token di localStorage

const USER_KEY     = 'vv_user';
const TOKEN_KEY    = 'vv_access';
const REFRESH_KEY  = 'vv_refresh';
const REGISTRY_KEY = 'vv_registry';

// ── User ──────────────────────────────────────────────────────────────────────

export const getUser = () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; }
    catch { return null; }
};

export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

export const isLoggedIn = () => !!getUser();

// ── JWT Token ─────────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem(TOKEN_KEY) || null;

export const setToken = (access, refresh) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || null;

// ── Registered users registry (fallback local) ───────────────────────────────

const getRegistry = () => {
    try { return JSON.parse(localStorage.getItem(REGISTRY_KEY)) || []; }
    catch { return []; }
};

export const registerUser = (user) => {
    const registry = getRegistry();
    // Simpan hanya field yang tidak sensitif — JANGAN simpan password
    const safeUser = { username: user.username, email: user.email, phone: user.phone || '' };
    if (!registry.find((u) => u.email === safeUser.email)) {
        registry.push(safeUser);
        localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    }
};

export const findUserByEmail  = (email) => getRegistry().find((u) => u.email === email) || null;
export const isEmailRegistered = (email) => !!findUserByEmail(email);
