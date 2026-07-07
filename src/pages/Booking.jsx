import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import handPointLeft from '../assets/svg/hand-point-left.svg';
import { getPackages, createBooking } from '../api';
import { getUser } from '../auth';
import { confirmBooking, toastError } from '../utils/swal';
import Loader from '../components/Loader';

const Booking = () => {
    const { pkg }  = useParams();
    const navigate = useNavigate();
    const user     = getUser();

    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading]         = useState(true);
    const [submitted, setSubmitted]     = useState(false);

    const [form, setForm] = useState({
        name:      user?.username || '',
        email:     user?.email    || '',
        phone:     user?.phone    || '',
        date: '', location: '', eventType: '', notes: '',
    });

    useEffect(() => { if (!user) navigate('/login', { replace: true }); }, []);

    useEffect(() => {
        const id = parseInt(pkg);
        if (!isNaN(id)) {
            getPackages()
                .then(pkgs => { setPackageData(pkgs.find(p => p.id === id) || null); setLoading(false); })
                .catch(() => setLoading(false));
        } else setLoading(false);
    }, [pkg]);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifikasi 2 langkah sebelum submit
        const confirmed = await confirmBooking(
            packageData.name,
            packageData.price,
            form.date,
            form.location,
        );
        if (!confirmed) return;

        try {
            const res = await createBooking({
                package_id: packageData.id,
                event_type: form.eventType,
                event_date: form.date,
                location:   form.location,
                notes:      form.notes,
            });
            if (res.id) {
                setSubmitted(true);
            } else {
                toastError(res.detail || "Gagal membuat booking.");
            }
        } catch {
            toastError("Gagal terhubung ke server.");
        }
    };

    if (!user) return null;

    if (loading) return (
        <section className="min-h-screen bg-[#f0f0ee] flex items-center justify-center"><Loader /></section>
    );

    if (!packageData) return (
        <section className="min-h-screen bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-12">
            <Link to="/" className="inline-flex gap-3 items-center bg-[#063D30] px-5 py-2 rounded-full text-white mb-8">
                <img src={handPointLeft} alt="back" className="w-5" /><p>Kembali</p>
            </Link>
            <p className="text-gray-500">Paket tidak ditemukan.</p>
        </section>
    );

    if (submitted) return (
        <section className="min-h-screen bg-[#f0f0ee] flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#063D30] flex items-center justify-center">
                <span className="text-white text-4xl">✓</span>
            </div>
            <h1 className="text-[#063D30] text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>
                Pemesanan Berhasil!
            </h1>
            <p className="text-gray-500 text-sm max-w-sm">
                Tim Veloura Visual akan menghubungi kamu di <strong>{form.email}</strong> dalam 1×24 jam.
            </p>
            <Link to="/" className="bg-[#063D30] text-white px-8 py-3 rounded-full font-bold hover:opacity-80 transition">
                Kembali ke Beranda
            </Link>
        </section>
    );

    const inp = "w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-[#063D30] transition";
    const ro  = "w-full border border-gray-200 p-3 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed";

    return (
        <section className="min-h-screen bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-12 md:py-20">
            <Link to="/" className="inline-flex gap-3 items-center bg-[#063D30] px-5 py-2 rounded-full text-white mb-8">
                <img src={handPointLeft} alt="back" className="w-5" /><p>Kembali</p>
            </Link>

            <h1 className="text-[32px] sm:text-[42px] font-black text-[#063D30] mb-1"
                style={{ fontFamily: "'Anton', sans-serif" }}>Booking Details</h1>
            <p className="text-sm text-gray-500 mb-8">
                Login sebagai <span className="font-semibold text-[#063D30]">{user.username}</span>
                {' · '}
                <Link to="/login" className="text-red-400 hover:underline text-xs">Ganti akun</Link>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {/* Package Info */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between border-4 border-[#f5d000]">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#f5d000] bg-[#063D30] px-3 py-1 rounded-full">
                            {packageData.type}
                        </span>
                        <h3 className="text-xl font-bold text-[#063D30] mt-4 mb-2">{packageData.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{packageData.description}</p>
                        <div className="flex items-baseline gap-1 mb-5">
                            <span className="text-3xl sm:text-4xl font-black text-[#063D30]"
                                style={{ fontFamily: "'Anton', sans-serif" }}>
                                {'Rp' + Number(packageData.price).toLocaleString('id-ID')}
                            </span>
                            <span className="text-sm text-gray-400">/ {packageData.duration}</span>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {packageData.features?.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="text-[#063D30] font-bold">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-400">Paket yang dipilih</div>
                </div>

                {/* Form */}
                <div className="bg-white p-5 sm:p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-5 text-[#063D30]">Detail Pemesanan</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {[
                            { label: 'Nama Lengkap', name: 'name', type: 'text', ro: false },
                            { label: 'Email',        name: 'email', type: 'email', ro: !!user.email, badge: user.email },
                            { label: 'Nomor Telepon', name: 'phone', type: 'tel', ro: !!user.phone, badge: user.phone },
                        ].map(f => (
                            <div key={f.name}>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    {f.label}
                                    {f.badge && <span className="ml-2 text-green-500 normal-case font-normal">✓ dari akun</span>}
                                </label>
                                <input type={f.type} name={f.name} value={form[f.name]}
                                    onChange={handleChange} required readOnly={f.ro}
                                    className={f.ro ? ro : inp} />
                            </div>
                        ))}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal Acara</label>
                            <input type="date" name="date" value={form.date} onChange={handleChange} required className={inp} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Lokasi Acara</label>
                            <input type="text" name="location" value={form.location} onChange={handleChange} required className={inp} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Jenis Acara</label>
                            <select name="eventType" value={form.eventType} onChange={handleChange} required className={inp + " text-gray-600"}>
                                <option value="">Pilih jenis acara</option>
                                <option value="wedding">Pernikahan</option>
                                <option value="graduation">Wisuda</option>
                                <option value="birthday">Ulang Tahun</option>
                                <option value="corporate">Korporat</option>
                                <option value="daily">Foto Harian</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Catatan Tambahan</label>
                            <textarea name="notes" value={form.notes} onChange={handleChange}
                                placeholder="Opsional" rows={3} className={inp + " resize-none"} />
                        </div>
                        <button type="submit"
                            className="w-full bg-[#063D30] text-white py-3 rounded-full font-bold hover:opacity-90 transition">
                            Konfirmasi Pemesanan
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Booking;
