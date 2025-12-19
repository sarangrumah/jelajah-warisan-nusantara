import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('🧪 Testing API connection...');
        console.log('🌐 Base URL:', import.meta.env.VITE_API_URL);
        
        const response = await apiClient.getAll('tb_company');
        console.log('📡 API Response:', response);
        
        if (response.error) {
          setTestResult(`❌ Error: ${response.error}`);
        } else {
          setTestResult(`✅ Success: Found ${response.data?.length || 0} company records`);
        }
      } catch (error) {
        console.error('❌ API Test Error:', error);
        setTestResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded m-4">
      <h3 className="font-bold mb-2">🔧 API Connection Test</h3>
      <p className="text-sm">{testResult}</p>
      <p className="text-xs mt-2 text-gray-600">
        API URL: {import.meta.env.VITE_API_URL || 'Not set'}
      </p>
    </div>
  );
};

export default ApiTest;