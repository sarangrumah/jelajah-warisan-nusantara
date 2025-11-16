/**
 * Test LibreTranslate Connection
 * 
 * This script tests the connection to the LibreTranslate server
 * running on your production server.
 */

const fetch = require('node-fetch');

async function testLibreTranslateConnection() {
  const baseUrl = 'https://museumcagarbudaya.kemenbud.go.id:5000';
  
  console.log('🧪 Testing LibreTranslate connection...');
  console.log(`🌐 Target URL: ${baseUrl}`);
  
  try {
    // Test languages endpoint
    console.log('\n📋 Testing /languages endpoint...');
    const languagesResponse = await fetch(`${baseUrl}/languages`);
    if (languagesResponse.ok) {
      const languages = await languagesResponse.json();
      console.log('✅ Languages endpoint working!');
      console.log(`📊 Available languages: ${languages.length}`);
      console.log('Languages:', languages.map(lang => `${lang.code} (${lang.name})`).join(', '));
    } else {
      console.log('❌ Languages endpoint failed:', languagesResponse.status);
    }

    // Test translate endpoint
    console.log('\n🔤 Testing /translate endpoint...');
    const translateResponse = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: 'Halo dunia',
        source: 'id',
        target: 'en',
        format: 'text'
      })
    });

    if (translateResponse.ok) {
      const translation = await translateResponse.json();
      console.log('✅ Translate endpoint working!');
      console.log(`📝 Translation: "Halo dunia" → "${translation.translatedText}"`);
    } else {
      console.log('❌ Translate endpoint failed:', translateResponse.status);
      const errorText = await translateResponse.text();
      console.log('Error details:', errorText);
    }

    // Test batch translation
    console.log('\n📦 Testing batch translation...');
    const batchResponse = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: ['Halo', 'Dunia', 'Selamat pagi'],
        source: 'id',
        target: 'en',
        format: 'text'
      })
    });

    if (batchResponse.ok) {
      const batchTranslation = await batchResponse.json();
      console.log('✅ Batch translation working!');
      console.log('📝 Batch translations:', batchTranslation.translatedText);
    } else {
      console.log('❌ Batch translation failed:', batchResponse.status);
    }

  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('💡 Make sure:');
    console.log('   - LibreTranslate is running on port 5000');
    console.log('   - Port 5000 is accessible from your network');
    console.log('   - No firewall blocking the connection');
    console.log('   - SSL certificate is valid (if using HTTPS)');
  }
}

// Run the test
testLibreTranslateConnection();