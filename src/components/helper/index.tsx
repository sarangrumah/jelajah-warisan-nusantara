import { assetUrl } from '@/lib/asset-url';

/**
 * Map slides with image URLs using the same approach as HeroSection
 * This function processes an array of slides and transforms their image URLs
 * to work in both development and production environments
 */
export const mapSlidesWithImageUrl = (slidesArr: any[]) =>
  slidesArr.map(slide => {
    const originalPath = slide.image_url || slide.image || slide.img_banner;
    const transformedPath = (originalPath && originalPath !== 'null' && originalPath !== 'undefined')
      ? (assetUrl(originalPath) || '')
      : '';
    
    return {
      ...slide,
      asset: slide.image?.split('/').pop() || slide.image || slide.img_banner?.split('/').pop() || slide.img_banner,
      image: transformedPath,
      // Ensure image_url field is also set for compatibility
      image_url: transformedPath,
    };
  });

/**
 * Get image URL with fallback
 */
export const getImageUrl = (filename: string) => (filename && filename !== 'null' && filename !== 'undefined') ? (assetUrl(filename) || '') : '';