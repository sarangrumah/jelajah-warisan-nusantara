import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface HeroParallaxProps {
  image: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  overlayClassName?: string;
}

export function HeroParallax({
  image,
  title,
  subtitle,
  children,
  overlayClassName = 'bg-background/50',
}: HeroParallaxProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const yTitle = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const ySub = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);

  return (
    <section ref={ref} className="relative h-[90vh] md:h-screen overflow-hidden">
      <motion.img
        src={image}
        alt={title}
        style={
          reduceMotion
            ? { scale: 1.1 }
            : { y: yBg, scale: scaleBg }
        }
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 70%, hsl(175 84% 35% / 0.35), transparent 60%)',
        }}
      />
      <motion.div
        style={{ opacity: reduceMotion ? 1 : opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.h1
          style={reduceMotion ? {} : { y: yTitle }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-heritage-gradient leading-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            style={reduceMotion ? {} : { y: ySub }}
            className="text-lg md:text-2xl text-foreground/85 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </section>
  );
}

export default HeroParallax;
