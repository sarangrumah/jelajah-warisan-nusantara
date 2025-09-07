import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
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
      port: 8080,
      // Avoid dev reloads when backend writes into hero assets
      watch: {
        ignored: ['**/src/assets/hero-sections/**'],
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
