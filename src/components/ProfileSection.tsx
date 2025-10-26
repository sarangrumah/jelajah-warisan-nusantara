import 'react';
import { useTranslate } from '@/hooks/useTranslate';
import { useProfileStats } from '@/hooks/useProfileStats';

// A simple component to render translated HTML
const TranslatedHtml = ({ text }: { text: string }) => {
  const { translatedText } = useTranslate(text);
  return <div dangerouslySetInnerHTML={{ __html: translatedText }} />;
};

const ProfileSection = () => {
  const profileStats = useProfileStats();
  
  // This is where you would fetch your dynamic data, for now we will use static data
  const profile = {
      vision: `“Menjadi ruang jelajah warisan budaya dan sejarah yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan karakter yang berbudaya.”`,
      mission: `Mewujudkan pengelolaan koleksi, cagar budaya, dan bangunan bersejarah yang berkelanjutan.<br>Melaksanakan upaya pelayanan dan pelibatan masyarakat secara terpadu.<br>Mengedepankan transformasi pengembangan wawasan melalui praktik edukasi yang inovatif dan pembangunan komunitas.<br>Menjalin kepercayaan kuat antara para pemangku kepentingan yang berbasis kemitraan.<br>Mewujudkan ruang ekspresi dan interaksi budaya yang inklusif dan mudah diakses.<br>Mewujudkan tata kelola kelembagaan dan pengelolaan sumber daya manusia yang tangkas dan berorientasi kepada dampak yang berkelanjutan.`,
      aboutus: `Museum dan Cagar Budaya (Indonesian Heritage Agency) merupakan Badan Layanan Umum (BLU) di bawah naungan Kementerian Kebudayaan Republik Indonesia yang saat ini bertanggung jawab atas pengelolaan 19 museum dan galeri serta 34 situs cagar budaya nasional di Indonesia. Terbentuk pada tahun 2022 dan diresmikan menjadi BLU per tanggal 1 September 2023. Museum dan Cagar Budaya memiliki visi untuk menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.`,
      address: `Jalan Medan Merdeka Barat No. 12 Jakarta Pusat 10110`,
      phone: `(021) 123-4567`,
      whatsapp: `0812-3456-7890`,
      email: `museumcb@kemenbud.go.id`,
      website: `https://museumcagarbudaya.kemenbud.go.id/`
  }

  const { translatedText: title } = useTranslate('Tentang Kami');
  const { translatedText: description } = useTranslate('Museum dan Cagar Budaya (Indonesian Heritage Agency) merupakan Badan Layanan Umum (BLU) di bawah naungan Kementerian Kebudayaan Republik Indonesia yang saat ini bertanggung jawab atas pengelolaan 19 museum dan galeri serta 34 situs cagar budaya nasional di Indonesia. Terbentuk pada tahun 2022 dan diresmikan menjadi BLU per tanggal 1 September 2023. Museum dan Cagar Budaya memiliki visi untuk menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.');
  const { translatedText: visionTitle } = useTranslate('Visi');
  const { translatedText: missionTitle } = useTranslate('Misi');
  const { translatedText: aboutUsTitle } = useTranslate('Tentang Kami');
  const { translatedText: contactTitle } = useTranslate('Hubungi Kami');
  const { translatedText: addressLabel } = useTranslate('Alamat');
  const { translatedText: phoneLabel } = useTranslate('Telepon');
  const { translatedText: whatsappLabel } = useTranslate('WhatsApp');
  const { translatedText: emailLabel } = useTranslate('Email');
  const { translatedText: websiteLabel } = useTranslate('Situs Web');

  const statItems = [
    { value: profileStats.museums, label: useTranslate('Museum Terdaftar').translatedText },
    { value: profileStats.heritages, label: useTranslate('Cagar Budaya').translatedText },
    { value: profileStats.provinces, label: useTranslate('Provinsi').translatedText },
    { value: profileStats.experiences, label: useTranslate('Tahun Pengalaman').translatedText }
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-2xl md:text-4xl font-bold text-heritage-gradient pb-3">
              {title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-8xl mx-autox p-6 leading-relaxed text-justify">
              {description}
            </p>
          </div>

          <div className="grid gap-12 items-center mb-16">
            <div className="space-y-6 scroll-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{visionTitle}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.vision} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-primary mb-3">{missionTitle}</h4>
                  <div className="prose space-y-2 text-muted-foreground">
                    <TranslatedHtml text={profile.mission} />
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{aboutUsTitle}</h4>
                  <div className="prose text-muted-foreground">
                    <TranslatedHtml text={profile.aboutus} />
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary mb-2">{contactTitle}</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      <b>{addressLabel}:</b> <TranslatedHtml text={profile.address} />
                    </li>
                    <li>
                      <b>{phoneLabel}:</b> <TranslatedHtml text={profile.phone} />
                    </li>
                    <li>
                      <b>{whatsappLabel}:</b> <TranslatedHtml text={profile.whatsapp} />
                    </li>
                    <li>
                      <b>{emailLabel}:</b> <TranslatedHtml text={profile.email} />
                    </li>
                    <li>
                      <b>{websiteLabel}:</b> <TranslatedHtml text={profile.website} />
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