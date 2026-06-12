import SEO from '@/components/SEO';
import MuseumDetail from '@/components/v2/MuseumDetail';
import { useMuseumSites } from '@/lib/v2/useSites';

export default function V2MuseumDetail() {
  const query = useMuseumSites();
  return (
    <>
      <SEO title="Detail Museum — Preview V2" noindex />
      <MuseumDetail query={query} />
    </>
  );
}
