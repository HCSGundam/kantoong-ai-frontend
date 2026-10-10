// js/engine.js - Gabungan Konfigurasi Lokal & Database Backend
document.addEventListener('DOMContentLoaded', async () => {
    // ==========================================
    // 1. SUNTIKKAN KONFIGURASI DARI FILE LOKAL (client-config.js)
    // ==========================================
    if (typeof KantoongConfig !== 'undefined') {
        // Suntikkan Nama Bisnis Cadangan
        const appTitle = document.getElementById('app-title');
        if (appTitle) {
            appTitle.innerText = KantoongConfig.app_name;
        }

        // Suntikkan Gambar Background
        const bgImage = document.querySelector('.bg-image');
        if (bgImage) {
            bgImage.style.backgroundImage = KantoongConfig.background_image;
        }

        // Suntikkan Warna Tema (CSS Variable)
        document.documentElement.style.setProperty('--primary-color', KantoongConfig.theme_color_primary);
        
        // Suntikkan Tipografi (Font)
        document.documentElement.style.setProperty('--font-header', KantoongConfig.font_family_header);
        document.documentElement.style.setProperty('--font-weight-header', KantoongConfig.font_weight_header);
    }

    // ==========================================
    // 2. AMBIL DATA DINAMIS DARI BACKEND (Database MySQL)
    // ==========================================
    try {
        const slug = (typeof KantoongConfig !== 'undefined' && KantoongConfig.BUSINESS_SLUG) 
                     ? KantoongConfig.BUSINESS_SLUG 
                     : 'yanti-gold';

        const response = await fetch(`http://localhost:5000/api/business/${slug}`);
        const data = await response.json();

        if (response.ok) {
            console.log("SUKSES TERHUBUNG KE BACKEND! Data Tenant:", data);
            
            // Jika ingin judul header menangani data dari database secara langsung:
            const appTitle = document.getElementById('app-title');
            if (appTitle && data.logoText) {
                appTitle.innerText = data.logoText;
            }
        } else {
            console.warn("Tenant tidak ditemukan di backend, menggunakan config lokal.");
        }
    } catch (error) {
        console.error("Kesalahan jaringan ke backend (Pastikan backend Node.js menyala):", error);
    }
});