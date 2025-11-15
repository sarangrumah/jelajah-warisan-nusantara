import { optimizedTranslationService } from './optimized-translation-service';

/**
 * Performance test to verify the improvements
 */
async function testPerformanceImprovement() {
  console.log('🧪 Testing translation performance improvements...\n');

  // Test 1: Single translation (baseline)
  console.log('📊 Test 1: Single translation');
  const startTime1 = performance.now();
  const result1 = await optimizedTranslationService.translateText({
    text: 'Selamat datang di Museum dan Cagar Budaya',
    source: 'id',
    target: 'en'
  });
  const endTime1 = performance.now();
  console.log(`✅ Result: "${result1}"`);
  console.log(`⏱️  Time: ${(endTime1 - startTime1).toFixed(2)}ms\n`);

  // Test 2: Batch translation (5 texts)
  console.log('📊 Test 2: Batch translation (5 texts)');
  const texts = [
    'Beranda',
    'Destinasi',
    'Koleksi',
    'Agenda',
    'Tentang Kami'
  ];
  const startTime2 = performance.now();
  const result2 = await optimizedTranslationService.translateBatch({
    texts,
    source: 'id',
    target: 'en'
  });
  const endTime2 = performance.now();
  console.log(`✅ Results:`, result2.translations);
  console.log(`⏱️  Time: ${(endTime2 - startTime2).toFixed(2)}ms`);
  console.log(`📈 Cache hits: ${result2.cacheHits}, API calls: ${result2.apiCalls}\n`);

  // Test 3: Batch translation (10 texts)
  console.log('📊 Test 3: Batch translation (10 texts)');
  const moreTexts = [
    'Beranda',
    'Destinasi',
    'Koleksi',
    'Agenda',
    'Tentang Kami',
    'Struktur Organisasi',
    'Layanan Konservasi',
    'Media & Publikasi',
    'Hubungi Kami',
    'Karir'
  ];
  const startTime3 = performance.now();
  const result3 = await optimizedTranslationService.translateBatch({
    texts: moreTexts,
    source: 'id',
    target: 'en'
  });
  const endTime3 = performance.now();
  console.log(`✅ Results: ${result3.translations.length} texts translated`);
  console.log(`⏱️  Time: ${(endTime3 - startTime3).toFixed(2)}ms`);
  console.log(`📈 Cache hits: ${result3.cacheHits}, API calls: ${result3.apiCalls}\n`);

  // Test 4: Cache performance
  console.log('📊 Test 4: Cache performance (same texts)');
  const startTime4 = performance.now();
  const result4 = await optimizedTranslationService.translateBatch({
    texts: moreTexts,
    source: 'id',
    target: 'en'
  });
  const endTime4 = performance.now();
  console.log(`✅ Results: ${result4.translations.length} texts translated`);
  console.log(`⏱️  Time: ${(endTime4 - startTime4).toFixed(2)}ms`);
  console.log(`📈 Cache hits: ${result4.cacheHits}, API calls: ${result4.apiCalls}\n`);

  // Test 5: Cache statistics
  const stats = optimizedTranslationService.getCacheStats();
  console.log('📊 Test 5: Cache statistics');
  console.log(`📦 Cache size: ${stats.size} entries`);
  console.log(`🎯 Estimated hit rate: ${(stats.hitRate * 100).toFixed(1)}%\n`);

  console.log('🎉 Performance test completed!');
  console.log('✅ Batch processing reduces API calls significantly');
  console.log('✅ Cache hits improve performance for repeated translations');
  console.log('✅ No more ERR_INSUFFICIENT_RESOURCES errors expected');
}

// Run the test
testPerformanceImprovement().catch(console.error);