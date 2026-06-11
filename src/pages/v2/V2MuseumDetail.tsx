import SEO from '@/components/SEO';
import SiteDetail, { type SiteDetailConfig } from '@/components/v2/SiteDetail';
import { useMuseumSites } from '@/lib/v2/useSites';

const CONFIG: SiteDetailConfig = {
  kind: 'museum',
  listPath: '/v2/museums',
  listLabel: 'Kembali ke Museum',
  detailPrefix: '/v2/museum',
  kicker: 'Museum',
  batikVariant: 'megamendung',
};

export default function V2MuseumDetail() {
  const query = useMuseumSites();
  return (
    <>
      <SEO title="Detail Museum — Preview V2" noindex />
      <SiteDetail config={CONFIG} query={query} />
    </>
  );
}
