#!/usr/bin/env node

/**
 * Test the museum API directly to see what data structure is returned
 */

console.log('🧪 Testing Museum API Directly...\n');

const testApiCall = async () => {
  try {
    // Test the getPublished endpoint
    const response = await fetch('http://localhost:3000/api/tb_sites?is_approved=true&is_active=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    
    console.log('📋 API Response Data:');
    console.log('Number of records:', data.length);
    
    if (data.length > 0) {
      console.log('\\n🔍 First Record Sample:');
      const firstRecord = data[0];
      console.log('ID:', firstRecord.id);
      console.log('Name:', firstRecord.name);
      console.log('Type:', firstRecord.type);
      console.log('Type Relation:', firstRecord.type_relation);
      console.log('Is Active:', firstRecord.is_active);
      console.log('Is Approved:', firstRecord.is_approved);
      console.log('\\n📝 All keys in first record:');
      console.log(Object.keys(firstRecord));
    }

    console.log('\\n🏷️ All type_relation values:');
    const typeRelations = data.map(record => record.type_relation).filter(Boolean);
    console.log('Unique type_relation objects:', [...new Set(typeRelations.map(tr => tr?.name))]);
    
  } catch (error) {
    console.error('❌ Error calling API:', error.message);
    console.log('\\n💡 Make sure the backend is running on localhost:3000');
  }
};

testApiCall();