import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [prevPath, setPrevPath] = useState(location.pathname);

    useEffect(() => {
        // Hanya trigger saat path berubah dan bukan Home
        if (location.pathname === prevPath) return;

        setPrevPath(location.pathname);
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 900);
        return () => clearTimeout(t);
    }, [location.pathname]);

    return (
        <>
            {/* Overlay loader */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#063D30',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '16px',
                    pointerEvents: loading ? 'all' : 'none',
                    opacity: loading ? 1 : 0,
                    transition: 'opacity 0.25s ease',
                }}
            >
                <span
                    style={{ fontFamily: "'Anton', sans-serif", color: '#f5d000', fontSize: 28, letterSpacing: 2 }}
                >
                    VelouraVisual
                </span>
                <Loader />
            </div>

            {/* Page content */}
            <div
                style={{
                    opacity: loading ? 0 : 1,
                    transition: 'opacity 0.3s ease 0.1s',
                }}
            >
                {children}
            </div>
        </>
    );
};

export default PageTransition;
