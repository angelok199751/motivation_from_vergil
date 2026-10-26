import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' нужен, чтобы пути к картинкам и музыке работали внутри APK
export default defineConfig({
  base: './',
  plugins: [react()],
});
