import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Ticket, Globe, Phone } from 'lucide-react';
import { HeroParallax } from '@/components/motion/HeroParallax';
import { getSiteImage } from '@/lib/v2/site-images';
import { htmlToText } from '@/lib/v2/fixHtml';
import type { SitesResult } from '@/lib/v2/useSites';
import BatikBackdrop from './BatikBackdrop';
import SafeHtml from './SafeHtml';
import SiteCard from './SiteCard';
import V2GalleryCollection from './V2GalleryCollection';

const LIST_PATH = '/v2/museums';
const LIST_LABEL = 'Kembali ke Museum';
const DETAIL_PREFIX = '/v2/museum';
const KICKER = 'Museum';

const sidebarReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

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

function OpeningHours({ value }: { value: unknown }) {
  if (Array.isArray(value) && value.length > 0) {
    const rows = value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const day = Object.keys(entry as Record<string, unknown>)[0];
        const hours = (entry as Record<string, unknown>)[day];
        if (!day) return null;
        return { day, hours: String(hours ?? '') };
      })
      .filter((r): r is { day: string; hours: string } => r !== null);

    if (rows.length === 0) return null;

    return (
      <div className="flex items-start gap-3">
        <Clock size={17} className="mt-0.5 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Jam Buka</p>
          <ul className="space-y-0.5 text-sm text-foreground/85">
            {rows.map((r, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="text-foreground/70">{r.day}</span>
                <span className="text-right">{r.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return <InfoRow icon={Clock} label="Jam Buka" value={value} />;
  }

  if (value && typeof value === 'object' && 'days_hours' in value) {
    const dh = (value as Record<string, unknown>).days_hours;
    if (typeof dh === 'string' && dh.trim() !== '') {
      return <InfoRow icon={Clock} label="Jam Buka" value={dh} />;
    }
  }

  return null;
}

interface MuseumDetailProps {
  query: { data?: SitesResult; isLoading: boolean };
}

export function MuseumDetail({ query }: MuseumDetailProps) {
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
          Museum ini belum tersedia
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Data dengan ID "{id}" tidak ditemukan. Silakan kembali dan jelajahi museum lainnya.
        </p>
        <Link
          to={LIST_PATH}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          {LIST_LABEL}
        </Link>
      </div>
    );
  }

  const title = htmlToText(item.title || item.name || '') || 'Museum';
  const subtitle = htmlToText(item.subtitle || '');
  const description =
    item.full_description || item.description || item.desc || '<p>Deskripsi belum tersedia.</p>';

  const address = htmlToText(item.address || '') || item.location || '';
  const phone = htmlToText(item.phone || item.contact_info?.phone || '');
  const website = htmlToText(item.website || '');
  const ticketPrice = htmlToText(item.ticket_price || item.visit_info?.ticketPrice || '');
  const openingHoursValue = item.opening_hours ?? item.visit_info?.openHours;

  const facilities: string[] = (() => {
    if (Array.isArray(item.facilities)) {
      return item.facilities.filter((f): f is string => typeof f === 'string' && f.trim() !== '');
    }
    if (typeof item.facilities === 'string') {
      return item.facilities
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
    }
    return [];
  })();

  const related = items.filter((s) => String(s.id) !== String(id)).slice(0, 3);

  const openExternal = (rawUrl: string) => {
    if (!rawUrl) return;
    const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openMaps = () => {
    if (item.latitude && item.longitude) {
      openExternal(
        `https://www.google.com/maps?q=${encodeURIComponent(`${item.latitude},${item.longitude}`)}`,
      );
    } else if (address) {
      openExternal(`https://www.google.com/maps/search/${encodeURIComponent(address)}`);
    }
  };

  const handleBuyTicket = () => {
    const ticketUrl = typeof item.ticket_url === 'string' ? item.ticket_url.trim() : '';
    if (ticketUrl) {
      openExternal(ticketUrl);
    } else {
      openExternal('https://wa.me/6281295953929');
    }
  };

  const museumName = String(item.name || item.title || '');

  return (
    <div>
      <HeroParallax
        image={getSiteImage(item)}
        title={title}
        subtitle={subtitle || undefined}
        overlayClassName="bg-background/55"
      >
        <Link
          to={LIST_PATH}
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          {LIST_LABEL}
        </Link>
      </HeroParallax>

      <section className="relative">
        <BatikBackdrop variant="megamendung" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2 space-y-14">
              <div>
                <motion.div {...sidebarReveal}>
                  <p className="v2-kicker mb-3">{KICKER}</p>
                  <h2 className="text-2xl md:text-4xl v2-display text-heritage-gradient mb-4">
                    Tentang {title}
                  </h2>
                  <div className="v2-rule w-24 mb-8" />
                </motion.div>
                <SafeHtml html={description} className="v2-prose" />
              </div>

              <div>
                <motion.div {...sidebarReveal}>
                  <p className="v2-kicker mb-3">Galeri Koleksi</p>
                  <h3 className="text-xl md:text-3xl v2-display text-heritage-gradient mb-4">
                    Kepingan Sejarah dalam Bingkai
                  </h3>
                  <div className="v2-rule w-24 mb-8" />
                </motion.div>
                <V2GalleryCollection museumName={museumName} />
              </div>
            </div>

            <aside className="space-y-6">
              <motion.div
                {...sidebarReveal}
                className="rounded-2xl bg-card/80 border border-border/60 p-6 backdrop-blur-sm"
              >
                <p className="v2-kicker mb-5">Informasi Kunjungan</p>
                <div className="space-y-5">
                  {address && <InfoRow icon={MapPin} label="Lokasi" value={address} />}
                  <OpeningHours value={openingHoursValue} />
                  {phone && <InfoRow icon={Phone} label="Kontak" value={phone} />}
                  {website && <InfoRow icon={Globe} label="Website" value={website} />}
                  {ticketPrice && <InfoRow icon={Ticket} label="Tiket" value={ticketPrice} />}
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
                {website && (
                  <button
                    onClick={() => openExternal(website)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <Globe size={16} />
                    Kunjungi Situs Web
                  </button>
                )}
                <button
                  onClick={handleBuyTicket}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
                >
                  <Ticket size={16} />
                  Beli Tiket
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
            Museum yang Menanti
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {related.map((r, i) => (
              <SiteCard key={r.id ?? i} item={r} to={`${DETAIL_PREFIX}/${r.id}`} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MuseumDetail;
