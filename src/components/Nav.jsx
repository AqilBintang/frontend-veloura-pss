import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import navImg from '../assets/img/nav.png';
import { getUser, removeUser } from '../auth';
import { confirmLogout } from '../utils/swal';

const Nav = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const scrollTo = (id) => {
        setOpen(false);
        const doScroll = () => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        };
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(doScroll, 100);
        } else {
            doScroll();
        }
    };

    const handleLogout = async () => {
        const ok = await confirmLogout();
        if (!ok) return;
        removeUser();
        setOpen(false);
        navigate('/');
    };

    return (
        <>
            <div className='absolute p-9 w-full flex justify-between items-center text-lg font-semibold text-black'>
                <span style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 800}} className='text-2xl'>VelouraVisual</span>
                <div className="relative">
                    {/* Trigger */}
                    <div
                        onClick={() => user ? setOpen(!open) : navigate('/login')}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <i className="fa-solid fa-circle-user text-2xl text-[#063D30]"></i>
                        {user && (
                            <span className="text-sm font-semibold text-[#063D30] hidden md:block">
                                {user.username}
                            </span>
                        )}
                    </div>

                    {/* Dropdown — hanya muncul jika sudah login */}
                    {open && user && (
                        <div className="absolute right-0 mt-3 w-[220px] bg-white rounded-xl shadow-lg py-2 z-50">
                            <div className="px-5 py-2 text-sm text-gray-400">
                                Selamat datang, <span className="font-semibold text-[#063D30]">{user.username}</span>!
                            </div>

                            <Link to="/orders" onClick={() => setOpen(false)} className="w-full text-left px-5 py-3 transition-all duration-300 hover:bg-[#063D30]/10 hover:pl-6 block text-sm">
                                <i className="fas fa-shopping-bag mr-2 text-[#063D30]"></i>
                                Pesanan Saya
                            </Link>

                            <Link to="/profile" onClick={() => setOpen(false)} className="w-full text-left px-5 py-3 transition-all duration-300 hover:bg-[#063D30]/10 hover:pl-6 block text-sm">
                                <i className="fas fa-user mr-2 text-[#063D30]"></i>
                                Profil Saya
                            </Link>

                            <div className="border-t my-2"></div>

                            <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-500 transition-all duration-300 hover:bg-red-50 hover:pl-6">
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <nav className="fixed left-1/2 -translate-x-1/2 top-6 z-50 hidden md:block">
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/30 backdrop-blur-xl">
                    <img src={navImg} alt="logo" className="h-8 w-auto rounded-full" />

                    <div className="flex gap-2">
                        <button onClick={() => scrollTo('hero')}
                            className="px-4 py-2 text-sm font-semibold text-black rounded-full hover:bg-white/60 transition cursor-pointer">
                            Home
                        </button>
                        <button onClick={() => scrollTo('about')}
                            className="px-4 py-2 text-sm font-semibold text-black rounded-full hover:bg-white/60 transition cursor-pointer">
                            About
                        </button>
                        <button onClick={() => scrollTo('faqs')}
                            className="px-4 py-2 text-sm font-semibold text-black rounded-full hover:bg-white/60 transition cursor-pointer">
                            FAQ
                        </button>
                        <button onClick={() => scrollTo('reserve')}
                            className="px-4 py-2 text-sm font-semibold text-black rounded-full hover:bg-white/60 transition cursor-pointer">
                            Reserve
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Nav;