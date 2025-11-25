const http = require('http');

function testBatchTranslation() {
  // Generate a large batch of texts
  const texts = [];
  for (let i = 0; i < 50; i++) {
    texts.push(`This is sentence number ${i} to be translated. It has some length to it to simulate real content.`);
  }

  const payload = JSON.stringify({
    texts: texts,
    sourceLang: 'en',
    targetLang: 'id'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/translate/batch', // Using the direct batch endpoint, not optimized one to test raw service
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  console.log(`Testing Batch Translation Endpoint with ${texts.length} texts...`);
  const startTime = Date.now();

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const duration = Date.now() - startTime;
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Duration: ${duration}ms`);
      
      try {
        const jsonResponse = JSON.parse(data);
        if (res.statusCode === 200 && jsonResponse.success) {
          console.log(`✅ Test Passed: Batch translation successful. Count: ${jsonResponse.results.length}`);
        } else {
          console.log('❌ Test Failed: Invalid response or status code');
          console.log('Error:', jsonResponse.error);
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