const http = require('http');

function testHealth() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/translate-optimized/health',
    method: 'GET'
  };

  console.log('Testing Translation Health Endpoint...');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Test Failed:', error.message);
  });

  req.end();
}

testHealth();