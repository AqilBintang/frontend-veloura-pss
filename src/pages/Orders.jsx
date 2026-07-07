import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import handPointLeft from '../assets/svg/hand-point-left.svg';
import { getMyBookings } from '../api';
import { getUser, isLoggedIn } from '../auth';
import Loader from '../components/Loader';

const STATUS_MAP = {
    'Menunggu Konfirmasi': { label: 'Menunggu',     style: 'bg-gray-100 text-gray-600' },
    'Dikonfirmasi':        { label: 'Dikonfirmasi', style: 'bg-blue-100 text-blue-700' },
    'Sedang Berlangsung':  { label: 'Berlangsung',  style: 'bg-yellow-100 text-yellow-700' },
    'Selesai':             { label: 'Selesai',      style: 'bg-green-100 text-green-700' },
    'Dibatalkan':          { label: 'Dibatalkan',   style: 'bg-red-100 text-red-500' },
};

const formatPrice = (price) => 'Rp' + Number(price).toLocaleString('id-ID');

const Orders = () => {
    const user     = getUser();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // Redirect ke login jika belum login
    useEffect(() => {
        if (!isLoggedIn()) { navigate('/login', { replace: true }); return; }

        getMyBookings()
            .then(data => {
                if (data.bookings) {
                    setBookings(data.bookings);
                } else if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    // 401 / token expired — redirect login
                    navigate('/login', { replace: true });
                }
                setLoading(false);
            })
            .catch(() => { setError('Gagal memuat data pesanan.'); setLoading(false); });
    }, [navigate]);

    return (
        <section className="min-h-screen bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-12 md:py-20">
            <Link to="/" className="inline-flex gap-3 items-center bg-[#063D30] px-5 py-2 rounded-full text-white mb-8">
                <img src={handPointLeft} alt="back" className="w-5" />
                <p className="text-sm font-semibold">Kembali</p>
            </Link>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[#063D30]">Riwayat</p>
                        <h1 className="text-[#063D30] text-[36px] sm:text-[48px] font-black leading-none"
                            style={{ fontFamily: "'Anton', sans-serif" }}>
                            Pesanan Saya
                        </h1>
                    </div>
                    <Link to="/profile"
                        className="px-4 py-2 rounded-full border border-[#063D30] text-[#063D30] text-sm font-semibold hover:bg-[#063D30] hover:text-white transition whitespace-nowrap">
                        Profil Saya
                    </Link>
                </div>

                {loading && <div className="flex justify-center py-20"><Loader /></div>}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-red-600 text-sm">{error}</div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="bg-white rounded-3xl px-6 py-16 text-center">
                        <p className="text-gray-400 text-sm mb-6">Belum ada pesanan.</p>
                        <Link to="/" className="bg-[#063D30] text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 transition">
                            Lihat Paket
                        </Link>
                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {bookings.map((booking) => {
                            const s = STATUS_MAP[booking.status] || { label: booking.status, style: 'bg-gray-100 text-gray-600' };
                            return (
                                <div key={booking.id}
                                    className="bg-white rounded-2xl px-4 sm:px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#063D30]/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[#063D30]">📷</span>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-[#063D30] font-bold text-sm">{booking.package?.name}</h3>
                                                <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${s.style}`}>{s.label}</span>
                                            </div>
                                            <p className="text-gray-500 text-xs">{booking.event_type} · {booking.event_date} · {booking.location}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">
                                                #{String(booking.id).padStart(3, '0')} · {booking.photographer?.name || 'Fotografer belum ditentukan'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:flex-shrink-0">
                                        <p className="text-[#063D30] font-black text-base sm:text-lg"
                                            style={{ fontFamily: "'Anton', sans-serif" }}>
                                            {formatPrice(booking.total_price)}
                                        </p>
                                        <Link to={`/booking-detail/${booking.id}`}
                                            className="px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-xs font-semibold hover:border-[#063D30] hover:text-[#063D30] transition whitespace-nowrap">
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && (
                    <div className="mt-6 bg-[#063D30] rounded-2xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Pesanan</p>
                            <p className="text-white text-2xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>
                                {bookings.length} Pesanan
                            </p>
                        </div>
                        <Link to="/"
                            onClick={() => setTimeout(() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                            className="px-6 py-3 rounded-full bg-[#f5d000] text-[#063D30] text-sm font-bold hover:brightness-95 transition whitespace-nowrap">
                            + Pesan Lagi
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Orders;
