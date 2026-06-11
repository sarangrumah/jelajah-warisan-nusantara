import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { TiltCard } from '@/components/motion/TiltCard';
import { getSiteImage } from '@/lib/v2/site-images';
import { htmlToText, truncate } from '@/lib/v2/fixHtml';

interface SiteCardProps {
  item: Record<string, any>;
  to: string;
  index?: number;
}

/** Kartu situs/museum sinematik: tilt 3D + reveal stagger saat masuk viewport. */
export function SiteCard({ item, to, index = 0 }: SiteCardProps) {
  const title = htmlToText(item.title || item.name || '') || 'Situs Warisan';
  const description = truncate(
    htmlToText(item.subtitle || item.description || item.full_description || ''),
    130,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link to={to} className="block h-full group">
        <TiltCard className="h-full rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-primary/50 transition-colors">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={getSiteImage(item)}
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
            )}
            <div className="space-y-1.5 text-xs text-muted-foreground/80">
              {item.location && (
                <div className="flex items-start gap-1.5">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-primary/70" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
              )}
              {item.period && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="shrink-0 text-primary/70" />
                  <span>{item.period}</span>
                </div>
              )}
            </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
}

export default SiteCard;
