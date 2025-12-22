const fetch = require('node-fetch');

async function testPublicationCreation() {
  try {
    // First, let's try to get an auth token by signing in with test credentials
    console.log('=== TESTING PUBLICATION CREATION ===');
    
    // Test publication data
    const publicationData = {
      title: 'Test Publication Debug',
      description: '<p>Test description for debugging</p>',
      type: 'publication',
      category: 'berita',
      year: '2025',
      size: '1 MB',
      pages: 1,
      downloadCount: 0,
      published_at: '2025-12-22T18:03:00.000Z',
      url: '/uploads/publication/test-debug.pdf',
      is_active: false,
      is_approved: false,
      is_rejected: false,
      reason_rejected: ''
    };

    console.log('Testing publication creation with data:', publicationData);
    
    // Try to create publication (this will likely fail due to auth, but should show the error)
    const response = await fetch('http://localhost:3000/api/tb_publication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publicationData)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    return { success: response.ok, data, status: response.status };
    
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testPublicationCreation();