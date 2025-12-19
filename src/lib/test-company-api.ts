// Test script to debug company profile API
import { contentService } from './api-services';

export const testCompanyAPI = async () => {
  console.log('🧪 Testing company API...');
  
  try {
    console.log('📡 Making request to contentService.getAll()');
    const response = await contentService.getAll();
    
    console.log('📋 Full response:', response);
    console.log('📊 Response data:', response.data);
    console.log('❌ Response error:', response.error);
    
    if (response.data) {
      console.log('🔍 Data type:', typeof response.data);
      console.log('📏 Data length:', Array.isArray(response.data) ? response.data.length : 'not an array');
      
      if (Array.isArray(response.data)) {
        response.data.forEach((item, index) => {
          console.log(`Item ${index}:`, item);
        });
      }
    }
    
    return response;
  } catch (error) {
    console.error('💥 Test failed:', error);
    return { error: error.message };
  }
};

// Run the test if this file is imported directly
// Uncomment the line below to run the test
// testCompanyAPI();