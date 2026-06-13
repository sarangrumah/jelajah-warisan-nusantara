// Resolver gambar tb_sites untuk scope v2 — disalin dari pola yang sudah
// terbukti di src/pages/Heritage.tsx (getMuseumsImageUrl) agar v1 tak disentuh.
import mcbLogo from '@/assets/MCB-Logo.png';

const museumsImages = import.meta.glob('../../assets/museums/*', { eager: true });
const imagesImages = import.meta.glob('../../assets/images/*', { eager: true });
const sitesImages = import.meta.glob('../../assets/sites/*', { eager: true });

export function getSiteImageUrl(filename: string | undefined | null): string {
  if (!filename) {
    return '/placeholder.svg';
  }

  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/') ||
      filename.startsWith('/src/assets/') ||
      filename.startsWith('/uploads/'))
  ) {
    if (filename.startsWith('/src/assets/')) {
      // Aset bundel: resolve via import.meta.glob agar valid di dev & production
      const justFile = filename.split('/').pop() || '';
      const bundled = resolveBundled(justFile);
      if (bundled) {
        return bundled;
      }
      return filename.replace('/src/assets/', '/assets/');
    }
    return filename;
  }

  const justFile = filename.split('/').pop() || filename;
  const bundled = resolveBundled(justFile);
  if (bundled) {
    return bundled;
  }

  // Hanya nama file dari database → kemungkinan upload backend
  if (!filename.includes('/') && !filename.includes('\\')) {
    return `/uploads/sites/${filename}`;
  }

  if (filename.includes('sites/')) {
    return `/uploads/${filename.split('sites/')[1]}`;
  }

  if (!filename.startsWith('/')) {
    return `/assets/museums/${justFile}`;
  }

  return '/placeholder.svg';
}

function resolveBundled(justFile: string): string | null {
  for (const images of [sitesImages, museumsImages, imagesImages]) {
    const match = Object.entries(images).find(([path]) => path.endsWith(justFile));
    if (match) {
      return (match[1] as { default: string }).default;
    }
  }
  return null;
}

/** Memilih kandidat gambar dari record tb_sites + fallback logo MCB. */
export function getSiteImage(item: Record<string, any>): string {
  const candidate =
    item?.image_landscape || item?.image_url || item?.img_banner || item?.banner_image || item?.image_portrait || '';
  const resolved = getSiteImageUrl(candidate);
  return resolved && resolved !== '/placeholder.svg' ? resolved : mcbLogo;
}

/** Pasangan landscape/portrait dari record tb_sites untuk <ResponsiveImage>. */
export function getSiteImagePair(item: Record<string, any>): { landscape?: string; portrait?: string } {
  const landscape = item?.image_landscape || item?.img_banner || item?.image_url || item?.banner_image || undefined;
  const portrait = item?.image_portrait || undefined;
  return { landscape, portrait };
}
