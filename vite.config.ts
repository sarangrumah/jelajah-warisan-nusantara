import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const DEV_PORT = Number(env.VITE_DEV_PORT || env.PORT) || 8080;
  // DEBUG: Log config load and allowed hosts
  // eslint-disable-next-line no-console
  console.log('Vite config loaded. Preview allowedHosts:', [
    'museumcagarbudaya.kemenbud.go.id',
    'www.museumcagarbudaya.kemenbud.go.id'
  ]);
  
  return {
    server: {
      base: './',
      host: "::",
      port: DEV_PORT,
      // Avoid dev reloads when backend writes into hero assets
      watch: {
        // Ignore any files written by the backend uploader
        ignored: [
          '**/src/assets/hero-sections/**',
          '**/backend/uploads/**',
          '**/backend/src/uploads/**',
          '**/uploads/**',
          path.resolve(__dirname, 'backend/uploads/**/*'),
          path.resolve(__dirname, 'backend/src/uploads/**/*'),
        ],
      },
      // Security headers for development
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT) || 443,
      strictPort: true,
      allowedHosts: [
        'museumcagarbudaya.kemenbud.go.id',
        'www.museumcagarbudaya.kemenbud.go.id'
      ],
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Security: Remove console logs in production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Generate source maps for debugging (can be disabled for production)
      sourcemap: mode !== 'production',
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
    },
    // Test configuration for Vitest
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      css: true,
    },
  };
});
