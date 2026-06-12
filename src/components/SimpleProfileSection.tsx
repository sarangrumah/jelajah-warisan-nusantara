import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService, siteSettingsService } from '@/lib/api-services';

const SimpleProfileSection: React.FC = () => {
  const { t } = useTranslation();
  const [companyData, setCompanyData] = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await contentService.getAll();
        if (!response.error && response.data && response.data.length > 0) {
          setCompanyData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await siteSettingsService.getAll();
        if (!response.error && Array.isArray(response.data)) {
          const map: Record<string, string> = {};
          (response.data as any[]).forEach((row) => {
            if (row?.key) { map[row.key] = row.value; }
          });
          setSettings(map);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchCompanyData();
    fetchSettings();
  }, []);

  // Fallback static data
  const staticProfile = {
    vision: t('profile.visionText'),
    mission: (t('profile.missionItems', { returnObjects: true }) as string[]).join('<br>'),
    aboutus: t('profile.description'),
    address: t('contact.office.address1') + ', ' + t('contact.office.address2'),
    phone: `(021) 123-4567`,
    whatsapp: `0812-3456-7890`,
    email: t('contact.email'),
    website: `https://museumcagarbudaya.kemenbud.go.id/`
  };

  // Use dynamic data if available, otherwise fallback to static
  const profile = {
    vision: companyData?.vision || staticProfile.vision,
    mission: companyData?.mission || staticProfile.mission,
    aboutus: companyData?.aboutus || staticProfile.aboutus,
    address: companyData?.address || staticProfile.address,
    phone: companyData?.phone || staticProfile.phone,
    whatsapp: companyData?.whatsapp || staticProfile.whatsapp,
    email: companyData?.email || staticProfile.email,
    website: companyData?.website || staticProfile.website
  };

  // Utility to fix broken HTML tags
  function fixBrokenHtmlTags(html: string): string {
    if (!html) { return html; }
    return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
               .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
  }

  const TranslatedHtml = ({ text }: { text: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(text) }} />;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
              {t('profile.title')}
            </h2>
            <div className="text-xl text-muted-foreground max-w-4xl mx-auto p-6 leading-relaxed text-justify">
              <TranslatedHtml text={profile.aboutus || t('profile.description')} />
            </div>
          </div>

          <div className="grid gap-12 items-center mb-16">
            <div className="space-y-6 scroll-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.vision')}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.vision} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.mission')}</h4>
                  <div className="prose space-y-2 text-muted-foreground">
                    <TranslatedHtml text={profile.mission} />
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{t('profile.title')}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.aboutus} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{t('contact.title')}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      <b>{t('contact.office.title')}:</b> <TranslatedHtml text={profile.address} />
                    </li>
                    <li>
                      <b>{t('contact.whatsapp')}:</b> <TranslatedHtml text={profile.whatsapp} />
                    </li>
                    <li>
                      <b>{t('contact.email')}:</b> <TranslatedHtml text={profile.email} />
                    </li>
                    <li>
                      <b>Website:</b> <TranslatedHtml text={profile.website} />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Stats are CMS-editable via tb_site_settings (Settings admin) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center scroll-reveal mt-16">
            {[
              { value: settings['homepage.stats.museums'] || '19', label: t('profile.stats.museums') },
              { value: settings['homepage.stats.heritage'] || '34', label: t('profile.stats.heritage') },
              { value: settings['homepage.stats.provinces'] || '12', label: t('profile.stats.provinces') },
              { value: settings['homepage.stats.experience'] || '50+', label: t('profile.stats.experience') }
            ].map((stat, index) => (
              <div key={index}>
                <h4 className="text-3xl md:text-4xl font-bold text-heritage-gradient">{stat.value}</h4>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SimpleProfileSection;