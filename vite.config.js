// vite.config.js (DIPERBARUI)
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            // ALIAS UTAMA (Sudah ada)
            '@': path.resolve(__dirname, 'resources/js'),
            
            // ALIAS BARU: Menambahkan alias khusus untuk folder assets
            // Ini akan menyelesaikan masalah jika Anda ingin menggunakan import heroImage from "@assets/hero-image.jpg"
            '@assets': path.resolve(__dirname, 'resources/js/assets'),
        },
    },
});