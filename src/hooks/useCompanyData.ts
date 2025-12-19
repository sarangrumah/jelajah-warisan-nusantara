import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService } from '@/lib/api-services';

interface CompanyData {
  id: string;
  name: string;
  brand: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  aboutus: string;
  vision: string;
  mission: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

interface UseCompanyDataReturn {
  companyData: CompanyData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCompanyData = (): UseCompanyDataReturn => {
  const { t } = useTranslation('translation');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contentService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the first (and likely only) company record
        setCompanyData(response.data[0] as CompanyData);
      } else {
        setCompanyData(null);
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [t]);

  return {
    companyData,
    loading,
    error,
    refetch: fetchCompanyData,
  };
};