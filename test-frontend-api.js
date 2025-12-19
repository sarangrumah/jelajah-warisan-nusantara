// Test Frontend API Connectivity
// This bypasses the API client to test direct connectivity

console.log('🧪 Testing Frontend API Connectivity');
console.log('=====================================');

// Test 1: Direct fetch to backend
async function testDirectFetch() {
  console.log('\n📡 Test 1: Direct fetch to http://localhost:3000/api/tb_company');
  try {
    const response = await fetch('http://localhost:3000/api/tb_company');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch SUCCESS! Data:', data.length ? `${data.length} records` : 'empty');
      return true;
    } else {
      console.log('❌ Direct fetch failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Direct fetch error:', error.message);
    return false;
  }
}

// Test 2: Test via our API client
async function testApiClient() {
  console.log('\n🔧 Test 2: Testing via our API client');
  try {
    // Dynamic import to avoid circular dependencies
    const { apiClient } = await import('./src/lib/api-client.ts');
    
    console.log('API Client baseUrl:', apiClient.baseUrl || 'Not set');
    
    const response = await apiClient.getAll('tb_company');
    console.log('API Client response:', response);
    
    if (response.data) {
      console.log('✅ API Client SUCCESS! Data:', response.data.length ? `${response.data.length} records` : 'empty');
      return true;
    } else {
      console.log('❌ API Client failed:', response.error);
      return false;
    }
  } catch (error) {
    console.log('❌ API Client error:', error.message);
    return false;
  }
}

// Test 3: Test museum service
async function testMuseumService() {
  console.log('\n🏛️ Test 3: Testing museum service');
  try {
    const { museumService } = await import('./src/lib/api-services.ts');
    
    const response = await museumService.getAll();
    console.log('Museum service response:', response);
    
    if (response.data) {
      console.log('✅ Museum Service SUCCESS! Data:', response.data.length ? `${response.data.length} records` : 'empty');
      return true;
    } else {
      console.log('❌ Museum Service failed:', response.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Museum Service error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting API connectivity tests...\n');
  
  const test1 = await testDirectFetch();
  const test2 = await testApiClient();
  const test3 = await testMuseumService();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log('Direct Fetch:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('API Client:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('Museum Service:', test3 ? '✅ PASS' : '❌ FAIL');
  
  if (test1 && !test2) {
    console.log('\n🔍 Diagnosis: Direct fetch works but API client fails');
    console.log('This suggests an issue with the API client configuration');
  } else if (!test1) {
    console.log('\n🔍 Diagnosis: Direct fetch fails');
    console.log('This suggests a network/CORS/backend issue');
  } else if (test1 && test2 && test3) {
    console.log('\n🎉 All tests pass! The API should be working');
  }
}

// Run the tests
runAllTests().catch(console.error);