// Direct API Test - Bypass all configuration
console.log('🧪 Direct API Test - Testing localhost:3000 directly');

async function testDirectAPI() {
  try {
    console.log('📡 Testing direct connection to http://localhost:3000/api/tb_company');
    
    const response = await fetch('http://localhost:3000/api/tb_company');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Direct API call working');
      console.log('Data received:', data.length ? `${data.length} records` : 'empty');
      console.log('Sample data:', data[0]);
    } else {
      const text = await response.text();
      console.log('❌ API Error:', response.status, response.statusText);
      console.log('Response text:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('This means:');
    console.log('1. Backend is not running on localhost:3000');
    console.log('2. CORS is blocking the request');
    console.log('3. Network connectivity issue');
  }
}

testDirectAPI();

// Also test if we can reach the backend at all
async function testBackendHealth() {
  try {
    console.log('\n🏥 Testing backend health check...');
    const response = await fetch('http://localhost:3000/api/health');
    console.log('Health check status:', response.status);
  } catch (error) {
    console.log('Health check failed:', error.message);
  }
}

testBackendHealth();