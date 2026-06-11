import { motion } from 'framer-motion';

interface SectionHeadingProps {
  kicker: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Judul section bergaya dokumenter: kicker emas + judul display + garis hias. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${centered ? 'text-center' : ''} ${className}`}
    >
      <p className="v2-kicker mb-3">{kicker}</p>
      <h2 className="text-3xl md:text-5xl v2-display text-heritage-gradient mb-4">{title}</h2>
      <div className={`v2-rule w-24 mb-5 ${centered ? 'mx-auto' : ''}`} />
      {description && (
        <p className={`text-muted-foreground leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;
