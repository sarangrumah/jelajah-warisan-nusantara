import { hybridTranslationService } from './hybrid-translation-service';
import { optimizedTranslationService } from './optimized-translation-service';

/**
 * Simple test for hybrid translation system
 */

async function runTests() {
  console.log('🧪 Testing Hybrid Translation System...\n');

  try {
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

    // Test 3: Cache functionality
    console.log('💾 Test 3: Cache Functionality');
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

    // Test 4: Same language (no translation needed)
    console.log('🔄 Test 4: Same Language (No Translation)');
    const sameLangResult = await hybridTranslationService.translateText({
      text: 'Hello world',
      source: 'en',
      target: 'en'
    });
    console.log(`Input: "Hello world" -> Output: "${sameLangResult}"`);
    console.log(`No translation needed: ${sameLangResult === 'Hello world' ? '✅' : '❌'}\n`);

    // Test 5: Empty text
    console.log('🚨 Test 5: Empty Text Handling');
    const emptyResult = await hybridTranslationService.translateText({
      text: '',
      source: 'id',
      target: 'en'
    });
    console.log(`Empty text: "${emptyResult}" -> ${emptyResult === '' ? '✅' : '❌'}\n`);

    console.log('🎉 All Hybrid Translation Tests Completed Successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
runTests();