// Test script to verify translation performance
const { translateText, getTranslationCacheStats, preWarmTranslationCache } = require('./src/lib/translation-service.ts');

async function testTranslationPerformance() {
  console.log('🧪 Testing Translation Performance...\n');
  
  // Pre-warm cache
  await preWarmTranslationCache();
  
  const testTexts = [
    'Selamat datang di Museum Cagar Budaya',
    'Koleksi museum ini sangat menarik',
    'Warisan budaya Indonesia',
    'Pameran seni kontemporer',
    'Kunjungan edukatif untuk siswa'
  ];
  
  console.log('📝 Testing translations from Indonesian to English:\n');
  
  for (const text of testTexts) {
    console.log(`Translating: "${text}"`);
    
    const startTime = Date.now();
    const result = await translateText({
      text: text,
      source: 'id',
      target: 'en'
    });
    const endTime = Date.now();
    
    console.log(`Result: "${result}"`);
    console.log(`Time: ${endTime - startTime}ms\n`);
  }
  
  // Test cache hits
  console.log('🔄 Testing cache hits (same translations):\n');
  
  for (const text of testTexts.slice(0, 3)) {
    console.log(`Translating (cached): "${text}"`);
    
    const startTime = Date.now();
    const result = await translateText({
      text: text,
      source: 'id',
      target: 'en'
    });
    const endTime = Date.now();
    
    console.log(`Result: "${result}"`);
    console.log(`Time: ${endTime - startTime}ms\n`);
  }
  
  // Get cache statistics
  const stats = getTranslationCacheStats();
  console.log('📊 Cache Statistics:');
  console.log(`Cache Size: ${stats.cacheSize}`);
  console.log(`Cache Hits: ${stats.cacheHits}`);
  console.log(`Cache Misses: ${stats.cacheMisses}`);
  console.log(`Hit Rate: ${stats.hitRate}`);
  console.log(`Total Requests: ${stats.totalRequests}`);
  
  console.log('\n✅ Translation performance test completed!');
}

// Run the test
testTranslationPerformance().catch(console.error);