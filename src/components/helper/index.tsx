/*
// Disabled due to missing images causing Vite errors
const heroImages = import.meta.glob('@/assets/images/*', { eager: true });

export function getImageUrl(filename: string) {
  return '/placeholder.svg'; // fallback to a placeholder image
}
*/
// Dummy export to prevent import errors in other files
export const mapSlidesWithImageUrl = (slidesArr: any[]) => slidesArr;

// Dummy export to prevent import errors in other files
export const getImageUrl = (_filename: string) => '/placeholder.svg';