import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/motivation_from_vergil/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});