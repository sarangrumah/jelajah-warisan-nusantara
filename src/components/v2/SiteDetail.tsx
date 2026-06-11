import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Ticket, Sun, Globe, Phone } from 'lucide-react';
import { HeroParallax } from '@/components/motion/HeroParallax';
import { getSiteImage } from '@/lib/v2/site-images';
import { htmlToText } from '@/lib/v2/fixHtml';
import type { SitesResult } from '@/lib/v2/useSites';
import BatikBackdrop from './BatikBackdrop';
import SafeHtml from './SafeHtml';
import SiteCard from './SiteCard';

export interface SiteDetailConfig {
  kind: 'heritage' | 'museum';
  listPath: string;
  listLabel: string;
  detailPrefix: string;
  kicker: string;
  batikVariant: 'kawung' | 'megamendung';
}

interface SiteDetailProps {
  config: SiteDetailConfig;
  query: { data?: SitesResult; isLoading: boolean };
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={17} className="mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground/85">{value}</p>
      </div>
    </div>
  );
}

const sidebarReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

/** Halaman detail immersive bersama untuk Cagar Budaya & Museum (/v2). */
export function SiteDetail({ config, query }: SiteDetailProps) {
  const { id } = useParams();

  const items = query.data?.items ?? [];
  const item = items.find((s) => String(s.id) === String(id));

  if (query.isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-2 w-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground tracking-widest uppercase">Memuat kisah…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <p className="v2-kicker mb-3">Tidak Ditemukan</p>
        <h1 className="text-3xl md:text-5xl v2-display text-heritage-gradient mb-6">
          Kisah ini belum tersedia
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Data dengan ID "{id}" tidak ditemukan. Silakan kembali dan jelajahi kisah lainnya.
        </p>
        <Link
          to={config.listPath}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          {config.listLabel}
        </Link>
      </div>
    );
  }

  const title = htmlToText(item.title || item.name || '') || 'Situs Warisan';
  const subtitle = htmlToText(item.subtitle || '');
  const openHours = item.visit_info?.openHours || item.opening_hours?.days_hours;
  const ticketPrice = item.visit_info?.ticketPrice || item.ticket_price;
  const bestTime = item.visit_info?.bestTime;
  const phone = item.contact_info?.phone;
  const facilities: string[] = Array.isArray(item.facilities) ? item.facilities : [];
  const collections: string[] = Array.isArray(item.collections) ? item.collections : [];
  const related = items.filter((s) => String(s.id) !== String(id)).slice(0, 3);

  const openMaps = () => {
    const url =
      item.latitude && item.longitude
        ? `https://www.google.com/maps?q=${encodeURIComponent(`${item.latitude},${item.longitude}`)}`
        : item.location
          ? `https://www.google.com/maps/search/${encodeURIComponent(item.location)}`
          : null;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/6281295953929', '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <HeroParallax
        image={getSiteImage(item)}
        title={title}
        subtitle={subtitle || undefined}
        overlayClassName="bg-background/55"
      >
        <Link
          to={config.listPath}
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          {config.listLabel}
        </Link>
      </HeroParallax>

      <section className="relative">
        <BatikBackdrop variant={config.batikVariant} />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2">
              <motion.div {...sidebarReveal}>
                <p className="v2-kicker mb-3">{config.kicker}</p>
                <h2 className="text-2xl md:text-4xl v2-display text-heritage-gradient mb-4">
                  Tentang {title}
                </h2>
                <div className="v2-rule w-24 mb-8" />
              </motion.div>
              <SafeHtml
                html={
                  item.full_description ||
                  item.description ||
                  item.desc ||
                  '<p>Deskripsi belum tersedia.</p>'
                }
                className="v2-prose"
              />
              {collections.length > 0 && (
                <div className="mt-10">
                  <p className="v2-kicker mb-4">Koleksi Unggulan</p>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs border border-accent/50 bg-accent/10 text-foreground/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <motion.div
                {...sidebarReveal}
                className="rounded-2xl bg-card/80 border border-border/60 p-6 backdrop-blur-sm"
              >
                <p className="v2-kicker mb-5">Rencanakan Kunjungan</p>
                <div className="space-y-5">
                  {item.location && <InfoRow icon={MapPin} label="Lokasi" value={item.location} />}
                  {item.period && <InfoRow icon={Sun} label="Periode" value={item.period} />}
                  {openHours && <InfoRow icon={Clock} label="Jam Buka" value={openHours} />}
                  {ticketPrice && <InfoRow icon={Ticket} label="Tiket" value={ticketPrice} />}
                  {bestTime && <InfoRow icon={Sun} label="Waktu Terbaik" value={bestTime} />}
                  {item.website && <InfoRow icon={Globe} label="Website" value={item.website} />}
                  {phone && <InfoRow icon={Phone} label="Kontak" value={phone} />}
                </div>
              </motion.div>

              {facilities.length > 0 && (
                <motion.div
                  {...sidebarReveal}
                  className="rounded-2xl bg-card/80 border border-border/60 p-6 backdrop-blur-sm"
                >
                  <p className="v2-kicker mb-4">Fasilitas</p>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs border border-primary/40 bg-primary/10 text-primary"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div {...sidebarReveal} className="flex flex-col gap-3">
                <button
                  onClick={openMaps}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-semibold heritage-glow hover:bg-primary/90 transition-colors"
                >
                  <MapPin size={16} />
                  Buka di Google Maps
                </button>
                <button
                  onClick={openWhatsApp}
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                >
                  Kontak Informasi
                </button>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container mx-auto px-4 pb-8">
          <p className="v2-kicker mb-3">Jelajah Lainnya</p>
          <h3 className="text-2xl md:text-3xl v2-display text-heritage-gradient mb-10">
            Kisah yang Menanti
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {related.map((r, i) => (
              <SiteCard key={r.id ?? i} item={r} to={`${config.detailPrefix}/${r.id}`} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default SiteDetail;
