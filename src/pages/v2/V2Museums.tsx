import SEO from '@/components/SEO';
import SiteListing, { type SiteListingConfig } from '@/components/v2/SiteListing';
import { useMuseumSites } from '@/lib/v2/useSites';
import museumInterior from '@/assets/museum-interior.jpg';

const CONFIG: SiteListingConfig = {
  kind: 'museum',
  heroImage: museumInterior,
  heroTitle: 'Museum Nusantara',
  heroSubtitle: 'Ruang temu antara masa lalu dan daya cipta masa kini',
  kicker: 'Rumah Para Kisah',
  listTitle: 'Kunjungi Museum',
  listDescription:
    'Koleksi prasejarah, seni rupa, batik, hingga memorial tokoh bangsa — dikelola sebagai pusat edukasi, penelitian, dan rekreasi budaya.',
  detailPrefix: '/v2/museum',
  batikVariant: 'megamendung',
  marqueeItems: ['ARTEFAK', 'LUKISAN', 'KERAMIK', 'NUMISMATIK', 'ETNOGRAFI', 'ARSIP', 'RELIEF'],
  crossLink: { label: 'Jelajahi Cagar Budaya', to: '/v2/heritage' },
};

export default function V2Museums() {
  const query = useMuseumSites();
  return (
    <>
      <SEO
        title="Museum — Preview V2"
        description="Kunjungi museum-museum Nusantara dalam pengalaman sinematik."
        noindex
      />
      <SiteListing config={CONFIG} query={query} />
    </>
  );
}
