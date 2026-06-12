import { lazy, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper } from 'lucide-react';
import SEO from '@/components/SEO';
import { HeroSectionV2 } from '@/components/motion/HeroSectionV2';
import { AnimatedStat } from '@/components/motion/AnimatedStat';
import type { GlobePin } from '@/components/motion/IndonesiaGlobe';
import { useMuseumStats } from '@/hooks/useMuseumStats';
import BatikBackdrop from '@/components/v2/BatikBackdrop';
import SectionHeading from '@/components/v2/SectionHeading';
import SiteCard from '@/components/v2/SiteCard';
import Deferred3D from '@/components/v2/Deferred3D';
import V2IndonesiaSvgMap from '@/components/v2/V2IndonesiaSvgMap';
import {
  useHeroSlides,
  useHeritageSites,
  useMuseumSites,
  useNewsTeaser,
  buildPins,
  type V2Pin,
} from '@/lib/v2/useSites';
import { htmlToText, truncate } from '@/lib/v2/fixHtml';

const HeritageGlobe = lazy(() => import('@/components/v2/HeritageGlobe'));

function GlobeFallback({
  pins,
  activePinId,
  onPinClick,
}: {
  pins: V2Pin[];
  activePinId?: string | null;
  onPinClick?: (pin: V2Pin) => void;
}) {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden">
      <div className="absolute inset-0 v2-mist" />
      <V2IndonesiaSvgMap
        pins={pins}
        activePinId={activePinId ?? null}
        onPinClick={onPinClick}
        className="absolute inset-0 px-3 py-6 md:px-8 md:py-10"
      />
    </div>
  );
}

function PinPanel({ pin, onDetail }: { pin: V2Pin | null; onDetail: (pin: V2Pin) => void }) {
  return (
    <>
      <p className="v2-kicker mb-3">Lokasi Aktif</p>
      {pin ? (
        <motion.div
          key={pin.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl v2-display text-foreground mb-2">{pin.label}</h3>
          <p className="text-muted-foreground text-sm mb-5">
            {pin.lat.toFixed(2)}°, {pin.lng.toFixed(2)}°
          </p>
          <button
            onClick={() => onDetail(pin)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold heritage-glow hover:bg-primary/90 transition-colors"
          >
            Lihat Detail
            <ArrowRight size={15} />
          </button>
        </motion.div>
      ) : (
        <p className="text-muted-foreground/70 italic text-sm leading-relaxed">
          Klik salah satu titik emas di peta untuk melihat museum atau cagar budaya di lokasi
          tersebut. Drag untuk memutar.
        </p>
      )}
    </>
  );
}

export default function V2Landing() {
  const navigate = useNavigate();
  const stats = useMuseumStats();
  const { data: heroData } = useHeroSlides();
  const heritage = useHeritageSites();
  const museums = useMuseumSites();
  const { data: news = [] } = useNewsTeaser(3);
  const [activePin, setActivePin] = useState<V2Pin | null>(null);

  const pins = useMemo(
    () => buildPins(heritage.data?.items ?? [], museums.data?.items ?? []),
    [heritage.data, museums.data],
  );
  const pinById = useMemo(() => new Map(pins.map((p) => [String(p.id), p])), [pins]);
  const globePins: GlobePin[] = pins;

  const featured = useMemo(() => {
    const h = (heritage.data?.items ?? []).slice(0, 3).map((item) => ({
      item,
      to: `/v2/heritage/${item.id}`,
    }));
    const m = (museums.data?.items ?? []).slice(0, 3).map((item) => ({
      item,
      to: `/v2/museum/${item.id}`,
    }));
    return [...h, ...m];
  }, [heritage.data, museums.data]);

  return (
    <>
      <SEO
        title="Jelajah Warisan Nusantara — Preview V2"
        description="Pengalaman sinematik menjelajahi museum dan cagar budaya Indonesia."
        noindex
      />

      {/* 1 — Hero sinematik (Ken Burns + vignette emas) */}
      <div className="relative">
        {heroData?.slides && <HeroSectionV2 slides={heroData.slides} />}
        <div className="pointer-events-none absolute inset-0 z-[5] v2-vignette" />
      </div>

      {/* 2 — Manifesto */}
      <section className="relative">
        <BatikBackdrop />
        <div className="relative container mx-auto px-4 py-24 md:py-32 max-w-3xl text-center">
          <SectionHeading
            align="center"
            kicker="Sebuah Undangan"
            title="Warisan yang Tak Pernah Diam"
            description="Di balik setiap candi yang berdiri dan setiap kain yang ditenun, ada tangan-tangan yang menjaga ingatan bangsa. Jelajahi kisahnya — dari pesisir Bengkulu hingga dataran tinggi Dieng."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              to="/v2/heritage"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-primary text-primary-foreground font-semibold text-lg heritage-glow hover:bg-primary/90 transition-colors"
            >
              Mulai Menjelajah
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3 — Statistik */}
      <section className="border-y border-border/30 bg-card/30">
        <div className="container mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <AnimatedStat value={stats.museums} label="Museum Dikelola" suffix="+" />
          <AnimatedStat value={stats.sites} label="Cagar Budaya" suffix="+" />
          <AnimatedStat value={stats.provinces} label="Provinsi Tercakup" />
          <AnimatedStat value={stats.programs} label="Program Budaya" suffix="+" />
        </div>
      </section>

      {/* 4 — Peta warisan full-width (globe fokus Indonesia, garis pantai riil) */}
      <section className="relative border-b border-border/30 bg-card/20">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <SectionHeading
            align="center"
            kicker="Peta Warisan"
            title="Dari Sabang Sampai Merauke"
            description="Putar peta dan temukan museum serta cagar budaya yang tersebar di seluruh kepulauan."
          />
        </div>
        {/* data-lenis-prevent: scroll wheel di atas peta dipakai untuk zoom,
            bukan menggulir halaman */}
        <div className="relative w-full h-[60vh] md:h-[80vh]" data-lenis-prevent>
          <Deferred3D
            className="absolute inset-0"
            fallback={
              <GlobeFallback
                pins={pins}
                activePinId={activePin ? String(activePin.id) : null}
                onPinClick={(p) => setActivePin(p)}
              />
            }
          >
            <HeritageGlobe
              pins={globePins}
              onPinClick={(p) => setActivePin(pinById.get(String(p.id ?? p.label)) ?? null)}
            />
          </Deferred3D>
          {/* Tepian atas/bawah menyatu dengan latar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
          {/* Panel lokasi aktif — overlay di desktop */}
          <div className="hidden lg:block absolute left-10 bottom-10 w-80 rounded-3xl bg-card/80 border border-border/60 p-6 backdrop-blur-md shadow-deep">
            <PinPanel pin={activePin} onDetail={(p) => navigate(p.route)} />
          </div>
        </div>
        {/* Panel lokasi aktif — di bawah peta untuk layar kecil */}
        <div className="lg:hidden container mx-auto px-4 py-8">
          <div className="rounded-3xl bg-card/70 border border-border/60 p-6">
            <PinPanel pin={activePin} onDetail={(p) => navigate(p.route)} />
          </div>
        </div>
      </section>

      {/* 5 — Pilihan kurasi */}
      <section className="relative">
        <BatikBackdrop variant="megamendung" mist={false} />
        <div className="relative container mx-auto px-4 py-24">
          <SectionHeading
            kicker="Pilihan Kurator"
            title="Mulai dari Sini"
            description="Enam destinasi untuk membuka perjalananmu — tiga cagar budaya, tiga museum."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {featured.map(({ item, to }, i) => (
              <SiteCard key={`${to}`} item={item} to={to} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Teaser berita */}
      {news.length > 0 && (
        <section className="border-t border-border/30">
          <div className="container mx-auto px-4 py-20">
            <SectionHeading kicker="Kabar Terbaru" title="Dari Ruang Pelestarian" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {news.map((article: Record<string, any>, i: number) => (
                <motion.div
                  key={article.id ?? i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link
                    to={`/news/${article.id}`}
                    className="block h-full rounded-2xl bg-card/70 border border-border/60 p-6 hover:border-primary/50 transition-colors group"
                  >
                    <Newspaper size={18} className="text-primary mb-4" />
                    <h3 className="text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                      {truncate(htmlToText(article.title || ''), 80) || 'Berita'}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {truncate(htmlToText(article.excerpt || article.content || ''), 110)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
