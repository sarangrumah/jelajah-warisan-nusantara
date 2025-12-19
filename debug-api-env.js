// Debug API Environment Configuration
console.log('🔍 Debugging API Environment Configuration');
console.log('==========================================');

// Check environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);

// Test current API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
console.log('Final API URL:', API_URL);

// Test API connectivity
async function testAPI() {
  console.log('\n🧪 Testing API connectivity...');
  console.log('URL being tested:', `${API_URL}/api/tb_company`);
  
  try {
    const response = await fetch(`${API_URL}/api/tb_company`);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Working! Data received:', data.length ? `${data.length} records` : 'empty response');
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('This suggests the API URL might be wrong or the backend is not running');
  }
}

testAPI();

// Export for use in other files
if (typeof window !== 'undefined') {
  window.debugAPI = { testAPI, API_URL };
}