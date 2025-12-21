import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProfileStats } from '@/hooks/useProfileStats';
import { useCompanyData } from '@/hooks/useCompanyData';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

// A simple component to render translated HTML
const TranslatedHtml = ({ text }: { text: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(text) }} />;
};

const ProfileSection = () => {
  const profileStats = useProfileStats();
  const { companyData, loading: companyLoading, error: companyError } = useCompanyData();
  const { t } = useTranslation();

  // Use dynamic data from database with fallback to static data
  const profile = {
      vision: companyData?.vision || t('profile.visionText'),
      mission: companyData?.mission || (t('profile.missionItems', { returnObjects: true }) as string[]).join('<br>'),
      aboutus: companyData?.aboutus || t('profile.description'),
      address: companyData?.address || (t('contact.office.address1') + ', ' + t('contact.office.address2')),
      phone: companyData?.phone || `(021) 123-4567`,
      whatsapp: companyData?.whatsapp || `0812-3456-7890`,
      email: companyData?.email || t('contact.email'),
      website: companyData?.website || `https://museumcagarbudaya.kemenbud.go.id/`
  };

  // Show loading state
  if (companyLoading) {
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

  // Show error state but still render with fallback data
  if (companyError) {
    console.warn('Failed to load company data:', companyError);
  }

  const statItems = [
    { value: profileStats.museums, label: t('profile.stats.museums') },
    { value: profileStats.heritages, label: t('profile.stats.heritage') },
    { value: profileStats.provinces, label: t('profile.stats.provinces') },
    { value: profileStats.experiences, label: t('profile.stats.experience') }
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          {/* <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
              {t('profile.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-8xl mx-auto p-6 leading-relaxed text-justify">
              {t('profile.description')}
            </p>
          </div> */}

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center scroll-reveal mt-16">
            {statItems.map((stat, index) => (
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

export default ProfileSection;