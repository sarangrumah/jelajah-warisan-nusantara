import { optimizedTranslationService } from './optimized-translation-service';

class HybridTranslationService {
  private static instance: HybridTranslationService;

  static getInstance(): HybridTranslationService {
    if (!HybridTranslationService.instance) {
      HybridTranslationService.instance = new HybridTranslationService();
    }
    return HybridTranslationService.instance;
  }

  async translateText(params: { text: string; source: string; target: string }): Promise<string> {
    return optimizedTranslationService.translateText(params);
  }

  async translateMultipleTexts(params: { texts: string[]; source: string; target: string }): Promise<string[]> {
    const result = await optimizedTranslationService.translateBatch(params);
    return result.translations;
  }

  getCacheStats() {
    return { totalEntries: 0, languages: [] };
  }
}

export const hybridTranslationService = HybridTranslationService.getInstance();