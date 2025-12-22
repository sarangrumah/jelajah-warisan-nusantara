// Direct test of museum API to debug the missing museums issue
const API_BASE = 'http://localhost:3000/api';

async function testMuseumAPI() {
    console.log('🔍 Testing Museum API directly...\n');
    
    try {
        // Test the exact same call that the frontend makes
        console.log('1. Testing /api/tb_sites endpoint...');
        const response = await fetch(`${API_BASE}/tb_sites`);
        
        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            return;
        }
        
        const data = await response.json();
        console.log(`✅ API Response received:`, data.length, 'records');
        
        if (data.length > 0) {
            console.log('\n📋 All museum names from API:');
            data.forEach((museum, index) => {
                console.log(`${index + 1}. ${museum.name || museum.title || 'NO NAME'} (ID: ${museum.id})`);
            });
            
            console.log('\n🔍 Detailed info for first 3 museums:');
            data.slice(0, 3).forEach((museum, index) => {
                console.log(`\nMuseum ${index + 1}:`);
                console.log('- ID:', museum.id);
                console.log('- Name:', museum.name);
                console.log('- Title:', museum.title);
                console.log('- is_active:', museum.is_active);
                console.log('- is_approved:', museum.is_approved);
                console.log('- Type:', museum.type);
            });
        } else {
            console.log('❌ No museums returned from API');
        }
        
        // Test if Museum Majapahit exists
        const majapahit = data.find(m => 
            m.name?.toLowerCase().includes('majapahit') ||
            m.title?.toLowerCase().includes('majapahit')
        );
        
        console.log('\n🎯 Museum Majapahit search:');
        if (majapahit) {
            console.log('✅ Found:', majapahit.name || majapahit.title);
        } else {
            console.log('❌ Not found');
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error);
    }
}

// Run the test
testMuseumAPI();