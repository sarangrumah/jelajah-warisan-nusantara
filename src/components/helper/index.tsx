const heroImages = import.meta.glob('@/assets/images/*', { eager: true });

export function getImageUrl(filename: string) {
  const match = Object.entries(heroImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as any).default : filename;
}
export const mapSlidesWithImageUrl = (slidesArr: any[]) =>
  slidesArr.map(slide => ({
    ...slide,
    image: getImageUrl(slide.image?.split('/').pop() || slide.image),
  }));