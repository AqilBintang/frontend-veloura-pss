import { useEffect, useState } from "react";
import "./Toast.css";

/**
 * Toast notification component
 * @param {string} message - pesan yang ditampilkan
 * @param {"success"|"error"|"info"} type - jenis toast
 * @param {function} onClose - callback saat toast ditutup
 * @param {number} duration - durasi tampil dalam ms (default 3000)
 */
const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // tunggu animasi fade out
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: "bx bx-check-circle",
        error:   "bx bx-x-circle",
        info:    "bx bx-info-circle",
    };

    return (
        <div className={`toast toast--${type} ${visible ? "toast--show" : "toast--hide"}`}>
            <i className={icons[type]}></i>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
