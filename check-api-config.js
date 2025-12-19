// API Configuration Check Script
// Run this to verify API configuration is working

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('🔍 API Configuration Check');
console.log('==========================');
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Computed API URL:', API_URL);
console.log('Backend should be running on:', API_URL);

// Test API connectivity
async function testAPI() {
  try {
    console.log('\n🧪 Testing API connectivity...');
    const response = await fetch(`${API_URL}/api/tb_company`);
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is working! Data received:', data.length ? `${data.length} records` : 'empty response');
    } else {
      console.log('❌ API returned error status:', response.status);
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure backend is running on port 3000');
    console.log('2. Check if CORS is properly configured');
    console.log('3. Verify VITE_API_URL environment variable');
  }
}

testAPI();