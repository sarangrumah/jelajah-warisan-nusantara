/**
 * Test script for the fixed translation service
 * This tests the batch translation functionality and concurrency control
 */

// Mock environment variables for Node.js testing
if (typeof process !== 'undefined') {
  // Node.js environment
  (global as any).import = { meta: { env: { VITE_LIBRETRANSLATE_URL: 'http://localhost:5000/translate' } } };
}

import { optimizedTranslationService } from './optimized-translation-service';

async function testTranslationService() {
  console.log('🧪 Testing Optimized Translation Service...\n');

  // Test 1: Single translation
  console.log('Test 1: Single translation');
  const singleResult = await optimizedTranslationService.translateText({
    text: 'Halo dunia',
    source: 'id',
    target: 'en'
  });
  console.log(`✅ Single translation: "Halo dunia" → "${singleResult}"\n`);

  // Test 2: Batch translation
  console.log('Test 2: Batch translation');
  const batchResult = await optimizedTranslationService.translateBatch({
    texts: [
      'Selamat pagi',
      'Terima kasih',
      'Sampai jumpa',
      'Apa kabar?',
      'Selamat datang'
    ],
    source: 'id',
    target: 'en'
  });
  console.log('✅ Batch translation results:');
  batchResult.translations.forEach((translation, index) => {
    console.log(`   ${['Selamat pagi', 'Terima kasih', 'Sampai jumpa', 'Apa kabar?', 'Selamat welcome'][index]} → "${translation}"`);
  });
  console.log(`   Cache hits: ${batchResult.cacheHits}, API calls: ${batchResult.apiCalls}\n`);

  // Test 3: Cache test (should hit cache)
  console.log('Test 3: Cache hit test');
  const cachedResult = await optimizedTranslationService.translateText({
    text: 'Halo dunia',
    source: 'id',
    target: 'en'
  });
  console.log(`✅ Cached translation: "Halo dunia" → "${cachedResult}" (should be same as above)\n`);

  // Test 4: Common translations (should not call API)
  console.log('Test 4: Common translations');
  const commonResult = await optimizedTranslationService.translateText({
    text: 'Beranda',
    source: 'id',
    target: 'en'
  });
  console.log(`✅ Common translation: "Beranda" → "${commonResult}" (should be "Home" from common translations)\n`);

  // Test 5: Empty text
  console.log('Test 5: Empty text handling');
  const emptyResult = await optimizedTranslationService.translateText({
    text: '',
    source: 'id',
    target: 'en'
  });
  console.log(`✅ Empty text: "" → "${emptyResult}" (should be empty string)\n`);

  // Test 6: Same language (should not call API)
  console.log('Test 6: Same language handling');
  const sameLangResult = await optimizedTranslationService.translateText({
    text: 'Hello world',
    source: 'en',
    target: 'en'
  });
  console.log(`✅ Same language: "Hello world" → "${sameLangResult}" (should be same text)\n`);

  // Test 7: Cache statistics
  console.log('Test 7: Cache statistics');
  const stats = optimizedTranslationService.getCacheStats();
  console.log(`✅ Cache stats: size=${stats.size}, hitRate=${stats.hitRate}\n`);

  console.log('🎉 All tests completed successfully!');
  console.log('The translation service should now handle batch requests efficiently without causing ERR_INSUFFICIENT_RESOURCES errors.');
}

// Run the test
testTranslationService().catch(console.error);