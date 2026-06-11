import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';

interface CultureMarqueeProps {
  items: string[];
  baseVelocity?: number;
  className?: string;
}

export function CultureMarquee({
  items,
  baseVelocity = -2,
  className = '',
}: CultureMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], ['-12deg', '0deg', '12deg']);

  const wrap = (min: number, max: number, v: number) => {
    const range = max - min;
    const mod = (((v - min) % range) + range) % range;
    return mod + min;
  };

  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_t, delta) => {
    if (reduceMotion) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <motion.div
      style={{ skewX: reduceMotion ? 0 : skewX }}
      className={`overflow-hidden py-10 md:py-14 bg-primary/5 border-y border-primary/20 ${className}`}
    >
      <motion.div
        style={{ x }}
        className="flex gap-10 md:gap-16 whitespace-nowrap text-4xl md:text-7xl font-bold uppercase tracking-tight"
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-10 md:gap-16 text-foreground/40">
            {item}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default CultureMarquee;
