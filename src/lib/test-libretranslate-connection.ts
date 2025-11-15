/**
 * Test LibreTranslate connection and basic functionality
 */

export async function testLibreTranslateConnection() {
  const LIBRETRANSLATE_API = import.meta.env.VITE_LIBRETRANSLATE_URL || 'http://localhost:5000/translate';
  
  console.log('🧪 Testing LibreTranslate Connection...');
  console.log('API URL:', LIBRETRANSLATE_API);
  
  try {
    // Test simple translation
    const testText = 'Beranda';
    console.log('Testing translation:', testText);
    
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: testText,
        source: 'id',
        target: 'en',
        format: 'text',
      }),
    });

    if (!response.ok) {
      console.error('❌ LibreTranslate API error:', response.status, response.statusText);
      return {
        success: false,
        error: `API Error: ${response.status} ${response.statusText}`,
        status: response.status
      };
    }

    const data = await response.json();
    console.log('✅ LibreTranslate response:', data);
    
    return {
      success: true,
      translatedText: data.translatedText,
      responseTime: performance.now()
    };
  } catch (error) {
    console.error('❌ LibreTranslate connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

// Run test if imported directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testLibreTranslateConnection().then(result => {
    console.log('Test Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}