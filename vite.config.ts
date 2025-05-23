import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      Assets: '/src/assets',
      Components: '/src/components',
      Hooks: '/src/hooks',
      Pages: '/src/pages',
      Utils: '/src/utils',
      Views: '/src/views',
    },
  },
});
