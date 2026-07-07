/**
 * SweetAlert2 helpers dengan tema Veloura Visual
 * Warna utama: #063D30 (hijau gelap), aksen: #f5d000 (kuning)
 */
import Swal from 'sweetalert2';

// Base instance dengan tema Veloura
const VeloSwal = Swal.mixin({
    customClass: {
        popup:          'velo-popup',
        title:          'velo-title',
        htmlContainer:  'velo-html',
        confirmButton:  'velo-btn-confirm',
        cancelButton:   'velo-btn-cancel',
        icon:           'velo-icon',
    },
    buttonsStyling: false,
    background: '#ffffff',
    color: '#063D30',
});

// ── Konfirmasi pemesanan (2 langkah) ─────────────────────────────────────────

export const confirmBooking = async (packageName, price, date, location) => {
    // Langkah 1: Ringkasan detail
    const step1 = await VeloSwal.fire({
        title: 'Konfirmasi Pemesanan',
        html: `
            <div style="text-align:left;font-size:14px;color:#444;line-height:1.8">
                <p style="margin-bottom:12px;color:#063D30;font-weight:600">Pastikan detail pemesananmu sudah benar:</p>
                <div style="background:#f0f0ee;border-radius:12px;padding:14px 16px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                        <span style="color:#888">Paket</span>
                        <span style="font-weight:600;color:#063D30">${packageName}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                        <span style="color:#888">Tanggal</span>
                        <span style="font-weight:600;color:#063D30">${date}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                        <span style="color:#888">Lokasi</span>
                        <span style="font-weight:600;color:#063D30">${location}</span>
                    </div>
                    <div style="border-top:1px solid #ddd;margin:10px 0"></div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:#888">Total</span>
                        <span style="font-weight:800;color:#063D30;font-size:16px">Rp${Number(price).toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Lanjutkan →',
        cancelButtonText: 'Periksa Lagi',
        reverseButtons: true,
    });

    if (!step1.isConfirmed) return false;

    // Langkah 2: Konfirmasi final
    const step2 = await VeloSwal.fire({
        title: 'Yakin ingin memesan?',
        html: `<p style="color:#666;font-size:14px">Tim kami akan menghubungi kamu setelah pemesanan dikonfirmasi.</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '✓ Ya, Pesan Sekarang',
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });

    return step2.isConfirmed;
};

// ── Konfirmasi logout ────────────────────────────────────────────────────────

export const confirmLogout = async () => {
    const result = await VeloSwal.fire({
        title: 'Keluar dari akun?',
        html: '<p style="color:#666;font-size:14px">Kamu perlu login kembali untuk mengakses fitur pemesanan.</p>',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });
    return result.isConfirmed;
};

// ── Konfirmasi simpan profil ─────────────────────────────────────────────────

export const confirmSaveProfile = async () => {
    const result = await VeloSwal.fire({
        title: 'Simpan perubahan?',
        html: '<p style="color:#666;font-size:14px">Perubahan profil akan disimpan ke akun kamu.</p>',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });
    return result.isConfirmed;
};

// ── Toast sukses ──────────────────────────────────────────────────────────────

export const toastSuccess = (message) => VeloSwal.fire({
    toast: true,
    position: 'bottom',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
});

// ── Toast error ───────────────────────────────────────────────────────────────

export const toastError = (message) => VeloSwal.fire({
    toast: true,
    position: 'bottom',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});
