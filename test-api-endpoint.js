import fetch from 'node-fetch';

async function testMuseumApiEndpoint() {
  try {
    console.log('🧪 Testing Museum API endpoint with HTML stripping...\n');

    // Test the specific museum mentioned in the issue
    const museumId = 'a9de131a-05f9-41ff-9353-18c2126c1a9e';
    const baseUrl = 'http://localhost:3000/api';

    console.log('1. Testing museum API endpoint without translation (lang=id)...');
    const responseId = await fetch(`${baseUrl}/tb_sites/${museumId}?lang=id`);
    const museumDataId = await responseId.json();

    console.log('✅ Response received:');
    console.log(`   Name: ${museumDataId.name}`);
    console.log(`   Description: ${museumDataId.description ? museumDataId.description.substring(0, 100) + '...' : 'null'}`);
    
    if (museumDataId.description && museumDataId.description.includes('<')) {
      console.log('⚠️  Description still contains HTML tags (expected for Indonesian language)');
    }

    console.log('\n2. Testing museum API endpoint with English translation (lang=en)...');
    const responseEn = await fetch(`${baseUrl}/tb_sites/${museumId}?lang=en`);
    const museumDataEn = await responseEn.json();

    console.log('✅ Response received:');
    console.log(`   Name: ${museumDataEn.name}`);
    console.log(`   Description: ${museumDataEn.description ? museumDataEn.description.substring(0, 100) + '...' : 'null'}`);
    
    if (museumDataEn.description) {
      if (museumDataEn.description.includes('<')) {
        console.log('❌ Description still contains HTML tags after translation - fix may not be working');
      } else {
        console.log('✅ Description is clean of HTML tags after translation - fix is working!');
      }
    }

    console.log('\n3. Testing multiple museums with English translation...');
    const responseAll = await fetch(`${baseUrl}/tb_sites?lang=en&limit=3`);
    const museumsData = await responseAll.json();

    console.log(`✅ Received ${museumsData.length} museums:`);
    museumsData.forEach((museum, index) => {
      const hasHtml = museum.description && museum.description.includes('<');
      console.log(`   ${index + 1}. ${museum.name} - HTML: ${hasHtml ? '❌ Present' : '✅ Clean'}`);
      if (museum.description) {
        console.log(`      Description: ${museum.description.substring(0, 80)}...`);
      }
    });

    console.log('\n✅ API endpoint test completed!');
    console.log('\n📝 Summary:');
    console.log('   - The fix should prevent HTML tags from appearing in translated text');
    console.log('   - When lang=id, HTML tags may still be present (original data)');
    console.log('   - When lang=en (or other languages), HTML tags should be stripped');

  } catch (error) {
    console.error('❌ Error testing API endpoint:', error.message);
    console.log('\n💡 Note: Make sure the backend server is running on port 3000');
  }
}

testMuseumApiEndpoint();