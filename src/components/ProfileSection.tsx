import React, { useMemo } from 'react';
import { useOnDemandTranslate } from '@/hooks/useOnDemandTranslate';
import { useProfileStats } from '@/hooks/useProfileStats';

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
  
  // Collect all texts that need translation
  const profileTexts = useMemo(() => ({
    title: 'profile.title',
    description: 'profile.description',
    visionTitle: 'profile.vision',
    missionTitle: 'profile.mission',
    aboutUsTitle: 'profile.title',
    contactTitle: 'profile.stats.museums',
    addressLabel: 'profile.stats.museums',
    phoneLabel: 'profile.stats.heritage',
    whatsappLabel: 'profile.stats.provinces',
    emailLabel: 'profile.stats.experience',
    websiteLabel: 'profile.stats.experience',
    museumTerdaftar: 'profile.stats.museums',
    cagarBudaya: 'profile.stats.heritage',
    provinsi: 'profile.stats.provinces',
    tahunPengalaman: 'profile.stats.experience'
  }), []);

  // Translate texts only when the component is visible
  const { ref, translations } = useOnDemandTranslate(profileTexts);

  // This is where you would fetch your dynamic data, for now we will use static data
  const profile = {
      vision: `"Menjadi ruang jelajah warisan budaya dan sejarah yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan karakter yang berbudaya."`,
      mission: `Mewujudkan pengelolaan koleksi, cagar budaya, dan bangunan bersejarah yang berkelanjutan.<br>Melaksanakan upaya pelayanan dan pelibatan masyarakat secara terpadu.<br>Mengedepankan transformasi pengembangan wawasan melalui praktik edukasi yang inovatif dan pembangunan komunitas.<br>Menjalin kepercayaan kuat antara para pemangku kepentingan yang berbasis kemitraan.<br>Mewujudkan ruang ekspresi dan interaksi budaya yang inklusif dan mudah diakses.<br>Mewujudkan tata kelola kelembagaan dan pengelolaan sumber daya manusia yang tangkas dan berorientasi kepada dampak yang berkelanjutan.`,
      aboutus: `Museum dan Cagar Budaya (Indonesian Heritage Agency) merupakan Badan Layanan Umum (BLU) di bawah naungan Kementerian Kebudayaan Republik Indonesia yang saat ini bertanggung jawab atas pengelolaan 19 museum dan galeri serta 34 situs cagar budaya nasional di Indonesia. Terbentuk pada tahun 2022 dan diresmikan menjadi BLU per tanggal 1 September 2023. Museum dan Cagar Budaya memiliki visi untuk menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.`,
      address: `Jalan Medan Merdeka Barat No. 12 Jakarta Pusat 10110`,
      phone: `(021) 123-4567`,
      whatsapp: `0812-3456-7890`,
      email: `museumcb@kemenbud.go.id`,
      website: `https://museumcagarbudaya.kemenbud.go.id/`
  };

  const statItems = [
    { value: profileStats.museums, label: translations.museumTerdaftar || 'Museum Terdaftar' },
    { value: profileStats.heritages, label: translations.cagarBudaya || 'Cagar Budaya' },
    { value: profileStats.provinces, label: translations.provinsi || 'Provinsi' },
    { value: profileStats.experiences, label: translations.tahunPengalaman || 'Tahun Pengalaman' }
  ];

  return (
    <>
      <section ref={ref} className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
              {translations.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-8xl mx-auto p-6 leading-relaxed text-justify">
              {translations.description}
            </p>
          </div>

          <div className="grid gap-12 items-center mb-16">
            <div className="space-y-6 scroll-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{translations.visionTitle}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.vision} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{translations.missionTitle}</h4>
                  <div className="prose space-y-2 text-muted-foreground">
                    <TranslatedHtml text={profile.mission} />
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{translations.aboutUsTitle}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.aboutus} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{translations.contactTitle}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      <b>{translations.addressLabel}:</b> <TranslatedHtml text={profile.address} />
                    </li>
                    <li>
                      <b>{translations.phoneLabel}:</b> <TranslatedHtml text={profile.phone} />
                    </li>
                    <li>
                      <b>{translations.whatsappLabel}:</b> <TranslatedHtml text={profile.whatsapp} />
                    </li>
                    <li>
                      <b>{translations.emailLabel}:</b> <TranslatedHtml text={profile.email} />
                    </li>
                    <li>
                      <b>{translations.websiteLabel}:</b> <TranslatedHtml text={profile.website} />
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