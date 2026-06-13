import { useState, useEffect } from 'react';
import { museumStat } from '../../database/get-data';
import { museumService, heritageService, siteSettingsService } from '@/lib/api-services';

interface ProfileStats {
  museums: number | string;
  heritages: number | string;
  provinces: number | string;
  experiences: string;
}

/**
 * Live homepage stats. Museum / Cagar Budaya totals are counted straight from
 * the published tb_sites lists; Provinsi / Pengalaman come from CMS site
 * settings. The bundled museumStat values are only a last-resort fallback when
 * the API is unavailable (so the section never renders blank).
 */
export const useProfileStats = (): ProfileStats => {
  const [stats, setStats] = useState<ProfileStats>({
    museums: museumStat.museums,
    heritages: museumStat.heritages,
    provinces: museumStat.provinces,
    experiences: museumStat.experiences,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [museumsRes, heritageRes, settingsRes] = await Promise.all([
          museumService.getPublished(),
          heritageService.getPublished(),
          siteSettingsService.getAll(),
        ]);

        const settings: Record<string, string> = {};
        if (!settingsRes.error && Array.isArray(settingsRes.data)) {
          (settingsRes.data as any[]).forEach((row) => {
            if (row?.key) { settings[row.key] = row.value; }
          });
        }

        const liveMuseums =
          !museumsRes.error && Array.isArray(museumsRes.data) ? museumsRes.data.length : null;
        const liveHeritage =
          !heritageRes.error && Array.isArray(heritageRes.data) ? heritageRes.data.length : null;

        if (cancelled) { return; }
        setStats({
          museums: liveMuseums ?? settings['homepage.stats.museums'] ?? museumStat.museums,
          heritages: liveHeritage ?? settings['homepage.stats.heritage'] ?? museumStat.heritages,
          provinces: settings['homepage.stats.provinces'] ?? museumStat.provinces,
          experiences: settings['homepage.stats.experience'] ?? museumStat.experiences,
        });
      } catch (error) {
        // Keep the static fallback already in state.
        console.error('useProfileStats: failed to load live stats', error);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return stats;
};
