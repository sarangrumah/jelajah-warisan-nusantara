import { hybridTranslationService } from './hybrid-translation-service';
import { optimizedTranslationService } from './optimized-translation-service';

/**
 * Test script for hybrid translation system
 * This tests the integration between hardcoded translations and LibreTranslate API
 */

async function testHybridTranslation() {
  console.log('🧪 Testing Hybrid Translation System...\n');

  // Test 1: Hardcoded translation lookup
  console.log('📋 Test 1: Hardcoded Translation Lookup');
  const hardcodedResult = await hybridTranslationService.translateText({
    text: 'Beranda',
    source: 'id',
    target: 'en'
  });
  console.log(`Input: "Beranda" -> Output: "${hardcodedResult}"`);
  console.log(`Expected: "Home" -> Match: ${hardcodedResult === 'Home' ? '✅' : '❌'}\n`);

  // Test 2: API translation fallback
  console.log('🌐 Test 2: API Translation Fallback');
  const apiResult = await hybridTranslationService.translateText({
    text: 'Selamat datang di Museum Cagar Budaya',
    source: 'id',
    target: 'en'
  });
  console.log(`Input: "Selamat datang di Museum Cagar Budaya"`);
  console.log(`Output: "${apiResult}"`);
  console.log(`API Translation: ${apiResult !== 'Selamat datang di Museum Cagar Budaya' ? '✅' : '❌'}\n`);

  // Test 3: Batch translation
  console.log('📦 Test 3: Batch Translation');
  const batchResults = await hybridTranslationService.translateMultipleTexts({
    texts: [
      'Beranda',
      'Destinasi',
      'Selamat datang di aplikasi kami',
      'Koleksi museum'
    ],
    source: 'id',
    target: 'en'
  });
  console.log('Batch Results:');
  batchResults.forEach((result, index) => {
    const input = [
      'Beranda',
      'Destinasi',
      'Selamat datang di aplikasi kami',
      'Koleksi museum'
    ][index];
    console.log(`  "${input}" -> "${result}"`);
  });
  console.log('');

  // Test 4: Cache functionality
  console.log('💾 Test 4: Cache Functionality');
  const cacheStatsBefore = hybridTranslationService.getCacheStats();
  console.log(`Cache entries before: ${cacheStatsBefore.totalEntries}`);

  // Translate same text twice
  const firstCall = await hybridTranslationService.translateText({
    text: 'Testing cache functionality',
    source: 'id',
    target: 'en'
  });
  const secondCall = await hybridTranslationService.translateText({
    text: 'Testing cache functionality',
    source: 'id',
    target: 'en'
  });

  const cacheStatsAfter = hybridTranslationService.getCacheStats();
  console.log(`Cache entries after: ${cacheStatsAfter.totalEntries}`);
  console.log(`First call: "${firstCall}"`);
  console.log(`Second call: "${secondCall}"`);
  console.log(`Cache hit: ${firstCall === secondCall ? '✅' : '❌'}\n`);

  // Test 5: Optimized translation service
  console.log('⚡ Test 5: Optimized Translation Service');
  const optimizedResult = await optimizedTranslationService.translateText({
    text: 'Halo dunia',
    source: 'id',
    target: 'en'
  });
  console.log(`Optimized: "Halo dunia" -> "${optimizedResult}"\n`);

  // Test 6: Batch optimized translation
  console.log('📦 Test 6: Batch Optimized Translation');
  const optimizedBatch = await optimizedTranslationService.translateBatch({
    texts: [
      'Halo',
      'Selamat pagi',
      'Terima kasih',
      'Sampai jumpa'
    ],
    source: 'id',
    target: 'en'
  });
  console.log('Optimized Batch Results:');
  optimizedBatch.translations.forEach((result, index) => {
    const input = ['Halo', 'Selamat pagi', 'Terima kasih', 'Sampai jumpa'][index];
    console.log(`  "${input}" -> "${result}"`);
  });
  console.log(`Cache hits: ${optimizedBatch.cacheHits}`);
  console.log(`API calls: ${optimizedBatch.apiCalls}\n`);

  // Test 7: Performance comparison
  console.log('⏱️ Test 7: Performance Comparison');
  const testTexts = Array(5).fill('Ini adalah teks untuk testing performa');
  
  console.time('Hybrid Translation (5 texts)');
  const hybridResults = await hybridTranslationService.translateMultipleTexts({
    texts: testTexts,
    source: 'id',
    target: 'en'
  });
  console.timeEnd('Hybrid Translation (5 texts)');

  console.time('Optimized Translation (5 texts)');
  const optimizedResults = await optimizedTranslationService.translateBatch({
    texts: testTexts,
    source: 'id',
    target: 'en'
  });
  console.timeEnd('Optimized Translation (5 texts)');

  console.log('');

  // Test 8: Error handling
  console.log('🚨 Test 8: Error Handling');
  try {
    const errorResult = await hybridTranslationService.translateText({
      text: '',
      source: 'id',
      target: 'en'
    });
    console.log(`Empty text handling: "${errorResult}" -> ${errorResult === '' ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`Error handling: ❌ ${error}`);
  }

  console.log('\n🎉 Hybrid Translation System Tests Complete!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testHybridTranslation().catch(console.error);
}

export { testHybridTranslation };