// Vite config with assetsInclude for uppercase/lowercase image extensions
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Add all relevant image extensions here
  assetsInclude: [
    '**/*.JPG',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.PNG',
    '**/*.png',
    '**/*.gif',
    '**/*.svg',
    '**/*.webp'
  ],
  // ...other config options if needed
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  preview: {
    allowedHosts: [
      'museumcagarbudaya.kemenbud.go.id'
    ]
  }
});