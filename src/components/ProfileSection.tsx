// import { useState } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contentService } from '@/lib/api-services';

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
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await contentService.getAll();
        if (response.error) { throw new Error(response.error); }
        // Use the first profile (or adjust as needed)
        const data = response.data as CompanyProfile[];
        setProfile(data && data.length > 0 ? data[0] : null);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
            {t('profile.title')}
          </h2>
          {loading && (
            <div className="text-center text-muted-foreground">Loading company profile...</div>
          )}
          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}
          {profile ? (
            <p
              className="text-xl text-muted-foreground max-w-8xl mx-autox p-6 leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: profile.aboutus || '-' }}
            />
          ) : (!loading && !error) ? (
            <p className="text-xl text-muted-foreground max-w-8xl mx-autox p-6 leading-relaxed text-justify">
              No company profile data available.
            </p>
          ) : null}
            {/* {t('profile.description')} */}
          
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">Loading company profile...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}
        {profile && (
          <div className="grid gap-12 items-center mb-16">
            <div className="space-y-6 scroll-revealx">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.vision')}</h4>
                  <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: profile.vision || '-' }} />
                  {!profile.vision && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>
                      <b>Debug:</b> Vision is missing or empty from backend.
                    </div>
                  )}
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{t('profile.mission')}</h4>
                  <div className="space-y-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: profile.mission || '-' }} />
                  {!profile.mission && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>
                      <b>Debug:</b> Mission is missing or empty from backend.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
  );
};

export default ProfileSection;