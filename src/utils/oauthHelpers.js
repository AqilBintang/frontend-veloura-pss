/**
 * Decode JWT payload dari Google credential response
 * tanpa perlu library eksternal — Google GSI mengirim JWT sederhana
 */
export const decodeGoogleJwt = (credential) => {
    try {
        const base64 = credential.split('.')[1];
        // Pad base64 string agar valid
        const padded = base64.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
};
