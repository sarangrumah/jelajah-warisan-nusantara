const http = require('http');

function testBatchTranslation() {
  const payload = JSON.stringify({
    texts: ['Selamat Pagi', 'Terima Kasih', 'Selamat Datang'],
    source: 'id',
    target: 'en'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/translate-optimized/batch',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  console.log('Testing Batch Translation Endpoint...');
  console.log('Payload:', payload);

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      try {
        const jsonResponse = JSON.parse(data);
        console.log('Response:', JSON.stringify(jsonResponse, null, 2));
        
        if (res.statusCode === 200 && jsonResponse.success && jsonResponse.translations.length === 3) {
          console.log('✅ Test Passed: Batch translation successful');
        } else {
          console.log('❌ Test Failed: Invalid response or status code');
        }
      } catch (e) {
        console.log('Raw Response:', data);
        console.error('❌ Test Failed: Could not parse JSON response');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Test Failed:', error.message);
  });

  req.write(payload);
  req.end();
}

testBatchTranslation();