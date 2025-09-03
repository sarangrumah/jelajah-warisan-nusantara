// Vite config with assetsInclude for uppercase/lowercase image extensions
import { defineConfig } from 'vite';

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
});