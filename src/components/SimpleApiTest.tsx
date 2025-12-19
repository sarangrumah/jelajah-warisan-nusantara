import React, { useState, useEffect } from 'react';

const SimpleApiTest: React.FC = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [sitesData, setSitesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔍 Starting direct API test...');
        console.log('🌐 Current location:', window.location.href);
        
        // Direct fetch to test API connectivity
        const companyResponse = await fetch('http://localhost:3000/api/tb_company', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Company API Response Status:', companyResponse.status);
        
        if (!companyResponse.ok) {
          throw new Error(`HTTP ${companyResponse.status}: ${companyResponse.statusText}`);
        }
        
        const companyResult = await companyResponse.json();
        console.log('✅ Company API Result:', companyResult);
        
        setCompanyData(companyResult);
        
        // Test sites API
        const sitesResponse = await fetch('http://localhost:3000/api/tb_sites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Sites API Response Status:', sitesResponse.status);
        
        if (!sitesResponse.ok) {
          throw new Error(`Sites HTTP ${sitesResponse.status}: ${sitesResponse.statusText}`);
        }
        
        const sitesResult = await sitesResponse.json();
        console.log('✅ Sites API Result:', sitesResult);
        
        setSitesData(sitesResult);
        
      } catch (err) {
        console.error('❌ API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 rounded m-4">
        <h3 className="font-bold mb-2">🔄 Testing API Connection...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded m-4">
        <h3 className="font-bold mb-2">❌ API Connection Failed</h3>
        <p className="text-sm">Error: {error}</p>
        <p className="text-xs mt-2 text-gray-600">
          Make sure backend is running on http://localhost:3000
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded m-4">
      <h3 className="font-bold mb-2">✅ API Connection Successful!</h3>
      
      {companyData && (
        <div className="mb-4">
          <h4 className="font-semibold">Company Data ({companyData.length} records):</h4>
          <div className="text-sm bg-white p-2 rounded mt-1">
            <p><strong>Name:</strong> {companyData[0]?.name}</p>
            <p><strong>Vision:</strong> {companyData[0]?.vision?.substring(0, 100)}...</p>
            <p><strong>Address:</strong> {companyData[0]?.address?.substring(0, 100)}...</p>
          </div>
        </div>
      )}
      
      {sitesData && (
        <div>
          <h4 className="font-semibold">Sites Data ({sitesData.length} records):</h4>
          <div className="text-sm bg-white p-2 rounded mt-1 max-h-32 overflow-y-auto">
            {sitesData.slice(0, 5).map((site, index) => (
              <p key={index}><strong>{site.name}</strong> - {site.type_relation?.name}</p>
            ))}
            {sitesData.length > 5 && <p>... and {sitesData.length - 5} more sites</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleApiTest;