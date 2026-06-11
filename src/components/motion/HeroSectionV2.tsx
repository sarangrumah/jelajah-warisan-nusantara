import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroV2Slide {
  image: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href?: string }[];
}

interface HeroSectionV2Props {
  slides: HeroV2Slide[];
  autoplayMs?: number;
  className?: string;
  showControls?: boolean;
}

const slideVariants = {
  enter: { opacity: 0, scale: 1.08 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.8, ease: [0.4, 0, 1, 1] as const },
  },
};

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
};

const textItem = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSectionV2({
  slides,
  autoplayMs = 6000,
  className = '',
  showControls = true,
}: HeroSectionV2Props) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1 || autoplayMs <= 0) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), autoplayMs);
    return () => clearInterval(t);
  }, [slides.length, autoplayMs]);

  if (slides.length === 0) return null;
  const slide = slides[current];

  return (
    <section className={`relative h-screen overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.18, x: -25 }}
            animate={reduce ? { scale: 1.05, x: 0 } : { scale: 1, x: 0 }}
            transition={{ duration: 9, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/95 via-background/55 to-primary/20 mix-blend-multiply" />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 30% 70%, hsl(175 84% 35% / 0.4), transparent 60%)',
            }}
            animate={reduce ? {} : { opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div
          key={`${current}-text`}
          variants={textContainer}
          initial="hidden"
          animate="show"
          className="container mx-auto px-4 text-center max-w-4xl"
        >
          <motion.h1
            variants={textItem}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-heritage-gradient leading-[1.1]"
            dangerouslySetInnerHTML={{ __html: slide.title }}
          />
          {slide.subtitle && (
            <motion.p
              variants={textItem}
              className="text-lg md:text-2xl mb-8 text-foreground/85 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: slide.subtitle }}
            />
          )}
          {slide.cta && slide.cta.length > 0 && (
            <motion.div variants={textItem} className="flex flex-col sm:flex-row gap-4 justify-center">
              {slide.cta.map((c, i) => (
                <a
                  key={i}
                  href={c.href ?? '#'}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  {c.label}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-background/20 backdrop-blur-md border border-border/30 rounded-full p-3 hover:bg-background/40 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % slides.length)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-background/20 backdrop-blur-md border border-border/30 rounded-full p-3 hover:bg-background/40 transition"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-foreground" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'w-12 bg-primary heritage-glow' : 'w-3 bg-foreground/30 hover:bg-foreground/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HeroSectionV2;
