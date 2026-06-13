import { useState, useEffect } from 'react';
import { museumStat } from '../../database/get-data';
import { museumService, heritageService, siteSettingsService } from '@/lib/api-services';

// Represents the structure of museum statistics
interface MuseumStats {
  museums: number | string;
  visitors: string;
  programs: number | string;
  sites: number | string;
  provinces: number | string;
  projects: number | string;
}

/**
 * Homepage "management" statistics, sourced from real data:
 *  - museums / sites: live counts of published museums / cagar budaya (tb_sites)
 *  - visitors / programs / provinces / projects: CMS-managed values from
 *    tb_site_settings (homepage.stats.*), editable in admin Site Settings
 * The bundled museumStat values are only a last-resort fallback when the API is
 * unavailable, so the section never renders blank.
 */
export const useMuseumStats = (): MuseumStats => {
  const [stats, setStats] = useState<MuseumStats>({
    museums: museumStat.museums,
    visitors: museumStat.visitors,
    programs: museumStat.programs,
    sites: museumStat.sites,
    provinces: museumStat.provinces,
    projects: museumStat.projects,
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
          sites: liveHeritage ?? settings['homepage.stats.heritage'] ?? museumStat.sites,
          visitors: settings['homepage.stats.visitors'] ?? museumStat.visitors,
          programs: settings['homepage.stats.programs'] ?? museumStat.programs,
          provinces: settings['homepage.stats.provinces'] ?? museumStat.provinces,
          projects: settings['homepage.stats.projects'] ?? museumStat.projects,
        });
      } catch (error) {
        // Keep the static fallback already in state.
        console.error('useMuseumStats: failed to load live stats', error);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return stats;
};
