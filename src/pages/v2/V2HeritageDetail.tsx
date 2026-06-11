import SEO from '@/components/SEO';
import SiteDetail, { type SiteDetailConfig } from '@/components/v2/SiteDetail';
import { useHeritageSites } from '@/lib/v2/useSites';

const CONFIG: SiteDetailConfig = {
  kind: 'heritage',
  listPath: '/v2/heritage',
  listLabel: 'Kembali ke Cagar Budaya',
  detailPrefix: '/v2/heritage',
  kicker: 'Cagar Budaya',
  batikVariant: 'kawung',
};

export default function V2HeritageDetail() {
  const query = useHeritageSites();
  return (
    <>
      <SEO title="Detail Cagar Budaya — Preview V2" noindex />
      <SiteDetail config={CONFIG} query={query} />
    </>
  );
}
