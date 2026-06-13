import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { defaultCollections } from '@/../database/default-data';
import { masterCollectionService } from '@/lib/api-services';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import logo from '@/assets/MCB-Logo.png';

const collectionImages = import.meta.glob(
  ['../../assets/museums/*', '../../assets/sites/*', '../../assets/collections/*'],
  { eager: true },
);
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function getCollectionImageUrl(filename: string | undefined | null): string {
  if (!filename) return PLACEHOLDER_IMAGE;
  if (typeof filename !== 'string') return PLACEHOLDER_IMAGE;

  if (!filename.includes('/') && !filename.includes('\\')) {
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return `${baseUrl}/uploads/collection/${filename}`;
  }
  if (filename.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return `${baseUrl}${filename}`;
  }
  if (
    filename.startsWith('http://') ||
    filename.startsWith('https://') ||
    filename.startsWith('/assets/')
  ) {
    return filename;
  }

  const cleanFilename = filename.split('/').pop();
  if (!cleanFilename) return PLACEHOLDER_IMAGE;
  const match = Object.entries(collectionImages).find(([path]) => path.endsWith(cleanFilename));
  return match ? (match[1] as { default: string }).default : PLACEHOLDER_IMAGE;
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

interface V2GalleryCollectionProps {
  museumName: string;
}

export default function V2GalleryCollection({ museumName }: V2GalleryCollectionProps) {
  const [collections, setCollections] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await masterCollectionService.getAll();
        if (cancelled) return;
        if (response.error || !Array.isArray(response.data) || response.data.length === 0) {
          setCollections(defaultCollections as Record<string, unknown>[]);
        } else {
          setCollections(response.data as Record<string, unknown>[]);
        }
      } catch {
        if (!cancelled) setCollections(defaultCollections as Record<string, unknown>[]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const galleries = collections
    .filter((c) => c.museum_name === museumName)
    .filter((g) => {
      const v = g.image_landscape || g.image_url || g.image_portrait;
      return typeof v === 'string' && v.length > 0;
    });

  if (galleries.length === 0) {
    return (
      <div className="rounded-2xl bg-card/60 border border-border/60 px-6 py-10 backdrop-blur-sm text-center">
        <img src={logo} alt="MCB" className="mx-auto h-14 w-14 opacity-60 mb-3" />
        <p className="text-sm text-muted-foreground">Galeri koleksi belum tersedia.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {galleries.map((g, i) => {
          const landscape = g.image_landscape || g.image_url;
          const portrait = g.image_portrait;
          // Lightbox shows the largest available variant.
          const lightboxUrl = getCollectionImageUrl(landscape || portrait);
          return (
            <motion.button
              key={`${g.id || lightboxUrl}-${i}`}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.04 }}
              type="button"
              onClick={() => setSelected(lightboxUrl)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm"
            >
              <ResponsiveImage
                landscape={landscape}
                portrait={portrait}
                fallback={g.image_url}
                alt={g.title ? String(g.title) : `Koleksi ${i + 1}`}
                bucket="collection"
                ratio="auto"
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="[&>button]:hidden outline-none p-0 bg-transparent border-0 shadow-none flex justify-center items-center"
          aria-describedby={undefined}
        >
          <DialogTitle className="hidden">Pratinjau koleksi</DialogTitle>
          {selected && (
            <img
              src={selected}
              alt="Pratinjau koleksi"
              className="rounded-xl max-h-[90vh] max-w-[90vw] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
