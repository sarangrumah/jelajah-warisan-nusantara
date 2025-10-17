import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { museumStat } from '../../database/get-data';

interface ProfileStats {
  museums: number;
  heritages: number;
  provinces: number;
  experiences: string;
}

export const useProfileStats = (): ProfileStats => {
  const { t } = useTranslation('translation');

  const [stats, setStats] = useState<ProfileStats>({
    museums: museumStat.museums,
    heritages: museumStat.heritages,
    provinces: museumStat.provinces,
    experiences: museumStat.experiences,
  });

  useEffect(() => {
    setStats({
      museums: museumStat.museums,
      heritages: museumStat.heritages,
      provinces: museumStat.provinces,
      experiences: museumStat.experiences,
    });
  }, [t]);

  return stats;
};