// Data layer /v2 — memakai service API yang sama dengan v1 (TanStack Query)
// dengan fallback statis dari database/default-data agar demo tetap hidup
// walau backend mati. Konten HTML hero disanitasi DI SINI sebelum masuk
// komponen presentasi (HeroSectionV2 merender title/subtitle sebagai HTML).
import { useQuery } from '@tanstack/react-query';
import {
  heritageService,
  museumService,
  bannerService,
  newsService,
  TypesAndCategoriesSites,
} from '@/lib/api-services';
import { defaultHeritages, defaultMuseums } from '@/../database/default-data';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { fixBrokenHtmlTags } from './fixHtml';
import type { HeroV2Slide } from '@/components/motion/HeroSectionV2';
import heroBorobudur from '@/assets/hero-borobudur.jpg';
import museumInterior from '@/assets/museum-interior.jpg';
import heritageSites from '@/assets/heritage-sites.jpg';

const STALE_TIME = 5 * 60 * 1000;

export interface SitesResult {
  items: Record<string, any>[];
  isFallback: boolean;
}

async function fetchSites(
  service: { getPublished: () => Promise<{ data: any; error: any }> },
  fallback: Record<string, any>[],
): Promise<SitesResult> {
  try {
    const response = await service.getPublished();
    if (response.error || !Array.isArray(response.data) || response.data.length === 0) {
      return { items: fallback, isFallback: true };
    }
    return { items: response.data, isFallback: false };
  } catch {
    return { items: fallback, isFallback: true };
  }
}

export function useHeritageSites() {
  return useQuery({
    queryKey: ['v2', 'sites', 'heritage'],
    queryFn: () => fetchSites(heritageService, defaultHeritages),
    staleTime: STALE_TIME,
  });
}

export function useMuseumSites() {
  return useQuery({
    queryKey: ['v2', 'sites', 'museum'],
    queryFn: () => fetchSites(museumService, defaultMuseums),
    staleTime: STALE_TIME,
  });
}

/** Kategori situs untuk filter listing ("cagar budaya" / "museum"). */
export function useSiteCategories(typeName: 'cagar budaya' | 'museum') {
  return useQuery({
    queryKey: ['v2', 'site-categories', typeName],
    staleTime: STALE_TIME,
    queryFn: async () => {
      try {
        const typesResponse = await TypesAndCategoriesSites.getAllTypes();
        if (typesResponse.error || !Array.isArray(typesResponse.data)) {
          return [] as Record<string, any>[];
        }
        const type = typesResponse.data.find((t: any) => {
          const name = typeof t.name === 'string' ? t.name : (typeof t.title === 'string' ? t.title : '');
          return name.toLowerCase() === typeName;
        });
        if (!type?.id) {
          return [] as Record<string, any>[];
        }
        const categoriesResponse = await TypesAndCategoriesSites.getAllCategories(type.id);
        if (categoriesResponse.error || !Array.isArray(categoriesResponse.data)) {
          return [] as Record<string, any>[];
        }
        return categoriesResponse.data as Record<string, any>[];
      } catch {
        return [] as Record<string, any>[];
      }
    },
  });
}

// ---- Hero slides ----

const FALLBACK_SLIDES: HeroV2Slide[] = [
  {
    image: heroBorobudur,
    title: 'Jelajah Warisan<br/>Nusantara',
    subtitle:
      'Menjadi ruang jelajah warisan budaya dan sejarah yang kolaboratif — mendorong daya cipta dan pembangunan karakter berbudaya.',
    cta: [
      { label: 'Jelajahi Cagar Budaya', href: '/v2/heritage' },
      { label: 'Kunjungi Museum', href: '/v2/museums' },
    ],
  },
  {
    image: museumInterior,
    title: 'Koleksi Bersejarah<br/>Nusantara',
    subtitle: 'Melindungi dan melestarikan koleksi museum sebagai warisan bangsa.',
    cta: [{ label: 'Kunjungi Museum', href: '/v2/museums' }],
  },
  {
    image: heritageSites,
    title: 'Cagar Budaya',
    subtitle:
      'Mengembangkan museum dan cagar budaya sebagai pusat edukasi, penelitian, dan rekreasi budaya.',
    cta: [{ label: 'Jelajah Cagar Budaya', href: '/v2/heritage' }],
  },
];

function toV2Href(raw?: string): string | undefined {
  if (!raw) {
    return undefined;
  }
  const key = raw.includes('.') ? raw.split('.')[1] : raw;
  if (key === 'museum') return '/v2/museums';
  if (key === 'heritage') return '/v2/heritage';
  if (key === 'collection') return '/collection';
  return raw;
}

const isImageFile = (filename: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename || '');

export function useHeroSlides() {
  return useQuery({
    queryKey: ['v2', 'hero-slides'],
    staleTime: STALE_TIME,
    queryFn: async (): Promise<{ slides: HeroV2Slide[]; isFallback: boolean }> => {
      try {
        const response = await bannerService.getAll();
        if (response.error || !Array.isArray(response.data) || response.data.length === 0) {
          return { slides: FALLBACK_SLIDES, isFallback: true };
        }
        const now = new Date();
        const slides = response.data
          .filter(
            (slide: any) =>
              slide.is_active === true &&
              slide.is_approved === true &&
              new Date(slide.start_publish_date) <= now &&
              new Date(slide.end_publish_date) >= now &&
              isImageFile(slide.image),
          )
          .map((slide: any): HeroV2Slide => {
            const image =
              slide.image && !slide.image.startsWith('/uploads/hero-sections/')
                ? `/uploads/hero-sections/${slide.image.split('/').pop()}`
                : slide.image;
            const cta = [
              slide.button_label_1 && {
                label: String(slide.button_label_1),
                href: toV2Href(slide.button_url_1),
              },
              slide.button_label_2 && {
                label: String(slide.button_label_2),
                href: toV2Href(slide.button_url_2),
              },
            ].filter(Boolean) as { label: string; href?: string }[];
            return {
              image,
              // HeroSectionV2 merender title/subtitle via dangerouslySetInnerHTML —
              // wajib lewat sanitizer (memperbaiki celah yang ada di v1).
              title: sanitizeHtml(fixBrokenHtmlTags(slide.title || '')),
              subtitle: sanitizeHtml(fixBrokenHtmlTags(slide.subtitle || '')),
              cta,
            };
          })
          .filter((slide: HeroV2Slide) => slide.title);
        if (slides.length === 0) {
          return { slides: FALLBACK_SLIDES, isFallback: true };
        }
        return { slides, isFallback: false };
      } catch {
        return { slides: FALLBACK_SLIDES, isFallback: true };
      }
    },
  });
}

// ---- Berita (teaser landing) ----

export function useNewsTeaser(limit = 3) {
  return useQuery({
    queryKey: ['v2', 'news-teaser', limit],
    staleTime: STALE_TIME,
    queryFn: async (): Promise<Record<string, any>[]> => {
      try {
        const response = await newsService.getAll();
        if (response.error || !Array.isArray(response.data)) {
          return [];
        }
        return response.data.slice(0, limit);
      } catch {
        return [];
      }
    },
  });
}

// ---- Pin globe ----

export interface V2Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  route: string;
}

/** Pin kurasi (lokasi riil) saat data API tidak menyediakan koordinat. */
export const FALLBACK_PINS: V2Pin[] = [
  { id: 'sangiran', lat: -7.4475833, lng: 110.8541944, label: 'Museum Sangiran - Manyarejo', route: '/v2/museums' },
  { id: 'cetho', lat: -7.5947222, lng: 111.1572222, label: 'Candi Cetho', route: '/v2/heritage' },
  { id: 'singosari', lat: -7.8884444, lng: 112.6641111, label: 'Candi Singosari', route: '/v2/heritage' },
  { id: 'kyai-mojo', lat: 1.2588333, lng: 124.9080556, label: 'Makam Kyai Mojo', route: '/v2/heritage' },
  { id: 'batujaya', lat: -6.0125833, lng: 107.1538611, label: 'Percandian Batujaya', route: '/v2/heritage' },
  { id: 'duurstede', lat: -3.5772222, lng: 128.6630556, label: 'Benteng Duurstede', route: '/v2/heritage' },
  { id: 'kebangkitan', lat: -6.1787182, lng: 106.8380344, label: 'Museum Kebangkitan Nasional', route: '/v2/museums' },
  { id: 'raja-talo', lat: -5.1028762, lng: 119.4455574, label: 'Makam Raja-Raja Talo', route: '/v2/heritage' },
  { id: 'batik', lat: -6.3023401, lng: 106.8953111, label: 'Museum Batik Indonesia', route: '/v2/museums' },
  { id: 'dieng', lat: -7.2062222, lng: 109.9076667, label: 'Kawasan Percandian Dieng', route: '/v2/heritage' },
  { id: 'gedong-songo', lat: -7.2105556, lng: 110.3416667, label: 'Kawasan Percandian Gedong Songo', route: '/v2/heritage' },
  { id: 'marlborough', lat: -3.7869972, lng: 102.2517411, label: 'Benteng Marlborough', route: '/v2/heritage' },
];

/** Menyusun pin globe dari data heritage + museum yang punya koordinat. */
export function buildPins(
  heritages: Record<string, any>[],
  museums: Record<string, any>[],
): V2Pin[] {
  const fromItems = (items: Record<string, any>[], routePrefix: string): V2Pin[] =>
    items
      .filter((s) => s.latitude != null && s.longitude != null && s.id != null)
      .map((s) => ({
        id: String(s.id),
        lat: Number(s.latitude),
        lng: Number(s.longitude),
        label: String(s.title || s.name || 'Situs'),
        route: `${routePrefix}/${s.id}`,
      }))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));

  const pins = [
    ...fromItems(heritages, '/v2/heritage'),
    ...fromItems(museums, '/v2/museum'),
  ];
  return pins.length > 0 ? pins.slice(0, 40) : FALLBACK_PINS;
}
