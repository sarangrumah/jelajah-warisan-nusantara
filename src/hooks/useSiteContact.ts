import { useState, useEffect } from 'react';
import { useCompanyData } from './useCompanyData';
import { siteSettingsService } from '@/lib/api-services';

const FALLBACK = {
  phone: '0812-9595-3929',
  whatsapp: '0812-9595-3929',
  email: 'museumcb@kemenbud.go.id',
  instagram: 'https://www.instagram.com/indonesianheritageagency/',
  youtube: 'https://www.youtube.com/@IndonesianHeritageAgency',
};

/** Normalize an Indonesian phone/WhatsApp number to digits for a wa.me link. */
export const toWhatsappDigits = (raw?: string): string => {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) { return ''; }
  if (digits.startsWith('62')) { return digits; }
  if (digits.startsWith('0')) { return `62${digits.slice(1)}`; }
  return digits;
};

interface SiteContact {
  phone: string;
  whatsapp: string;
  whatsappLink: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  youtube: string;
}

/**
 * Single source of truth for visitor-facing contact + social links.
 * Contact details come from tb_company (CMS Company Profile); social links come
 * from tb_site_settings (CMS Site Settings). Hardcoded values are only a
 * last-resort fallback so nothing renders blank.
 */
export const useSiteContact = (): SiteContact => {
  const { companyData } = useCompanyData();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await siteSettingsService.getAll();
        if (!cancelled && !res.error && Array.isArray(res.data)) {
          const map: Record<string, string> = {};
          (res.data as any[]).forEach((s) => { if (s?.key) { map[s.key] = s.value; } });
          setSettings(map);
        }
      } catch {
        /* keep fallbacks */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const whatsapp = companyData?.whatsapp || FALLBACK.whatsapp;

  return {
    phone: companyData?.phone || FALLBACK.phone,
    whatsapp,
    whatsappLink: `https://wa.me/${toWhatsappDigits(whatsapp)}`,
    email: companyData?.email || FALLBACK.email,
    address: companyData?.address || '',
    website: companyData?.website || '',
    instagram: settings['company.social.instagram'] || FALLBACK.instagram,
    youtube: settings['company.social.youtube'] || FALLBACK.youtube,
  };
};
