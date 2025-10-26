import { rmSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const distPath = resolve(__dirname, 'dist');

console.log(`🧹 Forcefully removing ${distPath}...`);

try {
  // Use rmSync to forcefully and recursively remove the directory
  rmSync(distPath, { recursive: true, force: true });
  console.log('✅ Success: dist directory removed.');
} catch (error) {
  console.error('❌ Error removing dist directory:', error);
  // Exit with an error code to prevent the build from continuing
  process.exit(1);
}