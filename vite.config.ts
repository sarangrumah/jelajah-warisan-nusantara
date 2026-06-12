import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Configuration loaded successfully for production domain
  // Allowed hosts: museumcagarbudaya.kemenbud.go.id, www.museumcagarbudaya.kemenbud.go.id
  
  return {
    // Base public path - use '/' for production to ensure correct asset paths
    base: '/',
    server: {
      host: "::",
      port: 5173,
      watch: {
        // Only ignore heavy system folders so asset buckets trigger reloads
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
      // Security headers for development
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
      // Proxy API requests to backend during development
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // Uploaded files are served by the backend
        '/uploads': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        // Additional proxy for direct backend calls
        '/tb_company': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
        '/tb_sites': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: Number(process.env.VITE_PREVIEW_PORT || env.VITE_PREVIEW_PORT) || 4173,
      strictPort: true,
      allowedHosts: [
        'museumcagarbudaya.kemenbud.go.id',
        'www.museumcagarbudaya.kemenbud.go.id'
      ],
      headers: {
        // Security headers for production preview
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        ...(env.VITE_ENABLE_CSP === 'true' ? {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: http: localhost:3000;"
        } : {})
      },
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
      emptyOutDir: true,
      // Security: Remove console logs in production
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      // Generate source maps for debugging (can be disabled for production)
      sourcemap: mode !== 'production',
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
            charts: ['recharts'],
            i18n: ['react-i18next', 'i18next'],
            utils: ['axios', 'date-fns', 'clsx', 'tailwind-merge'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'framer-vendor': ['framer-motion'],
            'lenis-vendor': ['lenis'],
          },
          // Optimize asset file names for caching
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || 'asset';
            const info = name.split('.');
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },
      // Target modern browsers for better optimization
      target: 'es2020',
      // CSS optimization
      cssCodeSplit: true,
      // Report compressed size
      reportCompressedSize: true,
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
    },
    // Test configuration for Vitest
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      css: true,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'react-i18next',
        'recharts',
        'lucide-react'
      ],
      exclude: ['@vite/client', '@vite/env']
    },
    // Environment variables validation
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
