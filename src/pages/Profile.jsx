import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import handPointLeft from '../assets/svg/hand-point-left.svg';
import { getUser, setUser, removeUser, isLoggedIn } from '../auth';
import { confirmLogout, confirmSaveProfile, toastSuccess } from '../utils/swal';

const Profile = () => {
    const navigate = useNavigate();
    const user = getUser();

    // Redirect ke login jika belum login
    useEffect(() => {
        if (!isLoggedIn()) navigate('/login', { replace: true });
    }, [navigate]);

    const [form, setForm] = useState({
        name:  user?.username || '',
        email: user?.email    || '',
        phone: user?.phone    || '',
        city:  user?.city     || '',
        bio:   user?.bio      || '',
    });

    const [editing, setEditing] = useState(false);
    const [saved, setSaved]     = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        const confirmed = await confirmSaveProfile();
        if (!confirmed) return;
        setUser({ ...user, ...form });
        setEditing(false);
        setSaved(true);
        toastSuccess("Profil berhasil disimpan!");
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <section className="min-h-screen bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-12 md:py-20">
            <Link to="/" className="inline-flex gap-3 items-center bg-[#063D30] px-5 py-2 rounded-full text-white mb-8">
                <img src={handPointLeft} alt="back" className="w-5" />
                <p className="text-sm font-semibold">Kembali</p>
            </Link>

            <div className="max-w-3xl mx-auto">
                {/* Header card */}
                <div className="bg-[#063D30] rounded-3xl px-5 sm:px-8 md:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f5d000] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#063D30] text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>
                            {form.name.charAt(0) || '?'}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-[#f5d000] text-xs font-bold uppercase tracking-widest mb-1">Profil Saya</p>
                        <h1 className="text-white text-2xl sm:text-[32px] font-black leading-tight truncate"
                            style={{ fontFamily: "'Anton', sans-serif" }}>
                            {form.name || '—'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 truncate">{form.email}</p>
                    </div>

                    <Link to="/orders"
                        className="px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition whitespace-nowrap">
                        Pesanan Saya
                    </Link>
                </div>

                {/* Form card */}
                <div className="bg-white rounded-3xl px-5 sm:px-8 md:px-10 py-8">
                    <div className="flex items-center justify-between mb-6 gap-4">
                        <h2 className="text-[#063D30] text-lg font-bold">Informasi Akun</h2>
                        {!editing ? (
                            <button onClick={() => setEditing(true)}
                                className="px-4 py-2 rounded-full bg-[#063D30] text-white text-sm font-semibold hover:opacity-80 transition whitespace-nowrap">
                                Edit Profil
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(false)}
                                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                                    Batal
                                </button>
                                <button onClick={handleSave}
                                    className="px-4 py-2 rounded-full bg-[#f5d000] text-[#063D30] text-sm font-bold hover:brightness-95 transition">
                                    Simpan
                                </button>
                            </div>
                        )}
                    </div>

                    {saved && (
                        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                            ✓ Profil berhasil disimpan
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { label: "Nama Lengkap",   name: "name",  type: "text" },
                            { label: "Email",          name: "email", type: "email" },
                            { label: "Nomor Telepon",  name: "phone", type: "text" },
                            { label: "Kota",           name: "city",  type: "text" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    {field.label}
                                </label>
                                {editing ? (
                                    <input type={field.type} name={field.name} value={form[field.name]}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#063D30] focus:outline-none focus:border-[#063D30] transition" />
                                ) : (
                                    <p className="text-[#063D30] text-sm font-medium px-4 py-3 bg-[#f0f0ee] rounded-xl min-h-[46px]">
                                        {form[field.name] || <span className="text-gray-400">—</span>}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bio</label>
                            {editing ? (
                                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#063D30] focus:outline-none focus:border-[#063D30] transition resize-none" />
                            ) : (
                                <p className="text-[#063D30] text-sm font-medium px-4 py-3 bg-[#f0f0ee] rounded-xl min-h-[46px]">
                                    {form.bio || <span className="text-gray-400">—</span>}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Akun</p>
                        <button onClick={async () => {
                                const ok = await confirmLogout();
                                if (ok) { removeUser(); navigate('/'); }
                            }}
                            className="px-5 py-2 rounded-full border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
