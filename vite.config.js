import { build, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/draft-app/',
  server: {
    port: 3000,
  }
});
