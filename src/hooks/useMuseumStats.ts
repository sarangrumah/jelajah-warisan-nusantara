import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Base static statistics
import { museumStat } from '@/../../database/get-data';

// Represents the structure of museum statistics
interface MuseumStats {
  museums: number;
  visitors: string;
  programs: number;
  sites: number;
  provinces: number;
  projects: number;
}

// Custom hook to get museum statistics and handle dynamic translations
export const useMuseumStats = (): MuseumStats => {
  const { t } = useTranslation('translation');

  // State to hold the statistics
  const [stats, setStats] = useState<MuseumStats>({
    museums: museumStat.museums,
    visitors: museumStat.visitors,
    programs: museumStat.programs,
    sites: museumStat.sites,
    provinces: museumStat.provinces,
    projects: museumStat.projects,
  });

  useEffect(() => {
    // This is where you would normally fetch data from an API
    // For this example, we use static data and re-evaluate on language change
    setStats({
      museums: museumStat.museums,
      visitors: museumStat.visitors,
      programs: museumStat.programs,
      sites: museumStat.sites,
      provinces: museumStat.provinces,
      projects: museumStat.projects,
    });
  }, [t]); // Add 't' as a dependency to refetch/re-evaluate when the language changes

  return stats;
};
