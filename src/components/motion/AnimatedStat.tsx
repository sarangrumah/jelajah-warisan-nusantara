import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedStat({
  value,
  label,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(reduceMotion ? value : 0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString('id-ID'),
  );

  useEffect(() => {
    if (inView && !reduceMotion) {
      const controls = animate(count, value, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, value, duration, count, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center ${className}`}
    >
      <div className="text-5xl md:text-6xl font-bold text-heritage-gradient leading-tight">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </div>
      <p className="text-foreground/70 mt-2 text-sm md:text-base uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
}

export default AnimatedStat;
