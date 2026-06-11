import SEO from '@/components/SEO';
import SiteListing, { type SiteListingConfig } from '@/components/v2/SiteListing';
import { useHeritageSites } from '@/lib/v2/useSites';
import heritageSites from '@/assets/heritage-sites.jpg';

const CONFIG: SiteListingConfig = {
  kind: 'heritage',
  heroImage: heritageSites,
  heroTitle: 'Cagar Budaya',
  heroSubtitle: 'Jejak peradaban Nusantara yang dijaga lintas generasi',
  kicker: 'Warisan yang Hidup',
  listTitle: 'Telusuri Cagar Budaya',
  listDescription:
    'Dari benteng pesisir hingga percandian pegunungan — setiap situs menyimpan kisah yang membentuk Indonesia hari ini.',
  detailPrefix: '/v2/heritage',
  batikVariant: 'kawung',
  marqueeItems: ['CANDI', 'BENTENG', 'KERATON', 'SITUS', 'PRASASTI', 'MAKAM', 'PETIRTAAN'],
  crossLink: { label: 'Kunjungi Museum', to: '/v2/museums' },
};

export default function V2Heritage() {
  const query = useHeritageSites();
  return (
    <>
      <SEO
        title="Cagar Budaya — Preview V2"
        description="Telusuri cagar budaya Nusantara dalam pengalaman sinematik."
        noindex
      />
      <SiteListing config={CONFIG} query={query} />
    </>
  );
}
