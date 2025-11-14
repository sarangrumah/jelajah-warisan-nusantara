import translationService from '../services/translationService';

async function testLibreTranslate() {
  console.log('🧪 Testing LibreTranslate integration...');
  
  // Test health check
  console.log('🔍 Checking LibreTranslate health...');
  const isHealthy = await translationService.checkHealth();
  console.log(`✅ LibreTranslate health: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
  
  if (!isHealthy) {
    console.log('❌ LibreTranslate is not available. Please check if it\'s running on localhost:5000');
    return;
  }

  // Test single translation
  console.log('\n🔤 Testing single translation (ID -> EN)...');
  const testText = 'Selamat datang di Museum dan Cagar Budaya';
  const result = await translationService.translate(testText, 'en', 'id');
  
  console.log(`📝 Original: ${testText}`);
  console.log(`🌐 Translated: ${result.translatedText}`);
  console.log(`✅ Success: ${result.success}`);
  
  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  }

  // Test batch translation
  console.log('\n📚 Testing batch translation...');
  const batchTexts = [
    'Koleksi museum',
    'Warisan budaya',
    'Pameran seni'
  ];
  
  const batchResult = await translationService.translateBatch(batchTexts, 'en', 'id');
  
  console.log('📚 Batch translation results:');
  batchTexts.forEach((text, index) => {
    const translation = batchResult[index];
    console.log(`  ${text} -> ${translation.translatedText} (${translation.success ? '✅' : '❌'})`);
  });

  // Test supported languages
  console.log('\n🌍 Testing supported languages...');
  const languages = await translationService.getSupportedLanguages();
  console.log(`🌍 Supported languages: ${languages.map(lang => lang.code).join(', ')}`);

  console.log('\n🎉 LibreTranslate test completed!');
}

// Run the test
testLibreTranslate().catch(console.error);