import 'react';
import { useTranslation } from 'react-i18next';
import { contentService } from '@/lib/api-services';
import { useContent } from '@/hooks/useContent';
import { useProfileStats } from '@/hooks/useProfileStats';

// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  // Replace < tag > and < / tag > with <tag> and </tag>
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

type CompanyProfile = {
  id: string;
  name: string;
  brand?: string;
  aboutus?: string;
  vision?: string;
  mission?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  latitude?: string;
  longitude?: string;
  // Add other fields as needed
};

const ProfileSection = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useContent(contentService);
  const profile = (data?.[0] as CompanyProfile) || null;
  const profileStats = useProfileStats();

  // Debug log to check profile at render time

  const statItems = [
    { value: profileStats.museums, label: t('profile.stats.museums') },
    { value: profileStats.heritages, label: t('profile.stats.heritage') },
    { value: profileStats.provinces, label: t('profile.stats.provinces') },
    { value: profileStats.experiences, label: t('profile.stats.experience') }
  ];

  return (
    <>
      {/* <div style={{ color: 'magenta', fontWeight: 'bold' }}>DEBUG: ProfileSection render reached</div> */}
      <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
            {t('profile.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-8xl mx-autox p-6 leading-relaxed text-justify">
            {t('profile.description')}
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Loading company profile...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}
        {profile && (
          <div className="grid gap-12 items-center mb-16">
            <div className="space-y-6 scroll-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.vision')}</h4>
                  {(() => {
                    const visionHtml = (profile?.vision) || '-';
                    return (
                      <div
                        className="prose text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags(visionHtml) }}
                      />
                    );
                  })()}
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.mission')}</h4>
                  <div className="prose space-y-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags((profile?.mission) || '-') }} />
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{t('profile.aboutUs', 'Tentang Kami')}</h4>
                  <div className="prose text-muted-foreground" dangerouslySetInnerHTML={{ __html: fixBrokenHtmlTags((profile?.aboutus) || '-') }} />
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{t('profile.profile.contact', 'Hubungi Kami')}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      <b>{t('profile.contact.address', 'Address')}:</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags((profile?.address) || '-')
                        }}
                      />
                    </li>
                    <li>
                      <b>{t('profile.contact.phone', 'Phone')}:</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags((profile?.phone) || '-')
                        }}
                      />
                    </li>
                    <li>
                      <b>{t('profile.contact.whatsapp', 'WhatsApp')}:</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags((profile?.whatsapp) || '-')
                        }}
                      />
                    </li>
                    <li>
                      <b>{t('profile.contact.email', 'Email')}:</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags((profile?.email) || '-')
                        }}
                      />
                    </li>
                    <li>
                      <b>{t('profile.contact.website', 'Website')}:</b>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: fixBrokenHtmlTags((profile?.website) || '-')
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center scroll-reveal mt-16">
          {statItems.map((stat, index) => (
            <div key={index}>
              <h4 className="text-3xl md:text-4xl font-bold text-heritage-gradient">{stat.value}</h4>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Call to Action (optional) */}
        {/* <div className="text-center scroll-reveal">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('profile.callToAction')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('profile.callToActionText')}
            </p>
            <Link to="/tentang-kami">
              <button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-bounce heritage-glow">
                {t('profile.learnMore')}
              </button>
            </Link>
          </div>
        </div> */}
      </div>
    </section>
    </>
  );
};

export default ProfileSection;