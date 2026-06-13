import { getUploadedImageUrl } from '@/lib/asset-url';
import { cn } from '@/lib/utils';

type Ratio = 'hero' | 'card' | 'square' | 'detail' | 'auto';

const RATIO_CLASS: Record<Ratio, string> = {
  hero: 'aspect-[16/9]',
  card: 'aspect-[4/3]',
  square: 'aspect-square',
  detail: 'aspect-[16/9]',
  auto: '',
};

interface ResponsiveImageProps {
  /** Stored landscape image value (full url, /uploads/.., or bare filename). */
  landscape?: string;
  /** Stored portrait image value. */
  portrait?: string;
  /** Legacy single-image fallback when neither landscape nor portrait is set. */
  fallback?: string;
  alt: string;
  bucket?: string;
  /** Aspect-ratio wrapper preset (prevents stretching). Use 'auto' to opt out. */
  ratio?: Ratio;
  /** Tailwind object-fit for the <img>. */
  fit?: 'cover' | 'contain';
  className?: string;
  imgClassName?: string;
  /** Eager-load above-the-fold images (default lazy). */
  eager?: boolean;
}

/**
 * Renders a responsive image that prefers the portrait variant on mobile
 * (≤767px) and the landscape variant on larger screens, falling back to
 * whichever is available (and finally the legacy single image). Wrapped in a
 * fixed aspect-ratio box with object-cover so images never stretch.
 */
export const ResponsiveImage = ({
  landscape,
  portrait,
  fallback,
  alt,
  bucket,
  ratio = 'card',
  fit = 'cover',
  className,
  imgClassName,
  eager = false,
}: ResponsiveImageProps) => {
  const land = landscape || fallback || portrait;
  const port = portrait || landscape || fallback;

  const landUrl = land ? getUploadedImageUrl(land, bucket) : '/placeholder.svg';
  const portUrl = port ? getUploadedImageUrl(port, bucket) : landUrl;

  return (
    <div className={cn('relative overflow-hidden', RATIO_CLASS[ratio], className)}>
      <picture>
        {/* Mobile: prefer portrait */}
        <source media="(max-width: 767px)" srcSet={portUrl} />
        <img
          src={landUrl}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'w-full h-full',
            fit === 'cover' ? 'object-cover' : 'object-contain',
            'object-center',
            imgClassName
          )}
        />
      </picture>
    </div>
  );
};

export default ResponsiveImage;
