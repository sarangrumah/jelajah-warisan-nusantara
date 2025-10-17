# Translation Production Issues - Comprehensive Audit

## 🔍 Issues Identified on Production (museumcagarbudaya.kemenbud.go.id)

### Issue 1: Variables Coming Directly Without Translation ❌

**Problem:** Components are passing Indonesian text directly to `t()` instead of translation keys.

**Examples Found:**

1. **Museum.tsx** (Line 127):
```typescript
// ❌ WRONG - Passing Indonesian text
<h1>{t('Museum dan Cagar Budaya')}</h1>

// ✅ CORRECT - Should be
<h1>{t('museum.pageTitle')}</h1>
```

2. **Museum.tsx** (Line 141):
```typescript
// ❌ WRONG
placeholder={t('filter.museum.search')}

// ✅ CORRECT - Key exists but might not be in database
placeholder={t('museum.search.placeholder')}
```

3. **Museum.tsx** (Line 157):
```typescript
// ❌ WRONG - Hardcoded
<SelectItem value="all">{'Semua'}</SelectItem>

// ✅ CORRECT
<SelectItem value="all">{t('common.all')}</SelectItem>
```

4. **Museum.tsx** (Lines 186-195):
```typescript
// ❌ WRONG - Hardcoded buttons
<button>Beli Tiket</button>
<Link>Kunjungi Museum</Link>

// ✅ CORRECT
<button>{t('museum.buyTicket')}</button>
<Link>{t('museum.visitMuseum')}</Link>
```

5. **Museum.tsx** (Line 204):
```typescript
// ❌ WRONG
{t('No results found. Try adjusting your search or filter.')}

// ✅ CORRECT
{t('common.noResults')}
```

---

### Issue 2: Hardcoded Text Not Translated ❌

**Problem:** Many text strings are not wrapped in `t()` function at all.

**Components with Hardcoded Text:**

1. **Museum.tsx:**
   - "Semua" (Line 157)
   - "Beli Tiket" (Line 186)
   - "Kunjungi Museum" (Line 193)

2. **Footer.tsx:**
   - ✅ Already fixed - uses proper translation keys

3. **ContactSection.tsx:**
   - ✅ Already fixed - uses proper translation keys

4. **Other Components (Need to check):**
   - Header.tsx
   - HeroSection.tsx
   - AgendaSection.tsx
   - ProfileSection.tsx
   - ManagementSection.tsx
   - PPIDSection.tsx
   - ConservationSection.tsx
   - Media components

---

### Issue 3: API Response Content Not Translated ❌

**Problem:** API returns database content in Indonesian only, regardless of selected language.

**Affected Data:**

1. **Museums (tb_sites):**
   - `name` - Museum name
   - `subtitle` - Museum subtitle
   - `description` - Museum description
   - `address` - Museum address

2. **News Articles (tb_media):**
   - `title` - Article title
   - `content` - Article content
   - `excerpt` - Article excerpt

3. **Events (tb_events):**
   - `title` - Event title
   - `description` - Event description
   - `location` - Event location

4. **Collections (tb_master_collection):**
   - `name` - Collection name
   - `description` - Collection description

5. **FAQs (tb_faqs):**
   - `question` - FAQ question
   - `answer` - FAQ answer

6. **Banners (tb_banner):**
   - `title` - Banner title
   - `subtitle` - Banner subtitle
   - `description` - Banner description

**Current API Behavior:**
```typescript
// Current: Returns Indonesian only
GET /api/museums
Response: { name: "Museum Nasional", description: "Museum terbesar..." }

// Needed: Return translated content based on language
GET /api/museums?lang=en
Response: { name: "National Museum", description: "The largest museum..." }
```

---

## 🎯 Root Causes

### 1. Inconsistent Translation Key Usage
- Some components use proper keys: `t('contact.title')`
- Others pass text directly: `t('Museum dan Cagar Budaya')`
- No standardized naming convention

### 2. Missing Translation Keys in Database
- UI translations exist for some components (Contact, Footer)
- Missing translations for:
  - Museum page
  - Heritage page
  - Sites page
  - Collection page
  - Event page
  - Common UI elements (buttons, filters, etc.)

### 3. No Content Translation System
- Database tables don't have translation support
- API doesn't accept language parameter
- No mechanism to store/retrieve translated content

### 4. LibreTranslate Not Properly Integrated
- Service is available locally
- But not being used for content translation
- Only used for UI text auto-translation during migration

---

## 📋 Complete Fix Plan

### Phase 1: Fix Translation Key Usage (High Priority) ⚡

**Objective:** Ensure all components use proper translation keys, not direct text.

**Tasks:**
1. ✅ Audit all components for incorrect `t()` usage
2. Create standardized translation key structure
3. Update components to use proper keys
4. Add missing UI translation keys to database

**Estimated Time:** 4-6 hours

---

### Phase 2: Add Missing UI Translations (High Priority) ⚡

**Objective:** Add all missing translation keys to database.

**Translation Keys Needed:**

```typescript
// Museum Page
'museum.pageTitle': 'Museum dan Cagar Budaya'
'museum.search.placeholder': 'Cari museum...'
'museum.filter.type': 'Filter berdasarkan tipe'
'museum.buyTicket': 'Beli Tiket'
'museum.visitMuseum': 'Kunjungi Museum'

// Heritage Page
'heritage.pageTitle': 'Warisan Budaya'
'heritage.search.placeholder': 'Cari warisan budaya...'
'heritage.filter.category': 'Filter berdasarkan kategori'

// Sites Page
'sites.pageTitle': 'Situs Bersejarah'
'sites.search.placeholder': 'Cari situs...'

// Collection Page
'collection.pageTitle': 'Koleksi'
'collection.search.placeholder': 'Cari koleksi...'

// Common UI
'common.all': 'Semua'
'common.search': 'Cari'
'common.filter': 'Filter'
'common.noResults': 'Tidak ada hasil ditemukan'
'common.loading': 'Memuat...'
'common.error': 'Terjadi kesalahan'
'common.viewDetails': 'Lihat Detail'
'common.readMore': 'Baca Selengkapnya'
'common.back': 'Kembali'

// Buttons
'buttons.submit': 'Kirim'
'buttons.cancel': 'Batal'
'buttons.save': 'Simpan'
'buttons.delete': 'Hapus'
'buttons.edit': 'Edit'
'buttons.add': 'Tambah'
'buttons.close': 'Tutup'
```

**Tasks:**
1. Create migration script for missing UI translations
2. Run migration to add keys to database
3. Auto-translate to English using LibreTranslate
4. Verify translations in admin panel

**Estimated Time:** 2-3 hours

---

### Phase 3: Implement Content Translation System (Medium Priority) 🔄

**Objective:** Enable translation of database content (museums, news, events, etc.)

**Approach A: Translation Tables (Recommended)**

Create separate translation tables for each content type:

```sql
-- Example for museums
CREATE TABLE tb_sites_translations (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES tb_sites(id) ON DELETE CASCADE,
  language_code VARCHAR(10) REFERENCES languages(code),
  name VARCHAR(255),
  subtitle TEXT,
  description TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(site_id, language_code)
);

-- Similar tables for:
-- tb_media_translations (news)
-- tb_events_translations (events)
-- tb_master_collection_translations (collections)
-- tb_faqs_translations (FAQs)
-- tb_banner_translations (banners)
```

**Approach B: JSON Column (Alternative)**

Add JSON column to existing tables:

```sql
ALTER TABLE tb_sites ADD COLUMN translations JSONB;

-- Example data:
{
  "en": {
    "name": "National Museum",
    "description": "The largest museum..."
  },
  "id": {
    "name": "Museum Nasional",
    "description": "Museum terbesar..."
  }
}
```

**Recommendation:** Use Approach A (Translation Tables) for better:
- Query performance
- Data integrity
- Easier management
- Better indexing

**Tasks:**
1. Create migration SQL for translation tables
2. Create API endpoints to manage content translations
3. Update existing API to return translated content
4. Create admin UI to manage content translations
5. Migrate existing content to translation tables

**Estimated Time:** 8-10 hours

---

### Phase 4: Update API to Support Language Parameter (Medium Priority) 🔄

**Objective:** API returns content in requested language.

**Implementation:**

```typescript
// Backend: Update API to accept language parameter
router.get('/museums', async (req, res) => {
  const lang = req.query.lang || req.headers['accept-language'] || 'id';
  
  const museums = await pool.query(`
    SELECT 
      m.*,
      COALESCE(mt.name, m.name) as name,
      COALESCE(mt.description, m.description) as description
    FROM tb_sites m
    LEFT JOIN tb_sites_translations mt 
      ON m.id = mt.site_id AND mt.language_code = $1
    WHERE m.is_active = true
  `, [lang]);
  
  res.json(museums.rows);
});
```

```typescript
// Frontend: Pass language to API
import { useTranslation } from 'react-i18next';

const Museum = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const fetchMuseums = async () => {
      const response = await fetch(`/api/museums?lang=${i18n.language}`);
      const data = await response.json();
      setMuseums(data);
    };
    fetchMuseums();
  }, [i18n.language]); // Re-fetch when language changes
};
```

**Tasks:**
1. Update all API endpoints to accept `lang` parameter
2. Update API to join with translation tables
3. Update frontend API calls to pass current language
4. Add language change listener to re-fetch data

**Estimated Time:** 4-5 hours

---

### Phase 5: Auto-Translate Existing Content (Low Priority) 🤖

**Objective:** Use LibreTranslate to auto-translate existing Indonesian content to English.

**Implementation:**

```typescript
// Script to auto-translate content
import translationService from './services/translationService';

async function translateContent() {
  // Get all museums
  const museums = await pool.query('SELECT * FROM tb_sites');
  
  for (const museum of museums.rows) {
    // Translate to English
    const nameEn = await translationService.translate(museum.name, 'en', 'id');
    const descEn = await translationService.translate(museum.description, 'en', 'id');
    
    // Insert translation
    await pool.query(`
      INSERT INTO tb_sites_translations (site_id, language_code, name, description)
      VALUES ($1, 'en', $2, $3)
      ON CONFLICT (site_id, language_code) DO UPDATE
      SET name = $2, description = $3
    `, [museum.id, nameEn.translatedText, descEn.translatedText]);
  }
}
```

**Tasks:**
1. Create auto-translation script for each content type
2. Run script to translate all existing content
3. Review and manually correct translations
4. Set up periodic auto-translation for new content

**Estimated Time:** 3-4 hours

---

## 🚀 Implementation Priority

### Immediate (Do First) ⚡
1. **Fix Translation Key Usage** - Prevents confusion, ensures consistency
2. **Add Missing UI Translations** - Makes UI fully bilingual

### Short-term (Do Next) 🔄
3. **Implement Content Translation System** - Core functionality
4. **Update API for Language Support** - Enables content translation

### Long-term (Nice to Have) 🤖
5. **Auto-Translate Existing Content** - Saves manual work

---

## 📊 Translation Key Naming Convention

**Standardized Structure:**

```
[module].[page].[section].[element]

Examples:
- museum.pageTitle
- museum.search.placeholder
- museum.filter.type
- museum.card.buyTicket
- museum.card.visitMuseum

- heritage.pageTitle
- heritage.search.placeholder

- common.all
- common.search
- common.filter
- common.noResults

- buttons.submit
- buttons.cancel

- nav.home
- nav.about
- nav.contact

- footer.copyright
- footer.privacy
```

**Benefits:**
- Easy to find keys
- Prevents duplicates
- Clear organization
- Scalable structure

---

## 🧪 Testing Checklist

### UI Translation Testing:
- [ ] All text changes when switching language
- [ ] No Indonesian text appears in English mode
- [ ] No English text appears in Indonesian mode
- [ ] Translation keys display correctly (no `museum.pageTitle` showing)
- [ ] Form validation messages translate
- [ ] Error messages translate
- [ ] Success messages translate

### Content Translation Testing:
- [ ] Museum names translate
- [ ] Museum descriptions translate
- [ ] News articles translate
- [ ] Event information translates
- [ ] FAQ questions/answers translate
- [ ] Banner text translates

### API Testing:
- [ ] `/api/museums?lang=id` returns Indonesian
- [ ] `/api/museums?lang=en` returns English
- [ ] Language parameter works for all endpoints
- [ ] Missing translations fallback to Indonesian

### LibreTranslate Testing:
- [ ] Service is accessible at localhost:5000
- [ ] Auto-translation works for new content
- [ ] Translation quality is acceptable
- [ ] Service handles errors gracefully

---

## 🔧 Quick Fixes for Production

### Fix 1: Update Museum.tsx Translation Keys

```typescript
// Replace incorrect usage
<h1>{t('museum.pageTitle')}</h1>
<Input placeholder={t('museum.search.placeholder')} />
<SelectItem value="all">{t('common.all')}</SelectItem>
<button>{t('museum.buyTicket')}</button>
<Link>{t('museum.visitMuseum')}</Link>
<p>{t('common.noResults')}</p>
```

### Fix 2: Add Missing Translation Keys

Run this script:
```bash
cd backend
npm run add:missing-translations
```

### Fix 3: Verify LibreTranslate

```bash
# Check if LibreTranslate is running
curl http://localhost:5000/languages

# Test translation
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Museum Nasional","source":"id","target":"en"}'
```

---

## 📞 Next Steps

1. **Review this audit** - Confirm issues match production
2. **Prioritize fixes** - Which issues are most critical?
3. **Choose approach** - Translation tables or JSON columns?
4. **Start implementation** - Begin with Phase 1

**Estimated Total Time:** 20-25 hours for complete implementation

---

**Status:** Audit Complete - Ready for Implementation
**Last Updated:** 2025
**Production Site:** museumcagarbudaya.kemenbud.go.id
