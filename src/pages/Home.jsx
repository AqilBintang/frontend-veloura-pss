import hero1 from '../assets/img/hero1.png'
import hero2 from '../assets/img/hero2.png'
import about from '../assets/img/about.png'
import quality1 from '../assets/img/quality1.png'
import quality2 from '../assets/img/quality2.png'
import quality3 from '../assets/img/quality3.png'
import Lightning from '../assets/svg/Lightning.svg'
import AboutSvg from '../assets/svg/About.svg'
import experience1 from '../assets/img/experience1.png'
import experience1Child from '../assets/img/experience1-child.png'
import experience1Child2 from '../assets/img/experience1-child2.png'
import client from '../assets/img/client.png'
import lastContent from '../assets/img/last-content.png'


import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getPackages, getReviews } from '../api';

const FaqItem = ({ question, answer }) => {
    return (
        <details className="group border-s-4 border-[#f5d000] bg-[#0a4f3f] p-5 [&_summary::-webkit-details-marker]:hidden rounded-r-xl">
            <summary className="flex items-center justify-between gap-4 cursor-pointer">
                <h3 className="text-white text-sm font-medium">{question}</h3>
                <svg
                    className="size-5 shrink-0 text-[#f5d000] transition-transform duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <p className="pt-4 text-gray-300 text-sm leading-relaxed">
                {answer}
            </p>
        </details>
    );
};

const Home = () => {
    const title = "Abadikan Setiap Momenmu.";
    const desc = "Veloura Visual hadir untuk mengabadikan setiap momen berharga — dari event besar hingga keseharian yang penuh cerita.";
    const cta = "Pesan Sekarang!";

    const [t1, setT1] = useState("");
    const [t2, setT2] = useState("");
    const [showCTA, setShowCTA] = useState(false);
    const [planType, setPlanType] = useState("harian");

    // ── Backend data
    const [packages, setPackages]     = useState([]);
    const [reviews, setReviews]       = useState([]);
    const [reviewIdx, setReviewIdx]   = useState(0);
    const [reviewVisible, setReviewVisible] = useState(true);

    useEffect(() => {
        getPackages().then(setPackages).catch(() => {});
        getReviews().then(setReviews).catch(() => {});
    }, []);

    // Auto-rotate testimonial setiap 5 detik dengan animasi fade-up
    useEffect(() => {
        if (reviews.length <= 1) return;
        const timer = setInterval(() => {
            setReviewVisible(false);
            setTimeout(() => {
                setReviewIdx(prev => (prev + 1) % reviews.length);
                setReviewVisible(true);
            }, 400);
        }, 5000);
        return () => clearInterval(timer);
    }, [reviews.length]);
    useEffect(() => {
        let i = 0;

        const typing1 = setInterval(() => {
            setT1(title.slice(0, i));
            i++;
            if (i > title.length) {
                clearInterval(typing1);

                let j = 0;
                const typing2 = setInterval(() => {
                    setT2(desc.slice(0, j));
                    j++;
                    if (j > desc.length) {
                        clearInterval(typing2);

                        // trigger fade up button
                        setTimeout(() => {
                            setShowCTA(true);
                        }, 300);
                    }
                }, 20);
            }
        }, 50);

        return () => clearInterval(typing1);
    }, []);

    return (
        <>
            <section id="hero" className="min-h-screen bg-[#f0f0ee] flex items-center px-4 sm:px-8 md:px-12 py-24 overflow-hidden">
                {/* Left */}
                <div className="flex-1 z-10">
                    <h1
                        className="text-[30px] sm:text-[56px] md:text-[72px] leading-none font-black uppercase text-[#063D30] mb-4"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                        {t1}
                    </h1>

                    <p
                        className="text-gray-600 text-md text-justify max-w-md mb-8 leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {t2}
                    </p>

                    <Link to="/reserve" className={`
                            inline-block
                            bg-yellow-400 text-[#063D30] hover:bg-yellow-600 font-bold px-6 py-3 rounded-full
                            transition-all duration-700 ease-out
                            ${showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                        `}
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                            {cta}
                    </Link>
                </div>

                {/* Right — stacked images + lightning */}
                <div className="flex-1 relative h-[480px] hidden md:block">
                    {/* Back image */}
                    <div className="absolute top-0 right-16 w-[300px] h-[220px] p-2 overflow-hidden 
                    rotate-6 hover:rotate-1 
                    transition-transform duration-300 ease-out">
                        <img src={hero2} className="w-full h-full object-cover rounded-2xl shadow-lg" />
                    </div>

                    {/* Front image */}
                    <div className="absolute bottom-0 right-30 w-[340px] h-[320px] p-2 
                    rotate-[-10deg] hover:rotate-1 
                    transition-transform duration-300 ease-out">
                        <img src={Lightning} className="w-[80px] absolute -top-8 -left-5 z-30" />
                        
                        <div className="rounded-2xl overflow-hidden shadow-xl w-full h-full">
                            <img src={hero1} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative bg-[#063D30] px-8 py-16 flex items-center gap-16 overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-38 pointer-events-none"
                    style={{
                        background: `linear-gradient(
                        180deg,
                        rgba(240,240,238,1) 0%,
                        rgba(240,240,238,0.8) 20%,
                        rgba(6,61,48,0.4) 60%,
                        rgba(6,61,48,1) 100%
                        )`
                    }}
                ></div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-[#063D30] px-4 sm:px-8 md:px-12 py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16 overflow-hidden">
                {/* Left */}
                <div className="flex-2">
                    <p className="text-[#f5d000] text-xs font-bold uppercase tracking-widest mb-3">Tentang Kami</p>
                    <h2
                        className="text-white text-[28px] sm:text-[44px] md:text-[52px] leading-tight font-black mb-6"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                        Foto yang Bicara, <br /> Momen yang Abadi
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-sm text-justify">
                        Veloura Visual adalah tim fotografer profesional yang berdedikasi mengabadikan setiap momen dengan penuh rasa. Dari pernikahan, ulang tahun, event korporat, hingga sesi foto harian — kami hadir dengan mata yang tajam dan hati yang peka untuk menciptakan karya visual yang tak terlupakan.
                    </p>
                </div>

                <div className="flex-1 flex justify-center items-center hidden md:flex">
    
                    {/* GROUP */}
                    <div className="relative rotate-[-6deg] w-[420px] h-[260px]">
                        
                        {/* IMAGE */}
                        <div className="rounded-2xl overflow-hidden shadow-2xl w-full h-full">
                            <img 
                                src={about} 
                                alt="about" 
                                className="w-full h-full object-cover" 
                            />
                        </div>

                        {/* SVG (di atas image) */}
                        <img
                            src={AboutSvg}
                            alt="decoration"
                            className="absolute -top-7 -right-4 w-[60px] z-10"
                        />
                    </div>

                </div>
            </section>

            <section className="bg-[#063D30] px-4 sm:px-8 md:px-12 py-20">
                <div className='bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-12 md:py-20 rounded-2xl'>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">
                                Standar Kualitas
                            </p>

                            <h2 className="text-[30px] sm:text-[52px] md:text-[64px] leading-none font-black text-[#063D30]" style={{ fontFamily: "'Anton', sans-serif" }}>
                                Our 
                            </h2>
                            <h2 className="text-[30px] sm:text-[52px] md:text-[64px] indent-10 md:indent-20 leading-none font-black text-[#063D30]" style={{ fontFamily: "'Anton', sans-serif" }}>
                                Quality 
                            </h2>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="relative rounded-2xl overflow-hidden group">
                            <img src={quality1} alt="" className="w-full h-[320px] object-cover" />

                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                                <h3
                                    className="text-4xl font-black leading-none"
                                    style={{ fontFamily: "'Anton', sans-serif" }}
                                >
                                    Detail  <br /> yang Tajam
                                </h3>

                                <p className="text-sm text-gray-200">
                                    Setiap foto dihasilkan dengan ketelitian tinggi, menangkap detail kecil yang sering terlewat namun penuh makna.
                                </p>                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative rounded-2xl overflow-hidden group">
                            <img src={quality2} alt="" className="w-full h-[320px] object-cover" />

                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                                <h3
                                    className="text-4xl font-black leading-none"
                                    style={{ fontFamily: "'Anton', sans-serif" }}
                                >
                                    Komposisi <br /> Artistik
                                </h3>

                                <p className="text-sm text-gray-200">
                                    Perpaduan sudut, pencahayaan, dan timing yang tepat menghasilkan foto yang estetik dan penuh emosi.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative rounded-2xl overflow-hidden group">
                            <img src={quality3} alt="" className="w-full h-[320px] object-cover" />

                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                                <h3
                                    className="text-4xl font-black leading-none"
                                    style={{ fontFamily: "'Anton', sans-serif" }}
                                >
                                    Sentuhan <br /> Profesional
                                </h3>

                                <p className="text-sm text-gray-200">
                                    Dari sesi pemotretan hingga proses editing akhir, setiap hasil dipoles dengan standar profesional untuk kualitas terbaik.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Experience */}
            <section className="bg-[#063D30] px-4 sm:px-8 md:px-12 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[#f5d000] text-xs font-bold uppercase tracking-widest mb-3">
                        Selected Works
                    </p>
                    <h2
                        className="text-[28px] sm:text-[48px] md:text-[64px] leading-none font-black text-white"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                        Karya Terbaik Kami
                    </h2>
                </div>

                {/* Experience Item 1 — text left, image right */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-20">
                    {/* Left: meta + description */}
                    <div className="flex-1 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                                Mar 2024 &bull; <span className="text-white font-semibold">EVENT</span>
                            </p>
                            <h3
                                className="text-white text-[26px] sm:text-[32px] md:text-[40px] font-black leading-tight mb-auto"
                                style={{ fontFamily: "'Anton', sans-serif" }}
                            >
                                Sports Car Parade
                            </h3>
                        </div>

                        <div className="mt-12">
                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs mb-4 text-justify">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic earum, dolores quidem error facere vel et sapiente id suscipit beatae.
                            </p>
                        </div>
                    </div>

                    {/* Right: big image + two thumbnails */}
                    <div className="flex-1 flex gap-3 md:gap-4 items-end justify-end w-full">
                        <div className="flex flex-col gap-3 mb-2">
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                                <img src={experience1Child} alt="thumbnail 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                                <img src={experience1Child2} alt="thumbnail 2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden flex-1 h-[200px] sm:h-[240px] md:h-[280px]">
                            <img src={experience1} alt="Pernikahan Reza & Dinda" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Work Item 2 — image left, text right */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Left: big image + two thumbnails */}
                    <div className="flex-1 flex gap-3 md:gap-4 items-end justify-start w-full">
                        <div className="rounded-2xl overflow-hidden flex-1 h-[200px] sm:h-[240px] md:h-[280px]">
                            <img src={experience1} alt="Festival Musik Nusantara" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-3 mb-2">
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                                <img src={experience1Child} alt="thumbnail 1" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                                <img src={experience1Child2} alt="thumbnail 2" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Right: meta + description */}
                    <div className="flex-1 flex flex-col justify-between h-full text-right">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                                Nov 2024 &bull; <span className="text-white font-semibold">EVENT</span>
                            </p>
                            <h3
                                className="text-white text-[26px] sm:text-[32px] md:text-[40px] font-black leading-tight mb-auto"
                                style={{ fontFamily: "'Anton', sans-serif" }}
                            >
                                Launching New Product
                            </h3>
                        </div>

                        <div className="mt-12">
                            <p className="text-gray-300 text-sm leading-relaxed max-w-xs ml-auto mb-4 text-justify">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit nulla corporis iure delectus ipsam, odio vel maiores dolor eius suscipit tenetur sed quasi consequatur aspernatur quos? Consectetur repellat voluptate similique.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Award */}
            <section className="bg-[#063D30] px-4 sm:px-8 md:px-12 pb-20">
                <p className="text-[#f5d000] text-center text-xs font-bold uppercase tracking-widest mb-7">
                    Penghargaan
                </p>
                {[
                    { title: "Best Wedding Photography",    date: "Des 2024", category: "NATIONAL AWARD", img: quality1 },
                    { title: "Top Event Photographer 2023", date: "Nov 2023", category: "REGIONAL AWARD", img: quality2 },
                    { title: "People's Choice — Foto Terbaik", date: "Agu 2023", category: "COMMUNITY",  img: quality3 },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-6 border-t border-white/15 group cursor-pointer hover:opacity-80 transition"
                    >
                        {/* Title */}
                        <h3
                            className="text-white text-[20px] sm:text-[28px] md:text-[36px] font-black leading-tight w-[40%]"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                        >
                            {item.title}
                        </h3>

                        {/* Date */}
                        <span className="text-gray-400 text-sm w-[20%] text-center">
                            {item.date}
                        </span>

                        {/* Category */}
                        <span className="text-white text-xs font-bold uppercase tracking-widest w-[20%] text-center">
                            {item.category}
                        </span>

                        {/* Thumbnail */}
                        <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))}
                {/* Bottom border */}
                <div className="border-t border-white/15" />
            </section>

            {/* Testimonials Section */}
            <section className="bg-[#f0f0ee] px-4 sm:px-8 md:px-12 py-16 md:py-24" style={{ position: 'relative' }}>
                {/* Wave divider — transisi dari dark green ke krem */}
                <div className="absolute top-10 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(-99%)' }}>
                    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                        style={{ display: 'block', width: '100%', height: 80 }}>
                        <path d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z" fill="#f0f0ee" />
                    </svg>
                </div>
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[#063D30] text-xs font-bold uppercase tracking-widest mb-3">
                        Testimonials
                    </p>
                    <h2
                        className="text-[28px] sm:text-[52px] md:text-[64px] lg:text-[80px] leading-none font-black text-[#063D30]"
                        style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                        What Our Clients Say
                    </h2>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    {/* Left: quote */}
                    <div className="flex-1">
                        {reviews.length > 0 ? (
                            <>
                                {/* Animated wrapper */}
                                <div
                                    style={{
                                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                                        opacity: reviewVisible ? 1 : 0,
                                        transform: reviewVisible ? 'translateY(0)' : 'translateY(20px)',
                                    }}
                                >
                                    <p
                                        className="text-[#063D30] text-sm italic mb-6"
                                        style={{ fontFamily: "'Dancing Script', cursive" }}
                                    >
                                        {reviews[reviewIdx]?.client?.fullname || reviews[reviewIdx]?.client?.username}
                                    </p>

                                    <blockquote className="text-[#063D30] text-xl md:text-2xl font-medium leading-relaxed mb-8 max-w-sm">
                                        "{reviews[reviewIdx]?.comment}"
                                    </blockquote>

                                    {/* Rating stars */}
                                    <div className="flex gap-1 mb-6">
                                        {[1,2,3,4,5].map(s => (
                                            <span key={s} className={s <= reviews[reviewIdx]?.rating ? 'text-[#f5d000]' : 'text-gray-300'}>★</span>
                                        ))}
                                        <span className="text-xs text-gray-500 ml-2 self-center">{reviews[reviewIdx]?.package?.name}</span>
                                    </div>
                                </div>

                                {/* Nav dots */}
                                {reviews.length > 1 && (
                                    <div className="flex gap-2">
                                        {reviews.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setReviewVisible(false);
                                                    setTimeout(() => {
                                                        setReviewIdx(i);
                                                        setReviewVisible(true);
                                                    }, 400);
                                                }}
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    i === reviewIdx
                                                        ? 'bg-[#063D30] w-6'
                                                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                <div className="h-20 bg-gray-200 rounded animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Right: photo card */}
                    <div className="flex-1 flex justify-center items-center">
                        <div className="relative">
                            {/* Dashed border frame — rotated */}
                            <div className="absolute inset-0 border-2 border-dashed border-[#063D30]/40 rounded-2xl rotate-3 scale-105" />

                            {/* Yellow arrow decoration */}
                            <div
                                className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#f5d000] text-4xl select-none pointer-events-none"
                                style={{ transform: "translateX(-50%) rotate(-20deg)" }}
                            >
                                ➤
                            </div>

                            {/* Photo */}
                            <div className="relative rounded-2xl overflow-hidden w-[300px] h-[340px] shadow-xl rotate-1">
                                <img
                                    key={reviews[reviewIdx]?.id}
                                    src={reviews[reviewIdx]?.photo || client}
                                    alt="Client testimonial"
                                    className="w-full h-full object-cover"
                                    style={{
                                        transition: 'opacity 0.4s ease',
                                        opacity: reviewVisible ? 1 : 0,
                                    }}
                                    onError={(e) => { e.target.src = client; }}
                                />
                                {/* Name overlay — juga ikut animasi */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4"
                                    style={{
                                        transition: 'opacity 0.4s ease',
                                        opacity: reviewVisible ? 1 : 0,
                                    }}
                                >
                                    <p className="text-white text-sm font-bold leading-tight">
                                        {reviews[reviewIdx]?.client?.fullname || reviews[reviewIdx]?.client?.username || 'Klien Veloura'}
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        {reviews[reviewIdx]?.package?.name || 'Photography Client'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / Reserve Section */}
            <section id="reserve" className="min-h-screen bg-[#063D30] px-6 py-20" style={{ position: 'relative' }}>
                {/* Wave divider — transisi dari krem ke dark green */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(-99%)' }}>
                    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                        style={{ display: 'block', width: '100%', height: 80 }}>
                        <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="#063D30" />
                    </svg>
                </div>
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#f5d000] text-sm font-bold tracking-widest uppercase mb-3">
                            Pricing
                        </p>
                        <h2
                            className="text-[56px] md:text-[72px] leading-none font-black text-white"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                        >
                            Pilih Paket <br /> Sesuai Kebutuhan.
                        </h2>
                    </div>

                    {/* Toggle Harian / Event */}
                    <div className="flex items-center justify-center gap-2 mb-12">
                        <button
                            onClick={() => setPlanType("harian")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                                planType === "harian"
                                    ? "bg-[#f5d000] text-[#063D30]"
                                    : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                        >
                            Harian
                        </button>
                        <button
                            onClick={() => setPlanType("event")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                                planType === "event"
                                    ? "bg-[#f5d000] text-[#063D30]"
                                    : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                        >
                            Event
                        </button>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-3 gap-6 items-stretch">
                        {packages
                            .filter(p => p.type.toLowerCase() === planType)
                            .map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-[#f0ede6] rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-[#063D30] mb-1">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mb-6 leading-snug">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-6 border-b border-gray-300 pb-6">
                                        <span
                                            className="text-4xl font-black text-[#063D30] leading-none"
                                            style={{ fontFamily: "'Anton', sans-serif" }}
                                        >
                                            {'Rp' + Number(plan.price).toLocaleString('id-ID')}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">
                                            / {plan.duration}
                                        </span>
                                    </div>

                                    <ul className="space-y-2 text-sm text-gray-700 mb-8">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <span className="text-[#063D30] font-bold">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    to={`/reserve/booking/${plan.id}`}
                                    className={`block text-center py-3 rounded-full font-bold text-sm transition ${
                                        plan.is_featured
                                            ? "bg-[#f5d000] text-[#063D30] hover:brightness-95"
                                            : "border border-[#063D30] text-[#063D30] hover:bg-[#063D30] hover:text-white"
                                    }`}
                                >
                                    Pesan Sekarang!
                                </Link>
                            </div>
                        ))}
                        {/* Skeleton saat loading */}
                        {packages.length === 0 && [1,2,3].map(i => (
                            <div key={i} className="bg-[#f0ede6]/40 rounded-2xl p-6 h-64 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* FAQs Section */}
            <section id="faqs" className="bg-[#063D30] px-7 sm:px-8 md:px-12 py-16 md:py-24">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
                    {/* Left: title */}
                    <div className="md:w-[360px] flex-shrink-0">
                        <p className="text-[#f5d000] text-xs font-bold uppercase tracking-widest mb-4">
                            FAQs
                        </p>
                        <h2
                            className="text-white text-[28px] sm:text-[36px] md:text-[48px] leading-tight font-black"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                        >
                            Have <br /> Questions?
                        </h2>
                    </div>

                    {/* Right: accordion */}
                    <div className="flex-1 flex flex-col gap-3">
                        {[
                            {
                                q: "Apa saja yang termasuk dalam paket Basic?",
                                a: "Paket Basic mencakup 1 fotografer, 2 jam sesi pemotretan, 20 foto hasil editing, dan pengiriman file secara online.",
                            },
                            {
                                q: "Apakah Veloura Visual melayani foto di luar kota?",
                                a: "Ya, kami melayani pemotretan di luar kota. Biaya transportasi dan akomodasi akan disesuaikan berdasarkan lokasi dan durasi acara.",
                            },
                            {
                                q: "Berapa lama proses editing setelah sesi foto?",
                                a: "Proses editing biasanya memakan waktu 5–7 hari kerja. Untuk paket Premium dengan jumlah foto lebih banyak, bisa memakan waktu hingga 10 hari kerja.",
                            },
                            {
                                q: "Jenis event apa saja yang bisa difoto?",
                                a: "Kami melayani berbagai jenis event: pernikahan, wisuda, ulang tahun, konser, peluncuran produk, foto keluarga, sesi harian, dan masih banyak lagi.",
                            },
                            {
                                q: "Bagaimana cara melakukan pemesanan?",
                                a: "Klik tombol 'Pesan Sekarang', pilih paket yang sesuai, lalu isi form pemesanan. Tim kami akan menghubungi kamu dalam 1x24 jam untuk konfirmasi jadwal.",
                            },
                        ].map((item, i) => (
                            <FaqItem key={i} question={item.q} answer={item.a} />
                        ))}

                    </div>
                </div>
            </section>
            
            {/* Last CTA Section */}
            <section className="bg-white px-7 sm:px-8 md:px-12 py-16 md:py-24" style={{ position: 'relative' }}>
                {/* Diagonal divider — dark green ke putih dengan pita kuning */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(-99%)' }}>
                    <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                        style={{ display: 'block', width: '100%', height: 70 }}>
                        {/* Pita kuning — sedikit lebih tinggi dari putih */}
                        <polygon points="0,70 1440,8 1440,70" fill="#f5d000" />
                        {/* Layer putih di atas, sedikit lebih rendah — menciptakan efek pita */}
                        <polygon points="0,70 1440,18 1440,70" fill="white" />
                    </svg>
                </div>
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center ">

                    {/* Left: headline + CTA */}
                    <div className='flex-2'>
                        <h2
                            className="text-[36px] sm:text-[64px] md:text-[80px] lg:text-[90px] leading-none font-black text-[#063D30] mb-6"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                        >
                            ABADIKAN <br /> MOMENMU
                        </h2>
                    </div>

                    {/* Right: stacked cards */}
                    <div className="relative w-[420px] h-[280px] flex-1">

                        {/* Card 3 — furthest back, shifted most left-down, plain panel */}
                        <div
                            className="absolute rounded-3xl bg-[#c8d8e4]/60"
                            style={{
                                width: "88%",
                                height: "88%",
                                top: "18%",
                                left: "-10%",
                            }}
                        />

                        {/* Card 2 — middle, shifted less, plain panel */}
                        <div
                            className="absolute rounded-3xl bg-[#d6e4ed]/80"
                            style={{
                                width: "94%",
                                height: "94%",
                                top: "9%",
                                left: "-5%",
                            }}
                        />

                        {/* Card 1 — front, full size, real image */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl">
                            <img
                                src={lastContent}
                                alt="Let's create together"
                                className="w-full h-full object-cover"
                            />
                        </div>

                    </div>
                </div>
            </section>   
        </>
    )
}

export default Home;
