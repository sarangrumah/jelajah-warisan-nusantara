import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { museumService } from '@/lib/api-services';

interface SiteData {
  id: string;
  name: string;
  type: string;
  category: string;
  subtitle: string;
  description: string;
  address: string;
  opening_hours: string;
  phone: string;
  whatsapp: string;
  website: string;
  facilities: string;
  img_banner: string;
  ticket_price: string;
  ticket_url: string;
  collection: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface UseSitesDataReturn {
  sitesData: SiteData[];
  museumsCount: number;
  heritageCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSitesData = (): UseSitesDataReturn => {
  const { t } = useTranslation('translation');
  const [sitesData, setSitesData] = useState<SiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSitesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching sites data from API...');
      const response = await museumService.getAll();
      console.log('📡 Sites API Response:', response);
      
      if (response.error) {
        console.error('❌ Sites API Error:', response.error);
        throw new Error(response.error);
      }
      
      if (response.data && Array.isArray(response.data)) {
        console.log('✅ Sites data found:', response.data.length, 'sites');
        setSitesData(response.data as SiteData[]);
      } else {
        console.log('⚠️ No sites data found');
        setSitesData([]);
      }
    } catch (err) {
      console.error('❌ Error fetching sites data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sites data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const museumsCount = sitesData.filter(site => 
    site.type === 'museum' || site.name.toLowerCase().includes('museum')
  ).length;
  
  const heritageCount = sitesData.filter(site => 
    site.type === 'heritage' || site.name.toLowerCase().includes('heritage')
  ).length;

  useEffect(() => {
    fetchSitesData();
  }, [t]);

  return {
    sitesData,
    museumsCount,
    heritageCount,
    loading,
    error,
    refetch: fetchSitesData,
  };
};