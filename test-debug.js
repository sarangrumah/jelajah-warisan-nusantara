// Simple test script to trigger publication creation
const testPublication = async () => {
  const publicationData = {
    title: 'Test Publication Debug',
    description: '<p>Test description for debugging</p>',
    type: 'publication',
    category: 'berita',
    year: '2025',
    size: '1 MB',
    pages: 1,
    downloadCount: 0,
    published_at: '2025-12-22T17:56:00.000Z',
    url: '/uploads/publication/test-debug.pdf',
    is_active: false,
    is_approved: false,
    is_rejected: false,
    reason_rejected: ''
  };

  console.log('Testing publication creation with data:', publicationData);
  
  try {
    const response = await fetch('http://localhost:3000/api/tb_publication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if available
        'Authorization': localStorage.getItem('auth_token') ? 
          'Bearer ' + localStorage.getItem('auth_token') : ''
      },
      body: JSON.stringify(publicationData)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    return { success: response.ok, data };
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error.message };
  }
};

// Run test after page loads
setTimeout(() => {
  console.log('Running publication test...');
  testPublication();
}, 2000);