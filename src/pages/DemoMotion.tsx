import { lazy, Suspense, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Map, Calendar, Building2, Sparkles, MousePointer2, ScrollText } from 'lucide-react';
import { TiltCard } from '@/components/motion/TiltCard';
import { AnimatedStat } from '@/components/motion/AnimatedStat';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { CultureMarquee } from '@/components/motion/CultureMarquee';
import { HeroParallax } from '@/components/motion/HeroParallax';
import { LenisProvider } from '@/components/motion/LenisProvider';
import { HeroSectionV2 } from '@/components/motion/HeroSectionV2';
import type { GlobePin } from '@/components/motion/IndonesiaGlobe';

const HeroParticles = lazy(() => import('@/components/motion/HeroParticles'));
const IndonesiaGlobe = lazy(() => import('@/components/motion/IndonesiaGlobe'));

// Real banner data fetched from live museumcagarbudaya.kemenbud.go.id API
const LIVE_HOST = 'https://museumcagarbudaya.kemenbud.go.id';

const DEMO_SLIDES = [
  {
    image: `${LIVE_HOST}/uploads/hero-sections/resize-borobudur-2-1.jpg`,
    title: 'Museum dan<br/>Cagar Budaya',
    subtitle:
      'Menjadi ruang jelajah warisan budaya dan sejarah yang bersifat kolaboratif, mendorong daya cipta dan pembangunan karakter berbudaya.',
    cta: [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Tonton Video', href: 'https://www.youtube.com/watch?v=jA2zk5smOeQ' },
    ],
  },
  {
    image: `${LIVE_HOST}/uploads/hero-sections/whatsapp-image-2025-11-27-at-14.25.52.jpeg`,
    title: 'Koleksi Bersejarah<br/>Nusantara',
    subtitle: 'Melindungi dan melestarikan koleksi museum sebagai warisan bangsa.',
    cta: [{ label: 'Lihat Koleksi', href: '/collection' }],
  },
  {
    image: `${LIVE_HOST}/uploads/hero-sections/resize-benteng-duurstede.jpg`,
    title: 'Cagar Budaya',
    subtitle:
      'Mengembangkan museum dan cagar budaya sebagai pusat edukasi, penelitian, dan rekreasi budaya.',
    cta: [{ label: 'Jelajah Cagar Budaya', href: '/heritage' }],
  },
];

// Real museum/heritage sites with coordinates from live API (selected for spread across Indonesia)
const DEMO_PINS: GlobePin[] = [
  { id: '4562a4b7', lat: -7.4475833, lng: 110.8541944, label: 'Museum Sangiran - Manyarejo' },
  { id: '06be1762', lat: -7.5947222, lng: 111.1572222, label: 'Candi Cetho' },
  { id: 'a1deb578', lat: -7.8884444, lng: 112.6641111, label: 'Candi Singosari' },
  { id: '33324faa', lat: 1.2588333, lng: 124.9080556, label: 'Makam Kyai Mojo' },
  { id: 'db7fd2ab', lat: -6.0125833, lng: 107.1538611, label: 'Percandian Batujaya' },
  { id: '7542bb03', lat: -3.5772222, lng: 128.6630556, label: 'Benteng Duurstede' },
  { id: '0d38c162', lat: -6.1787182, lng: 106.8380344, label: 'Museum Kebangkitan Nasional' },
  { id: '93941fad', lat: -5.1028762, lng: 119.4455574, label: 'Makam Raja-Raja Talo' },
  { id: '53f11d75', lat: -6.3023401, lng: 106.8953111, label: 'Museum Batik Indonesia' },
  { id: '0361d960', lat: -7.2062222, lng: 109.9076667, label: 'Kawasan Percandian Dieng' },
  { id: '46d0c796', lat: -7.2105556, lng: 110.3416667, label: 'Kawasan Percandian Gedong Songo' },
  { id: 'fcee855c', lat: -3.7869972, lng: 102.2517411, label: 'Benteng Marlborough' },
];

const SECTIONS = [
  { id: 'hero-v2', title: '1. Hero V2 — Ken Burns + Stagger', icon: Sparkles, tier: 1 },
  { id: 'tilt-cards', title: '2. Tilt Cards (3D Hover)', icon: MousePointer2, tier: 1 },
  { id: 'animated-stats', title: '3. Animated Stats (Count-Up)', icon: Building2, tier: 1 },
  { id: 'magnetic', title: '4. Magnetic Button', icon: MousePointer2, tier: 1 },
  { id: 'culture-marquee', title: '5. Culture Marquee (Scroll-Reactive)', icon: ScrollText, tier: 2 },
  { id: 'parallax', title: '6. Hero Parallax (Multi-Layer)', icon: Map, tier: 2 },
  { id: 'particles', title: '7. Particle Batik (3D)', icon: Sparkles, tier: 3 },
  { id: 'globe', title: '8. Globe Indonesia (3D Interactive)', icon: Landmark, tier: 3 },
];

function SectionLabel({ tier, children }: { tier: number; children: ReactNode }) {
  const colors = {
    1: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    2: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    3: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40',
  } as const;
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[tier as 1 | 2 | 3]}`}
        >
          Tier {tier}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-8 text-heritage-gradient">{children}</h2>
    </div>
  );
}

function StickyTOC() {
  return (
    <div className="hidden lg:block fixed top-1/2 -translate-y-1/2 right-6 z-40">
      <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-3 space-y-1 shadow-xl">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1">
          Navigasi
        </div>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground/70 hover:text-primary hover:bg-primary/10 transition"
          >
            <s.icon size={14} />
            <span className="truncate max-w-[180px]">{s.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

const DEMO_CARDS = [
  {
    title: 'Candi Cetho',
    desc: 'Candi peninggalan Majapahit di lereng Gunung Lawu, Karanganyar.',
    image: `${LIVE_HOST}/uploads/sites/resize-cetho.jpg`,
  },
  {
    title: 'Museum Batik Indonesia',
    desc: 'Pusat pelestarian dan pengembangan batik sebagai warisan dunia UNESCO.',
    image: `${LIVE_HOST}/uploads/sites/resize-museum-batik-17-2.jpg`,
  },
  {
    title: 'Percandian Dieng',
    desc: 'Kompleks candi Hindu tertua di Jawa, di dataran tinggi Dieng.',
    image: `${LIVE_HOST}/uploads/sites/candi-arjuna-dan-candi-semar.jpeg`,
  },
];

export default function DemoMotion() {
  const [activePin, setActivePin] = useState<GlobePin | null>(null);

  return (
    <LenisProvider>
      <div className="min-h-screen bg-background text-foreground">
        <StickyTOC />

        {/* Demo top intro */}
        <div className="container mx-auto px-4 pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="px-3 py-1 text-xs font-semibold rounded-full border border-primary/40 bg-primary/10 text-primary">
              Demo Route • /demo-motion
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-3 text-heritage-gradient">
              Showcase Motion & 3D
            </h1>
            <p className="text-foreground/70 text-base md:text-lg max-w-2xl">
              Halaman ini berisi semua komponen baru (Tier 1, 2, 3) yang akan diintegrasikan ke
              halaman publik. Scroll ke bawah untuk meng-eksplor satu per satu.
            </p>
          </motion.div>
        </div>

        {/* 1. HERO V2 */}
        <section id="hero-v2">
          <SectionLabel tier={1}>1. Hero V2 — Ken Burns + Stagger</SectionLabel>
          <HeroSectionV2 slides={DEMO_SLIDES} />
        </section>

        {/* 2. TILT CARDS */}
        <section id="tilt-cards">
          <SectionLabel tier={1}>2. Tilt Cards — 3D Hover Tracking</SectionLabel>
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-20">
            {DEMO_CARDS.map((c, i) => (
              <TiltCard
                key={i}
                className="rounded-2xl overflow-hidden bg-card border border-border/50"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-foreground/70 text-sm">{c.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 3. ANIMATED STATS */}
        <section id="animated-stats" className="bg-card/30 border-y border-border/30">
          <SectionLabel tier={1}>3. Animated Stats — Count-Up on Scroll</SectionLabel>
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 pb-20">
            <AnimatedStat value={528} label="Museum Terdaftar" suffix="+" />
            <AnimatedStat value={1842} label="Cagar Budaya Nasional" />
            <AnimatedStat value={140000} label="Koleksi Artefak" />
            <AnimatedStat value={34} label="Provinsi Tercakup" />
          </div>
        </section>

        {/* 4. MAGNETIC BUTTON */}
        <section id="magnetic">
          <SectionLabel tier={1}>4. Magnetic Button — Cursor Attraction</SectionLabel>
          <div className="container mx-auto px-4 flex flex-col items-center gap-6 pb-20">
            <p className="text-foreground/70 text-center max-w-md">
              Arahkan kursor ke tombol — tombol akan "tertarik" menuju kursor secara halus.
            </p>
            <MagneticButton className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-semibold text-lg heritage-glow">
              Jelajahi Sekarang
            </MagneticButton>
          </div>
        </section>

        {/* 5. CULTURE MARQUEE */}
        <section id="culture-marquee">
          <SectionLabel tier={2}>5. Culture Marquee — Scroll Velocity Reactive</SectionLabel>
          <p className="container mx-auto px-4 text-foreground/70 text-center mb-6">
            Scroll cepat ke atas atau ke bawah — kecepatan dan kemiringan teks akan bereaksi.
          </p>
          <CultureMarquee
            items={['BATIK', 'KERIS', 'CANDI', 'WAYANG', 'GAMELAN', 'TENUN', 'ANGKLUNG']}
          />
          <div className="h-32" />
        </section>

        {/* 6. HERO PARALLAX */}
        <section id="parallax">
          <SectionLabel tier={2}>6. Hero Parallax — Multi-Layer Depth</SectionLabel>
          <HeroParallax
            image={`${LIVE_HOST}/uploads/hero-sections/resize-borobudur-2-1.jpg`}
            title="Borobudur"
            subtitle="Scroll perlahan untuk merasakan kedalaman parallax"
          />
          <div className="h-32" />
        </section>

        {/* 7. HERO PARTICLES */}
        <section id="particles" className="bg-card/30 border-y border-border/30">
          <SectionLabel tier={3}>7. Particle Batik — WebGL 3D</SectionLabel>
          <div className="relative h-[500px] md:h-[600px] mx-auto max-w-6xl mb-20 rounded-2xl overflow-hidden border border-primary/30">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-card">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              }
            >
              <HeroParticles />
            </Suspense>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <h3 className="text-3xl md:text-5xl font-bold text-heritage-gradient mb-3">
                Cahaya Nusantara
              </h3>
              <p className="text-foreground/70 text-lg max-w-md">
                Gerakkan kursor di area ini — partikel akan merespons.
              </p>
            </div>
          </div>
        </section>

        {/* 8. INDONESIA GLOBE */}
        <section id="globe">
          <SectionLabel tier={3}>8. Globe Indonesia — Interactive Heritage Map</SectionLabel>
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-primary/30 bg-card/40">
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                }
              >
                <IndonesiaGlobe pins={DEMO_PINS} onPinClick={(p) => setActivePin(p)} />
              </Suspense>
            </div>
            <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Lokasi Aktif
              </p>
              {activePin ? (
                <motion.div
                  key={activePin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-2xl font-bold mb-2">{activePin.label}</h3>
                  <p className="text-foreground/60 text-sm">
                    Latitude: {activePin.lat.toFixed(2)}°
                  </p>
                  <p className="text-foreground/60 text-sm">
                    Longitude: {activePin.lng.toFixed(2)}°
                  </p>
                  <button className="mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:scale-105 transition">
                    Lihat Detail
                  </button>
                </motion.div>
              ) : (
                <p className="text-foreground/50 italic">
                  Klik salah satu titik di globe untuk melihat detail museum/cagar budaya.
                </p>
              )}
              <div className="mt-8 pt-6 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  Drag globe untuk memutar • Hover pin untuk preview • Klik pin untuk detail
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <section className="border-t border-border/30 py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Calendar className="mx-auto text-primary mb-4" size={32} />
            <h3 className="text-2xl font-bold mb-3">Selesai meng-eksplor?</h3>
            <p className="text-foreground/70 mb-6">
              Beri feedback komponen mana yang ingin di-tweak/dihilangkan, atau approve langsung
              untuk implementasi ke halaman publik (Beranda, Heritage, Museum, dll).
            </p>
          </div>
        </section>
      </div>
    </LenisProvider>
  );
}
