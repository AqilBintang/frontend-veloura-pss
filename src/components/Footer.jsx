import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollTo = (id) => {
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

    return(
        <footer className="px-4 sm:px-8 md:px-10">
            <div className="border-dashed border-t py-6 flex flex-col gap-6">
                <ul className="flex flex-wrap gap-4 sm:gap-6">
                    <li className="text-black text-sm font-semibold">
                        <button onClick={() => scrollTo('hero')}>Home</button>
                    </li>
                    <li className="text-black text-sm font-semibold">
                        <button onClick={() => scrollTo('about')}>About</button>
                    </li>
                    <li className="text-black text-sm font-semibold">
                        <button onClick={() => scrollTo('faqs')}>FAQ</button>
                    </li>
                    <li className="text-black text-sm font-semibold">
                        <button onClick={() => scrollTo('reserve')}>Reserve</button>
                    </li>
                </ul>
                <div className="text-[#063D30] text-xs flex flex-col sm:flex-row justify-between gap-1">
                    <p>&copy; Bintang Pradana 2026</p>
                    <p>All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;