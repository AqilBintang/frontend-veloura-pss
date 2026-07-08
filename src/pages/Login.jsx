import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { setUser, setToken, registerUser, isEmailRegistered, findUserByEmail } from "../auth";
import { loginAPI, registerAPI } from "../api";
import { decodeGoogleJwt } from "../utils/oauthHelpers";
import { toastSuccess, toastError } from "../utils/swal";
import "./Login.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    // Register state
    const [reg, setReg] = useState({ username: "", email: "", phone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [emailReadOnly, setEmailReadOnly] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePhone = (phone) => {
        const parsed = parsePhoneNumberFromString(phone, "ID");
        return parsed && parsed.isValid();
    };

    const handleRegChange = (e) => {
        const { name, value } = e.target;
        setReg((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRegSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!reg.username.trim()) newErrors.username = "Username wajib diisi.";
        if (!reg.email.trim()) {
            newErrors.email = "Email wajib diisi.";
        } else if (!validateEmail(reg.email)) {
            newErrors.email = "Format email tidak valid.";
        }
        if (!reg.phone.trim()) {
            newErrors.phone = "Nomor telepon wajib diisi.";
        } else if (!validatePhone(reg.phone)) {
            newErrors.phone = "Nomor telepon tidak valid. Contoh: 08123456789";
        }
        if (!reg.password.trim()) newErrors.password = "Password wajib diisi.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Kirim ke backend Django Ninja
            const res = await registerAPI({
                username:   reg.username,
                password:   reg.password,
                email:      reg.email,
                first_name: reg.username,
                last_name:  '',
            });

            if (res.id) {
                // Berhasil register — langsung login untuk dapat JWT token
                const userData = { username: res.username, email: res.email, phone: reg.phone };
                registerUser(userData);

                // Hit backend untuk dapat JWT token
                try {
                    const loginRes = await loginAPI(reg.username, reg.password);
                    if (loginRes.access) {
                        setToken(loginRes.access, loginRes.refresh);
                    }
                } catch { /* token tidak dapat, tapi register tetap berhasil */ }

                setUser(userData);
                toastSuccess(`Registrasi berhasil! Selamat datang, ${res.username}.`);
                setTimeout(() => navigate("/"), 1500);
            } else {
                // Error dari backend — extract pesan dari format Pydantic/Django Ninja
                let msg = "Registrasi gagal.";
                if (typeof res.detail === 'string') {
                    msg = res.detail;
                } else if (Array.isArray(res.detail)) {
                    msg = res.detail.map(e => e.msg).join(', ');
                }
                toastError(msg);
            }
        } catch {
            toastError("Gagal terhubung ke server.");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value.trim();
        const password = e.target.password.value;

        try {
            // Hit backend: POST /api/v1/auth/sign-in/
            const res = await loginAPI(username, password);

            if (res.access) {
                setToken(res.access, res.refresh);
                setUser({ username, email: '', phone: '' });
                toastSuccess(`Selamat datang kembali, ${username}!`);
                setTimeout(() => navigate("/"), 1500);
            } else {
                toastError("Username atau password salah.");
            }
        } catch {
            toastError("Gagal terhubung ke server.");
        }
    };

    // ── Google OAuth ──────────────────────────────────────────────────────────

    /**
     * Callback dipanggil Google GSI setelah user memilih akun.
     * Pada form Register: auto-fill email dari akun Google.
     * Pada form Login: langsung login dengan data Google.
     */
    const handleGoogleResponse = (response) => {
        const payload = decodeGoogleJwt(response.credential);
        if (!payload) return;

        const { email, name, given_name } = payload;

        if (isActive) {
            // Register mode — auto-fill email
            setReg((prev) => ({
                ...prev,
                email: email || prev.email,
                username: prev.username || given_name || name || "",
            }));
            setEmailReadOnly(true);
            setErrors((prev) => ({ ...prev, email: "" }));
        } else {
            // Login mode — cek apakah email sudah terdaftar di registry lokal
            if (!isEmailRegistered(email)) {
                toastError(`Alamat ${email} belum terdaftar. Silakan register terlebih dahulu.`);
                setReg((prev) => ({
                    ...prev,
                    email: email || prev.email,
                    username: prev.username || given_name || name || "",
                }));
                setEmailReadOnly(true);
                setIsActive(true);
                return;
            }

            // Email terdaftar — ambil data user lokal
            const localUser = findUserByEmail(email);

            // Coba login ke backend dengan username (password tidak tersimpan di localStorage)
            // Jika gagal, tetap set user tanpa JWT (fitur terbatas)
            try {
                const loginRes = await loginAPI(localUser.username, '');
                if (loginRes.access) {
                    setToken(loginRes.access, loginRes.refresh);
                }
            } catch { /* login backend gagal, lanjut tanpa JWT */ }

            setUser(localUser);
            toastSuccess(`Login berhasil! Selamat datang, ${localUser.username}.`);
            setTimeout(() => navigate("/"), 1500);
        }
    };

    // Inisialisasi Google GSI — guard agar tidak dipanggil berkali-kali
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") return;
        if (!window.google) return;

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const handleGoogleClick = () => {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") {
            toastError("Google Client ID belum dikonfigurasi.");
            return;
        }
        if (!window.google) {
            toastError("Google Identity Services belum dimuat. Coba refresh halaman.");
            return;
        }
        window.google.accounts.id.prompt();
    };

    // ── Facebook OAuth (placeholder) ─────────────────────────────────────────
    const handleFacebookClick = () => {
        toastError("Login dengan Facebook belum tersedia.");
    };

    // Reset email read-only saat berpindah form
    const switchToRegister = () => {
        setIsActive(true);
    };

    const switchToLogin = () => {
        setIsActive(false);
        setEmailReadOnly(false);
    };

    return (
        <div className="login-wrapper">

            <div className={`container ${isActive ? "active" : ""}`}>

                {/* ── LOGIN FORM ── */}
                <div className="form-box login">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>

                        <div className="input-box">
                            <input type="text" name="username" placeholder="Username" required />
                            <i className="bx bxs-user"></i>
                        </div>

                        <div className="input-box">
                            <input type="password" name="password" placeholder="Password" required />
                            <i className="bx bxs-lock-alt"></i>
                        </div>

                        <div className="forgot-link">
                            <a href="#">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn">Login</button>

                        <p>or login with social platforms</p>

                        <div className="social-icons">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleGoogleClick(); }}
                                title="Login dengan Google"
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleFacebookClick(); }}
                                title="Login dengan Facebook"
                            >
                                <i className="bx bxl-facebook"></i>
                            </a>
                        </div>
                    </form>
                </div>

                {/* ── REGISTER FORM ── */}
                <div className="form-box register">
                    <form onSubmit={handleRegSubmit} noValidate>
                        <h1>Registration</h1>

                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={reg.username}
                                onChange={handleRegChange}
                                required
                            />
                            <i className="bx bxs-user"></i>
                            {errors.username && <span className="field-error">{errors.username}</span>}
                        </div>

                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={reg.email}
                                onChange={handleRegChange}
                                readOnly={emailReadOnly}
                                className={emailReadOnly ? "email-filled" : ""}
                                required
                            />
                            <i className={`bx ${emailReadOnly ? "bxs-check-circle email-icon-filled" : "bxs-envelope"}`}></i>
                            {emailReadOnly && (
                                <span className="email-hint">Email diisi otomatis dari Google</span>
                            )}
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        <div className="input-box">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Nomor Telepon (cth: 08123456789)"
                                value={reg.phone}
                                onChange={handleRegChange}
                                required
                            />
                            <i className="bx bxs-phone"></i>
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={reg.password}
                                onChange={handleRegChange}
                                required
                            />
                            <i className="bx bxs-lock-alt"></i>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <button type="submit" className="btn">Register</button>

                        <p>or register with social platforms</p>

                        <div className="social-icons">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleGoogleClick(); }}
                                title="Register dengan Google — email akan terisi otomatis"
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleFacebookClick(); }}
                                title="Register dengan Facebook"
                            >
                                <i className="bx bxl-facebook"></i>
                            </a>
                        </div>
                    </form>
                </div>

                {/* ── TOGGLE BOX ── */}
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1>Hello, Welcome!</h1>
                        <p>Belum punya akun?</p>
                        <button className="btn" onClick={switchToRegister}>
                            Register
                        </button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1>Welcome Back!</h1>
                        <p>Sudah punya akun?</p>
                        <button className="btn" onClick={switchToLogin}>
                            Login
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
