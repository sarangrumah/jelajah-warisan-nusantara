import optimizedContentTranslationService from '../services/optimizedContentTranslationService';

/**
 * Test script for optimized translation service
 * This script tests the batch translation functionality and performance improvements
 */

async function testOptimizedTranslation() {
  console.log('🧪 Testing Optimized Translation Service...\n');

  // Test data - common texts that would appear on a page
  const testTexts = [
    'Lihat Detail',
    'Beli Sekarang',
    'Kembali',
    'Informasi Produk',
    'Kategori',
    'Status',
    'Tersedia',
    'Menunggu Persetujuan',
    'Hubungi Penjual',
    'Untuk informasi lebih lanjut atau pertanyaan tentang produk ini, silakan hubungi melalui WhatsApp',
    'Produk ini dapat dibeli langsung melalui WhatsApp',
    'Pastikan untuk menanyakan ketersediaan stok sebelum memesan',
    'Informasi pengiriman dan pembayaran akan dibahas langsung dengan penjual',
    'Produk asli dan berkualitas dari museum kami',
    'Harga',
    'Deskripsi',
    'Gambar',
    'Stok',
    'Pembelian',
    'Keranjang'
  ];

  console.log(`📝 Testing with ${testTexts.length} texts\n`);

  // Test 1: First translation (should use API)
  console.log('🔄 Test 1: First translation (should use API)');
  const startTime1 = Date.now();
  const result1 = await optimizedContentTranslationService.translateBatch({
    texts: testTexts,
    source: 'id',
    target: 'en'
  });
  const time1 = Date.now() - startTime1;
  
  console.log(`✅ Result: ${result1.cacheHits} cache hits, ${result1.apiCalls} API calls, ${result1.totalTime}ms`);
  console.log(`⏱️  Total time: ${time1}ms`);
  console.log('Translations:', result1.translations.slice(0, 5)); // Show first 5 translations
  console.log('');

  // Test 2: Same translation (should use cache)
  console.log('🔄 Test 2: Same translation (should use cache)');
  const startTime2 = Date.now();
  const result2 = await optimizedContentTranslationService.translateBatch({
    texts: testTexts,
    source: 'id',
    target: 'en'
  });
  const time2 = Date.now() - startTime2;
  
  console.log(`✅ Result: ${result2.cacheHits} cache hits, ${result2.apiCalls} API calls, ${result2.totalTime}ms`);
  console.log(`⏱️  Total time: ${time2}ms`);
  console.log('');

  // Test 3: Partial overlap (should mix cache and API)
  console.log('🔄 Test 3: Partial overlap (should mix cache and API)');
  const mixedTexts = [
    ...testTexts.slice(0, 5), // Cached texts
    'Teks baru 1', // New text
    'Teks baru 2', // New text
    ...testTexts.slice(5, 10) // Cached texts
  ];
  
  const startTime3 = Date.now();
  const result3 = await optimizedContentTranslationService.translateBatch({
    texts: mixedTexts,
    source: 'id',
    target: 'en'
  });
  const time3 = Date.now() - startTime3;
  
  console.log(`✅ Result: ${result3.cacheHits} cache hits, ${result3.apiCalls} API calls, ${result3.totalTime}ms`);
  console.log(`⏱️  Total time: ${time3}ms`);
  console.log('');

  // Test 4: Empty texts
  console.log('🔄 Test 4: Empty texts');
  const result4 = await optimizedContentTranslationService.translateBatch({
    texts: [],
    source: 'id',
    target: 'en'
  });
  console.log(`✅ Result: ${result4.cacheHits} cache hits, ${result4.apiCalls} API calls, ${result4.totalTime}ms`);
  console.log('');

  // Test 5: Same language (should skip translation)
  console.log('🔄 Test 5: Same language (should skip translation)');
  const result5 = await optimizedContentTranslationService.translateBatch({
    texts: testTexts,
    source: 'id',
    target: 'id'
  });
  console.log(`✅ Result: ${result5.cacheHits} cache hits, ${result5.apiCalls} API calls, ${result5.totalTime}ms`);
  console.log('');

  // Test 6: Get cache statistics
  console.log('📊 Cache Statistics');
  const stats = await optimizedContentTranslationService.getCacheStats();
  console.log(`Memory cache size: ${stats.memoryCacheSize}`);
  console.log(`Database cache entries: ${stats.dbCacheEntries}`);
  console.log(`Total translations: ${stats.totalTranslations}`);
  console.log(`Cache hit rate: ${stats.cacheHitRate}%`);
  console.log('');

  // Performance comparison
  console.log('📈 Performance Comparison');
  console.log(`First batch: ${time1}ms (${result1.apiCalls} API calls)`);
  console.log(`Cached batch: ${time2}ms (${result2.apiCalls} API calls)`);
  console.log(`Speed improvement: ${((time1 - time2) / time1 * 100).toFixed(1)}% faster`);
  console.log(`API call reduction: ${((result1.apiCalls - result2.apiCalls) / result1.apiCalls * 100).toFixed(1)}% fewer calls`);

  // Test 7: Pre-translate common content
  console.log('\n🔥 Pre-translating common content...');
  await optimizedContentTranslationService.preTranslateCommonContent();
  console.log('✅ Pre-translation completed');

  console.log('\n🎉 All tests completed successfully!');
}

// Run the test
testOptimizedTranslation().catch(console.error);