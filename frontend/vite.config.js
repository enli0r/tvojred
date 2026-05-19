import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),

      // DevTools samo lokalno, nikako u production build
      isDevelopment && vueDevTools(),
    ].filter(Boolean),

    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      hmr: {
        overlay: false,
      },
    },

    build: {
      // Da se ne generišu .map fajlovi u produkciji
      sourcemap: false,

      // Dodatna minifikacija JS/CSS bundle-a
      minify: 'terser',

      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});