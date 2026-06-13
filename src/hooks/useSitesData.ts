import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { museumService } from '@/lib/api-services';
import { logError, logInfo } from '@/utils/logger';

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
      
      logInfo('🔍 Fetching sites data from API...');
      const response = await museumService.getAll();
      logInfo('📡 Sites API Response:', response);
      
      if (response.error) {
        logError('❌ Sites API Error:', response.error);
        throw new Error(response.error);
      }
      
      if (response.data && Array.isArray(response.data)) {
        logInfo('✅ Sites data found:', response.data.length, 'sites');
        setSitesData(response.data as SiteData[]);
      } else {
        logInfo('⚠️ No sites data found');
        setSitesData([]);
      }
    } catch (err) {
      logError('❌ Error fetching sites data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sites data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics. NOTE: tb_sites.type holds the type UUID (not the
  // string 'museum'/'heritage'), so we match on the known type IDs used across
  // the app (see api-services museumService/heritageService.getPublished).
  const MUSEUM_TYPE_ID = '12bc00a9-ba1a-4562-940d-4e33bb26acdc';
  const HERITAGE_TYPE_ID = 'cb368bd8-22cb-40f9-ae73-0990cad6e4d0';
  const museumsCount = sitesData.filter(site => site.type === MUSEUM_TYPE_ID).length;
  // Cagar Budaya = explicit heritage type (fallback: any non-museum type).
  const heritageCount = sitesData.filter(
    site => site.type === HERITAGE_TYPE_ID || (!!site.type && site.type !== MUSEUM_TYPE_ID)
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