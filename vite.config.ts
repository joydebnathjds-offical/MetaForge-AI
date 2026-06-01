import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages-এর সাব-ফোল্ডার বা সাব-পাথ চেনার জন্য base যুক্ত করা হলো
  base: '/MetaForge-AI/',
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});