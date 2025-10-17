# Complete Translation Fix - Implementation Plan

## 🚨 Critical Issue: LibreTranslate Container Restarting

**Current Status:**
```bash
CONTAINER ID   IMAGE                           STATUS
65696d1972e1   libretranslate/libretranslate   Restarting (1) Less than a second ago
```

**This must be fixed first before proceeding with translations!**

---

## 📋 Implementation Steps

### Step 1: Fix LibreTranslate Docker Container ⚡ (CRITICAL)

**Check container logs:**
```bash
docker logs libretranslate --tail 100
```

**Common issues and fixes:**

1. **Memory Issue:**
```bash
# Stop and remove existing container
docker stop libretranslate
docker rm libretranslate

# Run with more memory
docker run -d \
  --name libretranslate \
  --restart unless-stopped \
  -p 5000:5000 \
  -e LT_LOAD_ONLY=en,id \
  --memory="2g" \
  libretranslate/libretranslate
```

2. **Port Conflict:**
```bash
# Check what's using port 5000
lsof -i :5000

# If backend is using it, change LibreTranslate port
docker run -d \
  --name libretranslate \
  --restart unless-stopped \
  -p 5001:5000 \
  -e LT_LOAD_ONLY=en,id \
  libretranslate/libretranslate

# Then update backend .env
LIBRETRANSLATE_URL=http://localhost:5001
```

3. **Model Loading Issue:**
```bash
# Use lighter models
docker run -d \
  --name libretranslate \
  --restart unless-stopped \
  -p 5000:5000 \
  -e LT_LOAD_ONLY=en,id \
  -e LT_SUGGESTIONS=false \
  -e LT_DISABLE_WEB_UI=false \
  libretranslate/libretranslate
```

**Verify it's working:**
```bash
# Wait 30 seconds for container to start
sleep 30

# Test translation
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Museum Nasional","source":"id","target":"en"}'
```

---

### Step 2: Fix All UI Translation Keys (2-3 hours)

**Files to update:**

1. **src/pages/Museum.tsx**
2. **src/pages/Heritage.tsx**
3. **src/pages/Sites.tsx**
4. **src/pages/Collection.tsx**
5. **src/pages/CollectionDetail.tsx**
6. **src/pages/SitesDetail.tsx**
7. **src/pages/HeritageDetail.tsx**
8. **src/pages/MuseumDetail.tsx**
9. **src/pages/EventDetail.tsx**
10. **src/pages/CompanyProfile.tsx**
11. **src/pages/MemoryOfWorld.tsx**
12. **src/pages/PemanfaatanAset.tsx**
13. **src/components/HeroSection.tsx**
14. **src/components/AgendaSection.tsx**
15. **src/components/ProfileSection.tsx**
16. **src/components/ManagementSection.tsx**
17. **src/components/ppid/PPIDSection.tsx**
18. **src/components/about/Services.tsx**
19. **src/components/about/RulesAndSOP.tsx**

**Changes needed:**
- Replace hardcoded text with `t()` function
- Fix incorrect translation key usage
- Use standardized key naming convention

---

### Step 3: Add All Missing UI Translations to Database (1-2 hours)

**Create comprehensive translation migration script:**

```typescript
// backend/src/scripts/add-all-ui-translations.ts

const allTranslations = {
  // Museum Page
  'museum.pageTitle': 'Museum dan Cagar Budaya',
  'museum.search.placeholder': 'Cari museum berdasarkan nama atau lokasi...',
  'museum.filter.type': 'Filter berdasarkan tipe',
  'museum.filter.all': 'Semua Tipe',
  'museum.card.buyTicket': 'Beli Tiket',
  'museum.card.visitMuseum': 'Kunjungi Museum',
  
  // Heritage Page
  'heritage.pageTitle': 'Warisan Budaya Indonesia',
  'heritage.search.placeholder': 'Cari warisan budaya...',
  'heritage.filter.category': 'Filter berdasarkan kategori',
  'heritage.filter.location': 'Filter berdasarkan lokasi',
  
  // Sites Page
  'sites.pageTitle': 'Situs Bersejarah',
  'sites.search.placeholder': 'Cari situs bersejarah...',
  'sites.filter.type': 'Filter berdasarkan tipe',
  
  // Collection Page
  'collection.pageTitle': 'Koleksi Museum',
  'collection.search.placeholder': 'Cari koleksi...',
  'collection.filter.museum': 'Filter berdasarkan museum',
  'collection.filter.category': 'Filter berdasarkan kategori',
  
  // Event/Agenda Page
  'event.pageTitle': 'Agenda & Kegiatan',
  'event.search.placeholder': 'Cari agenda atau kegiatan...',
  'event.filter.category': 'Filter berdasarkan kategori',
  'event.filter.date': 'Filter berdasarkan tanggal',
  'event.card.register': 'Daftar Sekarang',
  'event.card.viewDetails': 'Lihat Detail',
  
  // Memory of World Page
  'memory.pageTitle': 'Memory of the World',
  'memory.search.placeholder': 'Cari dokumen warisan...',
  'memory.description': 'Program UNESCO untuk pelestarian warisan dokumenter',
  
  // Asset Utilization Page
  'asset.pageTitle': 'Pemanfaatan Aset',
  'asset.search.placeholder': 'Cari aset...',
  'asset.description': 'Informasi pemanfaatan aset cagar budaya',
  
  // Common UI Elements
  'common.all': 'Semua',
  'common.search': 'Cari',
  'common.filter': 'Filter',
  'common.sort': 'Urutkan',
  'common.noResults': 'Tidak ada hasil ditemukan. Coba sesuaikan pencarian atau filter Anda.',
  'common.loading': 'Memuat...',
  'common.error': 'Terjadi kesalahan',
  'common.tryAgain': 'Coba Lagi',
  'common.viewDetails': 'Lihat Detail',
  'common.readMore': 'Baca Selengkapnya',
  'common.back': 'Kembali',
  'common.next': 'Selanjutnya',
  'common.previous': 'Sebelumnya',
  'common.showMore': 'Tampilkan Lebih Banyak',
  'common.showLess': 'Tampilkan Lebih Sedikit',
  
  // Buttons
  'buttons.submit': 'Kirim',
  'buttons.cancel': 'Batal',
  'buttons.save': 'Simpan',
  'buttons.delete': 'Hapus',
  'buttons.edit': 'Edit',
  'buttons.add': 'Tambah',
  'buttons.close': 'Tutup',
  'buttons.confirm': 'Konfirmasi',
  'buttons.download': 'Unduh',
  'buttons.upload': 'Unggah',
  'buttons.share': 'Bagikan',
  'buttons.print': 'Cetak',
  
  // Filters
  'filter.sortBy': 'Urutkan Berdasarkan',
  'filter.sortBy.newest': 'Terbaru',
  'filter.sortBy.oldest': 'Terlama',
  'filter.sortBy.nameAZ': 'Nama (A-Z)',
  'filter.sortBy.nameZA': 'Nama (Z-A)',
  'filter.sortBy.popular': 'Terpopuler',
  
  // Date/Time
  'date.today': 'Hari Ini',
  'date.yesterday': 'Kemarin',
  'date.tomorrow': 'Besok',
  'date.thisWeek': 'Minggu Ini',
  'date.thisMonth': 'Bulan Ini',
  'date.thisYear': 'Tahun Ini',
  
  // Status
  'status.active': 'Aktif',
  'status.inactive': 'Tidak Aktif',
  'status.pending': 'Menunggu',
  'status.approved': 'Disetujui',
  'status.rejected': 'Ditolak',
  'status.published': 'Dipublikasikan',
  'status.draft': 'Draft',
  
  // Validation Messages
  'validation.required': 'Field ini wajib diisi',
  'validation.email': 'Email tidak valid',
  'validation.phone': 'Nomor telepon tidak valid',
  'validation.minLength': 'Minimal {min} karakter',
  'validation.maxLength': 'Maksimal {max} karakter',
  'validation.passwordMatch': 'Password tidak cocok',
  
  // Success Messages
  'success.saved': 'Data berhasil disimpan',
  'success.deleted': 'Data berhasil dihapus',
  'success.updated': 'Data berhasil diperbarui',
  'success.submitted': 'Data berhasil dikirim',
  
  // Error Messages
  'error.general': 'Terjadi kesalahan. Silakan coba lagi.',
  'error.network': 'Koneksi jaringan bermasalah',
  'error.notFound': 'Data tidak ditemukan',
  'error.unauthorized': 'Anda tidak memiliki akses',
  'error.serverError': 'Kesalahan server. Silakan coba lagi nanti.',
};
```

**Run migration:**
```bash
cd backend
npm run add:all-ui-translations
```

---

### Step 4: Implement API Content Translation (4-5 hours)

**Approach: Translate content in API response (as requested)**

**Update backend services to translate content:**

```typescript
// backend/src/services/contentTranslationService.ts

import translationService from './translationService';

interface TranslatableFields {
  [key: string]: string;
}

class ContentTranslationService {
  /**
   * Translate content fields in API response
   */
  async translateContent(
    content: any,
    fieldsToTranslate: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<any> {
    // If target language is same as source, return original
    if (targetLang === sourceLang) {
      return content;
    }

    const translatedContent = { ...content };

    // Translate each specified field
    for (const field of fieldsToTranslate) {
      if (content[field] && typeof content[field] === 'string') {
        const result = await translationService.translate(
          content[field],
          targetLang,
          sourceLang
        );
        
        if (result.success) {
          translatedContent[field] = result.translatedText;
        }
      }
    }

    return translatedContent;
  }

  /**
   * Translate array of content items
   */
  async translateContentArray(
    items: any[],
    fieldsToTranslate: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<any[]> {
    const translatedItems = [];

    for (const item of items) {
      const translated = await this.translateContent(
        item,
        fieldsToTranslate,
        targetLang,
        sourceLang
      );
      translatedItems.push(translated);
    }

    return translatedItems;
  }
}

export const contentTranslationService = new ContentTranslationService();
export default contentTranslationService;
```

**Update API controllers to use translation:**

```typescript
// backend/src/controllers/museumController.ts

import contentTranslationService from '../services/contentTranslationService';

export const getAllMuseums = async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as string || 'id';
    
    // Get museums from database
    const result = await pool.query(
      'SELECT * FROM tb_sites WHERE type = $1 AND is_active = true',
      [museumTypeId]
    );

    let museums = result.rows;

    // Translate if not Indonesian
    if (lang !== 'id') {
      museums = await contentTranslationService.translateContentArray(
        museums,
        ['name', 'subtitle', 'description', 'address'],
        lang,
        'id'
      );
    }

    res.json(museums);
  } catch (error) {
    console.error('Error fetching museums:', error);
    res.status(500).json({ error: 'Failed to fetch museums' });
  }
};
```

**Update all API endpoints:**
- Museums API
- News/Media API
- Events/Agenda API
- Collections API
- Heritage Sites API
- FAQs API
- Banners API

---

### Step 5: Update Frontend to Pass Language Parameter (1-2 hours)

**Update API client to include language:**

```typescript
// src/lib/api-client.ts

import i18n from '@/i18n/index-dynamic';

const apiClient = {
  get: async (endpoint: string, options = {}) => {
    const lang = i18n.language || 'id';
    const url = new URL(endpoint, window.location.origin);
    url.searchParams.append('lang', lang);
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Accept-Language': lang,
        ...options.headers,
      },
    });
    
    return response.json();
  },
  // ... other methods
};
```

**Update components to re-fetch on language change:**

```typescript
// src/pages/Museum.tsx

const Museum = () => {
  const { t, i18n } = useTranslation();
  const [museums, setMuseums] = useState([]);

  const fetchMuseums = async () => {
    const response = await museumService.getAll();
    setMuseums(response.data);
  };

  useEffect(() => {
    fetchMuseums();
  }, [i18n.language]); // Re-fetch when language changes
};
```

---

### Step 6: Add Caching for Translated Content (1 hour)

**Implement Redis caching to avoid re-translating:**

```typescript
// backend/src/services/translationCacheService.ts

import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

class TranslationCacheService {
  private getCacheKey(text: string, targetLang: string, sourceLang: string): string {
    return `translation:${sourceLang}:${targetLang}:${text}`;
  }

  async get(text: string, targetLang: string, sourceLang: string): Promise<string | null> {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    return await redis.get(key);
  }

  async set(text: string, targetLang: string, sourceLang: string, translation: string): Promise<void> {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    // Cache for 7 days
    await redis.setex(key, 7 * 24 * 60 * 60, translation);
  }
}

export const translationCacheService = new TranslationCacheService();
```

**Update translation service to use cache:**

```typescript
async translate(text: string, targetLang: string, sourceLang: string = 'id'): Promise<TranslationResult> {
  // Check cache first
  const cached = await translationCacheService.get(text, targetLang, sourceLang);
  if (cached) {
    return { translatedText: cached, success: true };
  }

  // Translate
  const result = await this.translateWithLibre(text, targetLang, sourceLang);

  // Cache result
  if (result.success) {
    await translationCacheService.set(text, targetLang, sourceLang, result.translatedText);
  }

  return result;
}
```

---

### Step 7: Testing & Verification (2-3 hours)

**Test checklist:**

1. **LibreTranslate Service:**
   - [ ] Container running without restarts
   - [ ] Translation API responding
   - [ ] Translation quality acceptable

2. **UI Translations:**
   - [ ] All pages display correct translation keys
   - [ ] No hardcoded Indonesian text in English mode
   - [ ] No hardcoded English text in Indonesian mode
   - [ ] Language switcher works on all pages

3. **Content Translations:**
   - [ ] Museum names translate
   - [ ] Museum descriptions translate
   - [ ] News articles translate
   - [ ] Event information translates
   - [ ] FAQ content translates

4. **API Endpoints:**
   - [ ] `/api/museums?lang=id` returns Indonesian
   - [ ] `/api/museums?lang=en` returns English
   - [ ] All endpoints support lang parameter
   - [ ] Translation caching works

5. **Performance:**
   - [ ] Page load times acceptable
   - [ ] Translation doesn't slow down API
   - [ ] Cache reduces translation calls

---

## 📊 Implementation Timeline

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Fix LibreTranslate Docker | 30 min | ⏳ Pending |
| 2 | Fix UI Translation Keys | 2-3 hours | ⏳ Pending |
| 3 | Add Missing UI Translations | 1-2 hours | ⏳ Pending |
| 4 | Implement API Content Translation | 4-5 hours | ⏳ Pending |
| 5 | Update Frontend Language Handling | 1-2 hours | ⏳ Pending |
| 6 | Add Translation Caching | 1 hour | ⏳ Pending |
| 7 | Testing & Verification | 2-3 hours | ⏳ Pending |

**Total Estimated Time:** 12-17 hours

---

## 🚀 Execution Order

1. **CRITICAL:** Fix LibreTranslate container first
2. Fix all UI translation keys in components
3. Add missing translations to database
4. Implement API content translation
5. Update frontend to pass language parameter
6. Add caching for performance
7. Test everything thoroughly

---

## 📝 Files to Create/Modify

### New Files:
1. `backend/src/services/contentTranslationService.ts`
2. `backend/src/services/translationCacheService.ts`
3. `backend/src/scripts/add-all-ui-translations.ts`
4. `backend/src/scripts/test-libretranslate.ts`

### Files to Modify:
1. All page components (Museum, Heritage, Sites, etc.)
2. All section components (Hero, Agenda, Profile, etc.)
3. Backend API controllers
4. Frontend API client
5. Backend .env configuration

---

**Ready to start implementation!**
