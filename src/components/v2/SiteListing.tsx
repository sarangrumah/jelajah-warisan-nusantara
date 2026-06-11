import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import { HeroParallax } from '@/components/motion/HeroParallax';
import { CultureMarquee } from '@/components/motion/CultureMarquee';
import { useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { htmlToText } from '@/lib/v2/fixHtml';
import { useSiteCategories, type SitesResult } from '@/lib/v2/useSites';
import BatikBackdrop from './BatikBackdrop';
import SectionHeading from './SectionHeading';
import SiteCard from './SiteCard';

export interface SiteListingConfig {
  kind: 'heritage' | 'museum';
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  kicker: string;
  listTitle: string;
  listDescription: string;
  detailPrefix: string;
  batikVariant: 'kawung' | 'megamendung';
  marqueeItems: string[];
  crossLink: { label: string; to: string };
}

interface SiteListingProps {
  config: SiteListingConfig;
  query: { data?: SitesResult; isLoading: boolean };
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border/60 animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

/** Halaman listing sinematik bersama untuk Cagar Budaya & Museum (/v2). */
export function SiteListing({ config, query }: SiteListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const items = query.data?.items ?? [];
  const isFallback = query.data?.isFallback ?? false;

  const { translatedContent } = useTranslationSystem(items, `v2-${config.kind}-list`);
  const displayItems: Record<string, any>[] = translatedContent || items;

  const { data: categories = [] } = useSiteCategories(
    config.kind === 'heritage' ? 'cagar budaya' : 'museum',
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return displayItems.filter((item) => {
      const title = htmlToText(item.title || item.name || '').toLowerCase();
      const subtitle = htmlToText(item.subtitle || '').toLowerCase();
      const matchesSearch = !term || title.includes(term) || subtitle.includes(term);
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayItems, searchTerm, filterCategory]);

  return (
    <div>
      <HeroParallax
        image={config.heroImage}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        overlayClassName="bg-background/60"
      />

      <section className="relative">
        <BatikBackdrop variant={config.batikVariant} />
        <div className="relative container mx-auto px-4 pt-20 pb-8">
          <SectionHeading
            kicker={config.kicker}
            title={config.listTitle}
            description={config.listDescription}
          />

          <div className="flex flex-col md:flex-row gap-4 mt-10 mb-12">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Cari nama atau deskripsi…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/60 border-border/60 focus-visible:ring-primary"
              />
            </div>
            {categories.length > 0 && (
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-56 bg-card/60 border-border/60">
                  <Filter size={16} className="mr-2 text-primary/70" />
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category: Record<string, any>) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {isFallback && (
            <p className="text-xs text-muted-foreground/70 mb-6">
              Menampilkan data kurasi offline — server konten tidak terjangkau.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {query.isLoading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : filtered.map((item, i) => (
                  <SiteCard
                    key={item.id ?? i}
                    item={item}
                    to={`${config.detailPrefix}/${item.id}`}
                    index={i}
                  />
                ))}
          </div>

          {!query.isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Tidak ada hasil yang cocok dengan pencarian.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-24 mb-8">
        <CultureMarquee items={config.marqueeItems} />
        <div className="container mx-auto px-4 mt-16 text-center">
          <Link
            to={config.crossLink.to}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-primary text-primary-foreground font-semibold text-lg heritage-glow hover:bg-primary/90 transition-colors"
          >
            {config.crossLink.label}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default SiteListing;
