# Quick Fix Plan: Complete Translation Implementation

**Goal:** Make the production site fully bilingual (Indonesian/English) by:
1. Adding all hardcoded text to translation tables
2. Making API responses return translated content based on language

---

## 🎯 Solution Overview

### Part 1: Add Hardcoded Text to Translation Tables
**What:** Extract all hardcoded Indonesian text from components and add to database
**How:** Create a comprehensive translation key list and bulk insert into database
**Time:** 1-2 days

### Part 2: Translate API Responses
**What:** Make all API endpoints return translated content based on Accept-Language header
**How:** Two approaches available (choose one)
**Time:** 2-3 days

---

## 📋 Part 1: Add All Hardcoded Text to Translation Tables

### Step 1.1: Create Complete Translation Key List

**File:** `backend/src/scripts/complete-ui-translations.ts`

```typescript
import { pool } from '../config/database';
import translationService from '../services/translationService';

interface TranslationKey {
  page: string;
  key: string;
  indonesianText: string;
}

const allUITranslations: TranslationKey[] = [
  // ===== CONTACT PAGE =====
  { page: 'contact', key: 'title', indonesianText: 'Hubungi Kami' },
  { page: 'contact', key: 'subtitle', indonesianText: 'Kami siap membantu Anda dengan pertanyaan, saran, atau informasi lebih lanjut tentang museum dan cagar budaya Indonesia.' },
  { page: 'contact', key: 'infoTitle', indonesianText: 'Informasi Kontak' },
  { page: 'contact', key: 'office.title', indonesianText: 'Alamat Kantor' },
  { page: 'contact', key: 'office.address1', indonesianText: 'Jl. Medan Merdeka Barat No. 12' },
  { page: 'contact', key: 'office.address2', indonesianText: 'Jakarta Pusat 10110' },
  { page: 'contact', key: 'office.address3', indonesianText: 'DKI Jakarta, Indonesia' },
  { page: 'contact', key: 'whatsapp', indonesianText: 'Whatsapp' },
  { page: 'contact', key: 'email', indonesianText: 'Email' },
  { page: 'contact', key: 'hours.title', indonesianText: 'Jam Operasional' },
  { page: 'contact', key: 'hours.monThu', indonesianText: 'Senin - Kamis: 07:30 - 16:00 WIB' },
  { page: 'contact', key: 'hours.fri', indonesianText: 'Jumat: 07:30 - 16:30 WIB' },
  { page: 'contact', key: 'hours.weekend', indonesianText: 'Sabtu, Minggu & Hari Libur Nasional: Tutup' },
  { page: 'contact', key: 'socialMedia', indonesianText: 'Media Sosial' },
  { page: 'contact', key: 'form.title', indonesianText: 'Kirim Pesan' },
  { page: 'contact', key: 'form.subtitle', indonesianText: 'Sampaikan pertanyaan atau saran Anda kepada kami' },
  { page: 'contact', key: 'form.name', indonesianText: 'Nama Lengkap' },
  { page: 'contact', key: 'form.namePlaceholder', indonesianText: 'Masukkan nama lengkap' },
  { page: 'contact', key: 'form.email', indonesianText: 'Email' },
  { page: 'contact', key: 'form.emailPlaceholder', indonesianText: 'Masukkan email' },
  { page: 'contact', key: 'form.subject', indonesianText: 'Subjek' },
  { page: 'contact', key: 'form.subjectPlaceholder', indonesianText: 'Masukkan subjek pesan' },
  { page: 'contact', key: 'form.message', indonesianText: 'Pesan' },
  { page: 'contact', key: 'form.messagePlaceholder', indonesianText: 'Tulis pesan Anda...' },
  { page: 'contact', key: 'form.submit', indonesianText: 'Kirim Pesan' },
  { page: 'contact', key: 'faq.title', indonesianText: 'Pertanyaan yang Sering Diajukan (FAQ)' },
  { page: 'contact', key: 'faq.subtitle', indonesianText: 'Temukan jawaban untuk pertanyaan umum seputar museum dan cagar budaya' },

  // ===== MUSEUM PAGE =====
  { page: 'museum', key: 'title', indonesianText: 'Museum dan Cagar Budaya' },
  { page: 'museum', key: 'searchPlaceholder', indonesianText: 'Cari Museum dan Cagar Budaya...' },
  { page: 'museum', key: 'filterAll', indonesianText: 'Semua' },
  { page: 'museum', key: 'noResults', indonesianText: 'Tidak ada hasil ditemukan' },
  { page: 'museum', key: 'loading', indonesianText: 'Memuat...' },

  // ===== HOME PAGE =====
  { page: 'home', key: 'services.title', indonesianText: 'Layanan Utama' },
  { page: 'home', key: 'services.museum', indonesianText: 'Museum' },
  { page: 'home', key: 'services.heritage', indonesianText: 'Cagar Budaya' },
  { page: 'home', key: 'map.title', indonesianText: 'Peta Interaktif Indonesia' },
  { page: 'home', key: 'map.caption', indonesianText: 'Klik pada marker untuk melihat detail lokasi dan navigasi ke halaman museum atau cagar budaya' },
  { page: 'home', key: 'news.title', indonesianText: 'Berita & Artikel' },
  { page: 'home', key: 'news.subtitle', indonesianText: 'Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian warisan budaya Indonesia.' },
  { page: 'home', key: 'agenda.upcoming', indonesianText: 'Akan Datang' },
  { page: 'home', key: 'agenda.allEvents', indonesianText: 'Semua Event' },
  { page: 'home', key: 'agenda.exhibition', indonesianText: 'Pameran Temporer' },

  // ===== BUTTONS =====
  { page: 'buttons', key: 'buyTicket', indonesianText: 'Beli Tiket' },
  { page: 'buttons', key: 'visitMuseum', indonesianText: 'Kunjungi Museum' },
  { page: 'buttons', key: 'manageMuseum', indonesianText: 'Kelola Museum' },
  { page: 'buttons', key: 'manageHeritage', indonesianText: 'Kelola Cagar Budaya' },
  { page: 'buttons', key: 'viewAgenda', indonesianText: 'Lihat Agenda' },
  { page: 'buttons', key: 'viewAllNews', indonesianText: 'Lihat Semua Berita' },
  { page: 'buttons', key: 'readMore', indonesianText: 'Baca Selengkapnya' },
  { page: 'buttons', key: 'viewDetails', indonesianText: 'Lihat Detail' },
  { page: 'buttons', key: 'detailEvent', indonesianText: 'Detail Event' },
  { page: 'buttons', key: 'download', indonesianText: 'Unduh' },
  { page: 'buttons', key: 'apply', indonesianText: 'Lamar' },
  { page: 'buttons', key: 'submit', indonesianText: 'Kirim' },
  { page: 'buttons', key: 'cancel', indonesianText: 'Batal' },
  { page: 'buttons', key: 'save', indonesianText: 'Simpan' },
  { page: 'buttons', key: 'edit', indonesianText: 'Edit' },
  { page: 'buttons', key: 'delete', indonesianText: 'Hapus' },
  { page: 'buttons', key: 'search', indonesianText: 'Cari' },
  { page: 'buttons', key: 'filter', indonesianText: 'Filter' },

  // ===== FOOTER =====
  { page: 'footer', key: 'ministry', indonesianText: 'Kementerian Kebudayaan Republik Indonesia' },
  { page: 'footer', key: 'contactUs', indonesianText: 'Kontak Kami' },
  { page: 'footer', key: 'quickLinks', indonesianText: 'Tautan Cepat' },
  { page: 'footer', key: 'socialMedia', indonesianText: 'Media Sosial' },
  { page: 'footer', key: 'home', indonesianText: 'Beranda' },
  { page: 'footer', key: 'agenda', indonesianText: 'Agenda' },
  { page: 'footer', key: 'aboutUs', indonesianText: 'Tentang Kami' },
  { page: 'footer', key: 'orgStructure', indonesianText: 'Struktur Organisasi' },
  { page: 'footer', key: 'conservation', indonesianText: 'Laboratorium Konservasi' },
  { page: 'footer', key: 'newsPublications', indonesianText: 'Berita & Publikasi' },
  { page: 'footer', key: 'contactUs', indonesianText: 'Hubungi Kami' },
  { page: 'footer', key: 'career', indonesianText: 'Karir' },
  { page: 'footer', key: 'sop', indonesianText: 'Prosedur Operasional Standar' },
  { page: 'footer', key: 'settings', indonesianText: 'Pengaturan' },
  { page: 'footer', key: 'copyright', indonesianText: '© 2025 Museum dan Cagar Budaya. Hak Cipta Dilindungi.' },
  { page: 'footer', key: 'privacyPolicy', indonesianText: 'Kebijakan Privasi' },
  { page: 'footer', key: 'termsConditions', indonesianText: 'Syarat & Ketentuan' },

  // ===== FORMS =====
  { page: 'forms', key: 'required', indonesianText: 'Wajib diisi' },
  { page: 'forms', key: 'optional', indonesianText: 'Opsional' },
  { page: 'forms', key: 'selectOption', indonesianText: 'Pilih opsi' },
  { page: 'forms', key: 'uploadFile', indonesianText: 'Unggah File' },
  { page: 'forms', key: 'dragDrop', indonesianText: 'Seret dan lepas file di sini' },
  { page: 'forms', key: 'browse', indonesianText: 'Telusuri' },

  // ===== MESSAGES =====
  { page: 'messages', key: 'success.saved', indonesianText: 'Data berhasil disimpan' },
  { page: 'messages', key: 'success.deleted', indonesianText: 'Data berhasil dihapus' },
  { page: 'messages', key: 'success.updated', indonesianText: 'Data berhasil diperbarui' },
  { page: 'messages', key: 'success.sent', indonesianText: 'Pesan berhasil dikirim' },
  { page: 'messages', key: 'error.failed', indonesianText: 'Terjadi kesalahan' },
  { page: 'messages', key: 'error.notFound', indonesianText: 'Data tidak ditemukan' },
  { page: 'messages', key: 'error.unauthorized', indonesianText: 'Anda tidak memiliki akses' },
  { page: 'messages', key: 'loading', indonesianText: 'Memuat...' },
  { page: 'messages', key: 'noData', indonesianText: 'Tidak ada data' },
  { page: 'messages', key: 'confirm.delete', indonesianText: 'Apakah Anda yakin ingin menghapus?' },
  { page: 'messages', key: 'confirm.cancel', indonesianText: 'Apakah Anda yakin ingin membatalkan?' },

  // Add more as needed...
];

async function addAllUITranslations() {
  console.log('🚀 Starting complete UI translations migration...');
  console.log(`📊 Total translations to add: ${allUITranslations.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const translation of allUITranslations) {
    try {
      // Insert Indonesian (source)
      await pool.query(`
        INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated, created_at)
        VALUES ('translation', $1, $2, 'id', $3, false, NOW(), NOW())
        ON CONFLICT (module, page, key, language_code) 
        DO UPDATE SET text = EXCLUDED.text, last_updated = NOW()
      `, [translation.page, translation.key, translation.indonesianText]);

      console.log(`✅ Added Indonesian: ${translation.page}.${translation.key}`);

      // Auto-translate to English
      const englishTranslation = await translationService.translate(
        translation.indonesianText,
        'en',
        'id'
      );

      if (englishTranslation.success) {
        await pool.query(`
          INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated, created_at)
          VALUES ('translation', $1, $2, 'en', $3, true, NOW(), NOW())
          ON CONFLICT (module, page, key, language_code) 
          DO UPDATE SET text = EXCLUDED.text, last_updated = NOW()
        `, [translation.page, translation.key, englishTranslation.translatedText]);

        console.log(`✅ Added English: ${translation.page}.${translation.key} -> ${englishTranslation.translatedText}`);
        successCount++;
      } else {
        console.log(`⚠️ Translation failed for: ${translation.page}.${translation.key}`);
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error adding translation ${translation.page}.${translation.key}:`, error);
      errorCount++;
    }
  }

  console.log('\n✨ UI translations migration complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${allUITranslations.length}`);
}

// Run the migration
addAllUITranslations()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
```

### Step 1.2: Run the Script

```bash
cd backend
npm run ts-node src/scripts/complete-ui-translations.ts
```

This will:
1. Add all Indonesian text to database
2. Auto-translate each to English using LibreTranslate
3. Store both versions in the translations table

---

## 📋 Part 2: Translate API Responses

### Approach A: Create Translation Tables (RECOMMENDED)

**Best for:** Long-term maintainability, better performance

#### Step 2A.1: Create Translation Tables Migration

**File:** `database/migrations/002_create_content_translation_tables.sql`

```sql
-- Museums Translation Table
CREATE TABLE IF NOT EXISTS tb_sites_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES tb_sites(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    name TEXT,
    description TEXT,
    location TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    auto_translated BOOLEAN DEFAULT false,
    UNIQUE(site_id, language_code)
);

-- News/Media Translation Table
CREATE TABLE IF NOT EXISTS tb_media_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID NOT NULL REFERENCES tb_media(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    title TEXT,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    auto_translated BOOLEAN DEFAULT false,
    UNIQUE(media_id, language_code)
);

-- Events/Agenda Translation Table
CREATE TABLE IF NOT EXISTS tb_events_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES tb_events(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    title TEXT,
    description TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    auto_translated BOOLEAN DEFAULT false,
    UNIQUE(event_id, language_code)
);

-- FAQs Translation Table
CREATE TABLE IF NOT EXISTS tb_faqs_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faq_id UUID NOT NULL REFERENCES tb_faqs(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    auto_translated BOOLEAN DEFAULT false,
    UNIQUE(faq_id, language_code)
);

-- Create indexes
CREATE INDEX idx_sites_translations_site ON tb_sites_translations(site_id);
CREATE INDEX idx_sites_translations_lang ON tb_sites_translations(language_code);
CREATE INDEX idx_media_translations_media ON tb_media_translations(media_id);
CREATE INDEX idx_media_translations_lang ON tb_media_translations(language_code);
CREATE INDEX idx_events_translations_event ON tb_events_translations(event_id);
CREATE INDEX idx_events_translations_lang ON tb_events_translations(language_code);
CREATE INDEX idx_faqs_translations_faq ON tb_faqs_translations(faq_id);
CREATE INDEX idx_faqs_translations_lang ON tb_faqs_translations(language_code);

-- Create triggers for timestamp updates
CREATE TRIGGER update_sites_translations_updated_at 
    BEFORE UPDATE ON tb_sites_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_translations_updated_at 
    BEFORE UPDATE ON tb_media_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_translations_updated_at 
    BEFORE UPDATE ON tb_events_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_translations_updated_at 
    BEFORE UPDATE ON tb_faqs_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

#### Step 2A.2: Auto-Translate Existing Content

**File:** `backend/src/scripts/translate-existing-content.ts`

```typescript
import { pool } from '../config/database';
import translationService from '../services/translationService';

async function translateExistingContent() {
  console.log('🚀 Starting content translation...');

  // Translate Museums/Sites
  console.log('\n📍 Translating museums/sites...');
  const sites = await pool.query('SELECT id, name, description, location, address FROM tb_sites');
  
  for (const site of sites.rows) {
    try {
      const nameEn = await translationService.translate(site.name, 'en', 'id');
      const descEn = site.description ? await translationService.translate(site.description, 'en', 'id') : null;
      const locEn = site.location ? await translationService.translate(site.location, 'en', 'id') : null;
      const addrEn = site.address ? await translationService.translate(site.address, 'en', 'id') : null;

      await pool.query(`
        INSERT INTO tb_sites_translations (site_id, language_code, name, description, location, address, auto_translated)
        VALUES ($1, 'en', $2, $3, $4, $5, true)
        ON CONFLICT (site_id, language_code) DO UPDATE 
        SET name = $2, description = $3, location = $4, address = $5, updated_at = NOW()
      `, [site.id, nameEn.translatedText, descEn?.translatedText, locEn?.translatedText, addrEn?.translatedText]);

      console.log(`✅ Translated site: ${site.name}`);
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    } catch (error) {
      console.error(`❌ Error translating site ${site.id}:`, error);
    }
  }

  // Translate News/Media
  console.log('\n📰 Translating news/media...');
  const media = await pool.query('SELECT id, title, excerpt, content FROM tb_media');
  
  for (const item of media.rows) {
    try {
      const titleEn = await translationService.translate(item.title, 'en', 'id');
      const excerptEn = item.excerpt ? await translationService.translate(item.excerpt, 'en', 'id') : null;
      const contentEn = item.content ? await translationService.translate(item.content, 'en', 'id') : null;

      await pool.query(`
        INSERT INTO tb_media_translations (media_id, language_code, title, excerpt, content, auto_translated)
        VALUES ($1, 'en', $2, $3, $4, true)
        ON CONFLICT (media_id, language_code) DO UPDATE 
        SET title = $2, excerpt = $3, content = $4, updated_at = NOW()
      `, [item.id, titleEn.translatedText, excerptEn?.translatedText, contentEn?.translatedText]);

      console.log(`✅ Translated media: ${item.title}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error translating media ${item.id}:`, error);
    }
  }

  // Translate Events
  console.log('\n📅 Translating events...');
  const events = await pool.query('SELECT id, title, description, location FROM tb_events');
  
  for (const event of events.rows) {
    try {
      const titleEn = await translationService.translate(event.title, 'en', 'id');
      const descEn = event.description ? await translationService.translate(event.description, 'en', 'id') : null;
      const locEn = event.location ? await translationService.translate(event.location, 'en', 'id') : null;

      await pool.query(`
        INSERT INTO tb_events_translations (event_id, language_code, title, description, location, auto_translated)
        VALUES ($1, 'en', $2, $3, $4, true)
        ON CONFLICT (event_id, language_code) DO UPDATE 
        SET title = $2, description = $3, location = $4, updated_at = NOW()
      `, [event.id, titleEn.translatedText, descEn?.translatedText, locEn?.translatedText]);

      console.log(`✅ Translated event: ${event.title}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error translating event ${event.id}:`, error);
    }
  }

  // Translate FAQs
  console.log('\n❓ Translating FAQs...');
  const faqs = await pool.query('SELECT id, question, answer FROM tb_faqs');
  
  for (const faq of faqs.rows) {
    try {
      const questionEn = await translationService.translate(faq.question, 'en', 'id');
      const answerEn = await translationService.translate(faq.answer, 'en', 'id');

      await pool.query(`
        INSERT INTO tb_faqs_translations (faq_id, language_code, question, answer, auto_translated)
        VALUES ($1, 'en', $2, $3, true)
        ON CONFLICT (faq_id, language_code) DO UPDATE 
        SET question = $2, answer = $3, updated_at = NOW()
      `, [faq.id, questionEn.translatedText, answerEn.translatedText]);

      console.log(`✅ Translated FAQ: ${faq.question.substring(0, 50)}...`);
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error translating FAQ ${faq.id}:`, error);
    }
  }

  console.log('\n✨ Content translation complete!');
}

translateExistingContent()
  .then(() => {
    console.log('Translation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Translation failed:', error);
    process.exit(1);
  });
```

#### Step 2A.3: Update API Controllers to Use Translations

**Example for Museums:**

```typescript
// backend/src/controllers/siteController.ts

export const getAllSites = async (req: Request, res: Response) => {
  try {
    const lang = req.headers['accept-language']?.split(',')[0] || 'id';
    
    const query = `
      SELECT 
        s.*,
        COALESCE(st.name, s.name) as name,
        COALESCE(st.description, s.description) as description,
        COALESCE(st.location, s.location) as location,
        COALESCE(st.address, s.address) as address
      FROM tb_sites s
      LEFT JOIN tb_sites_translations st 
        ON s.id = st.site_id AND st.language_code = $1
      WHERE s.is_active = true
      ORDER BY s.created_at DESC
    `;
    
    const result = await pool.query(query, [lang]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

export const getSiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = req.headers['accept-language']?.split(',')[0] || 'id';
    
    const query = `
      SELECT 
        s.*,
        COALESCE(st.name, s.name) as name,
        COALESCE(st.description, s.description) as description,
        COALESCE(st.location, s.location) as location,
        COALESCE(st.address, s.address) as address
      FROM tb_sites s
      LEFT JOIN tb_sites_translations st 
        ON s.id = st.site_id AND st.language_code = $2
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id, lang]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching site:', error);
    res.status(500).json({ error: 'Failed to fetch site' });
  }
};
```

**Repeat similar pattern for:**
- Media/News controller
- Events controller
- FAQs controller

#### Step 2A.4: Update Frontend API Client

**File:** `src/lib/api-client.ts`

```typescript
import i18n from '@/i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = {
  async get(endpoint: string, options = {}) {
    const lang = i18n.language || 'id';
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept-Language': lang,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async post(endpoint: string, data: any, options = {}) {
    const lang = i18n.language || 'id';
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Accept-Language': lang,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Add other methods (PUT, DELETE, etc.)
};
```

---

### Approach B: Real-time Translation with Local LibreTranslate (RECOMMENDED IF DOCKER IS AVAILABLE)

**Best for:** Quick implementation, no database changes, instant deployment

**✅ With Local LibreTranslate Docker:**
- **No API costs** - Free unlimited translations
- **Fast response times** - Local network, ~50-200ms per translation
- **No database changes** - Works with existing schema
- **Instant deployment** - No migration needed
- **Easy to implement** - Just add middleware

**Pros:**
- ✅ No database schema changes needed
- ✅ Works immediately with existing data
- ✅ Easy to implement (1-2 hours)
- ✅ No translation costs (local Docker)
- ✅ Fast enough for production (~100-200ms overhead)
- ✅ Automatic translation of new content
- ✅ Can cache translations for even better performance

**Cons:**
- ⚠️ Slight response time increase (~100-200ms per request)
- ⚠️ Server CPU usage for translation
- ⚠️ Translation quality depends on LibreTranslate model

**Performance with Local Docker:**
```
Without translation:  ~50ms response time
With translation:     ~150-250ms response time
With caching:         ~50-80ms response time (after first request)
```

This is **acceptable for production** and much faster than external API calls!

---

#### Implementation: Real-time Translation Middleware

**Step B.1: Create Translation Middleware**

**File:** `backend/src/middleware/translateResponse.ts`

```typescript
import translationService from '../services/translationService';

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

/**
 * Middleware to automatically translate API responses
 * Works with local LibreTranslate Docker instance
 */
export const translateResponse = async (req: Request, res: Response, next: Function) => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'id';
  
  // Skip translation if language is Indonesian (source language)
  if (lang === 'id' || lang.startsWith('id')) {
    return next();
  }

  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to translate before sending
  res.json = async function(data: any) {
    try {
      const translatedData = await translateObject(data, lang);
      return originalJson(translatedData);
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to original data if translation fails
      return originalJson(data);
    }
  };

  next();
};

/**
 * Recursively translate all string values in an object
 */
async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (typeof obj === 'string') {
    return await translateWithCache(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(
      obj.map(item => translateObject(item, targetLang))
    );
  }

  if (obj !== null && typeof obj === 'object') {
    const translated: any = {};
    
    // Fields to translate
    const translatableFields = [
      'name', 'title', 'description', 'content', 
      'excerpt', 'location', 'address', 'question', 
      'answer', 'subtitle', 'text'
    ];

    for (const [key, value] of Object.entries(obj)) {
      if (translatableFields.includes(key) && typeof value === 'string') {
        translated[key] = await translateWithCache(value, targetLang);
      } else if (typeof value === 'object') {
        translated[key] = await translateObject(value, targetLang);
      } else {
        translated[key] = value;
      }
    }

    return translated;
  }

  return obj;
}

/**
 * Translate with caching to improve performance
 */
async function translateWithCache(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') {
    return text;
  }

  // Create cache key
  const cacheKey = `${text.substring(0, 100)}_${text.length}`;
  
  // Check cache
  if (translationCache[cacheKey]?.[targetLang]) {
    return translationCache[cacheKey][targetLang];
  }

  // Translate
  const result = await translationService.translate(text, targetLang, 'id');
  
  if (result.success) {
    // Store in cache
    if (!translationCache[cacheKey]) {
      translationCache[cacheKey] = {};
    }
    translationCache[cacheKey][targetLang] = result.translatedText;
    
    return result.translatedText;
  }

  return text; // Return original if translation fails
}

/**
 * Clear translation cache (useful for memory management)
 */
export function clearTranslationCache() {
  Object.keys(translationCache).forEach(key => delete translationCache[key]);
  console.log('Translation cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const totalKeys = Object.keys(translationCache).length;
  const totalTranslations = Object.values(translationCache).reduce(
    (sum, langs) => sum + Object.keys(langs).length, 
    0
  );
  
  return {
    totalKeys,
    totalTranslations,
    cacheSize: JSON.stringify(translationCache).length
  };
}
```

**Step B.2: Apply Middleware to API Routes**

**File:** `backend/src/routes/api.ts`

```typescript
import express from 'express';
import { translateResponse } from '../middleware/translateResponse';

const router = express.Router();

// Apply translation middleware to all API routes
router.use(translateResponse);

// Your existing routes
router.use('/tb_sites', siteRoutes);
router.use('/tb_media', mediaRoutes);
router.use('/tb_events', eventRoutes);
router.use('/tb_faqs', faqRoutes);
// ... other routes

export default router;
```

**Step B.3: Update Frontend API Client (Same as Approach A)**

**File:** `src/lib/api-client.ts`

```typescript
import i18n from '@/i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = {
  async get(endpoint: string, options = {}) {
    const lang = i18n.language || 'id';
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept-Language': lang,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // ... other methods
};
```

**Step B.4: Optional - Add Cache Management Endpoint**

```typescript
// backend/src/routes/admin.ts

import { clearTranslationCache, getCacheStats } from '../middleware/translateResponse';

// Clear translation cache (admin only)
router.post('/translation-cache/clear', authenticateToken, (req, res) => {
  clearTranslationCache();
  res.json({ message: 'Translation cache cleared' });
});

// Get cache statistics (admin only)
router.get('/translation-cache/stats', authenticateToken, (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});
```

---

## 🎯 Updated Recommendation: Approach B is NOW RECOMMENDED!

### Why Approach B with Local Docker is Better:

**Approach A (Translation Tables):**
- ⏱️ Takes 2-3 days to implement
- 🗄️ Requires database migration
- 📝 Need to translate all existing content
- 🔧 Need to update all API controllers
- ⚠️ Risk of migration issues

**Approach B (Real-time with Local Docker):**
- ⏱️ Takes 1-2 hours to implement
- ✅ No database changes
- ✅ Works with existing data immediately
- ✅ Automatic translation of new content
- ✅ Fast enough for production (~150-250ms)
- ✅ Can add caching for even better performance

### Performance Comparison:

```
Scenario: Loading museum page with 10 museums

Approach A (Translation Tables):
- Database query with JOIN: ~50ms
- Total response time: ~50ms
✅ Fastest

Approach B (Real-time, No Cache):
- Database query: ~30ms
- Translation (10 museums × 3 fields): ~150ms
- Total response time: ~180ms
✅ Acceptable

Approach B (Real-time, With Cache):
- Database query: ~30ms
- Translation (cached): ~10ms
- Total response time: ~40ms
✅ Almost as fast as Approach A!

External API (for comparison):
- Database query: ~30ms
- Translation (external): ~2000ms
- Total response time: ~2030ms
❌ Too slow
```

### Implementation Timeline:

**Approach B (RECOMMENDED):**
```
Hour 1: Create middleware (30 min)
Hour 2: Apply to routes and test (30 min)
Hour 3: Update frontend API client (30 min)
Hour 4: Test on production (30 min)
Total: 2-4 hours ✅
```

**Approach A (Alternative):**
```
Day 1: Create migration and translation tables
Day 2: Run auto-translation script (slow)
Day 3: Update all API controllers
Day 4: Update frontend and test
Total: 3-4 days ⏱️
```

---

## 🚀 Quick Start: Implement Approach B Now

### Step 1: Verify LibreTranslate Docker is Running

```bash
# Check if LibreTranslate is running
curl http://localhost:5000/languages

# Should return list of supported languages
```

### Step 2: Create Middleware File

```bash
cd backend/src
mkdir -p middleware
# Create translateResponse.ts with code above
```

### Step 3: Apply Middleware

```typescript
// In backend/src/routes/api.ts
import { translateResponse } from '../middleware/translateResponse';

router.use(translateResponse); // Add this line
```

### Step 4: Update Frontend API Client

```typescript
// In src/lib/api-client.ts
// Add Accept-Language header (code above)
```

### Step 5: Test

```bash
# Start backend
cd backend
npm run dev

# Test API with English
curl -H "Accept-Language: en" http://localhost:3001/api/tb_sites

# Should return translated content!
```

### Step 6: Deploy

```bash
# Deploy to production
# Translation will work immediately!
```

---

## 📊 Final Recommendation

**Use Approach B (Real-time Translation) because:**

1. ✅ **Fast to implement** - 2-4 hours vs 3-4 days
2. ✅ **No database changes** - Zero risk of migration issues
3. ✅ **Works immediately** - No need to translate existing content
4. ✅ **Good performance** - 150-250ms is acceptable for production
5. ✅ **With caching** - Can be as fast as database approach
6. ✅ **Automatic** - New content is automatically translated
7. ✅ **No costs** - Local Docker = free unlimited translations

**Later, you can migrate to Approach A if:**
- You need absolute best performance (<50ms)
- You want to manually review/edit translations
- You have very high traffic (1000+ requests/second)

But for most use cases, **Approach B with local LibreTranslate Docker is perfect!**

---

## 🎯 Complete Implementation Plan (Updated)

### Phase 1: UI Translations (Day 1)
1. Run `complete-ui-translations.ts` script
2. Add ~80 translation keys to database
3. Verify UI translations work

### Phase 2: API Translation (Day 1-2)
1. ✅ **Use Approach B** - Real-time translation middleware
2. Create middleware file (30 min)
3. Apply to routes (30 min)
4. Update frontend API client (30 min)
5. Test thoroughly (2-3 hours)

### Phase 3: Deploy (Day 2)
1. Deploy to production
2. Monitor performance
3. Adjust cache settings if needed

**Total Time: 2 days instead of 3 weeks!** 🚀

---

## 💡 Pro Tips for Approach B

### 1. Optimize Translation Performance

```typescript
// Batch translations for better performance
async function translateBatch(texts: string[], targetLang: string) {
  return await Promise.all(
    texts.map(text => translateWithCache(text, targetLang))
  );
}
```

### 2. Add Response Time Monitoring

```typescript
export const translateResponse = async (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  // ... translation logic ...
  
  const duration = Date.now() - startTime;
  res.setHeader('X-Translation-Time', `${duration}ms`);
};
```

### 3. Selective Translation

```typescript
// Only translate specific endpoints if needed
const translatableEndpoints = ['/api/tb_sites', '/api/tb_media', '/api/tb_events'];

export const translateResponse = async (req: Request, res: Response, next: Function) => {
  const shouldTranslate = translatableEndpoints.some(endpoint => 
    req.path.startsWith(endpoint)
  );
  
  if (!shouldTranslate) {
    return next();
  }
  
  // ... translation logic ...
};
```

### 4. Cache Warming

```typescript
// Warm up cache on server start
async function warmUpCache() {
  const popularContent = await pool.query(`
    SELECT name, description FROM tb_sites LIMIT 20
  `);
  
  for (const item of popularContent.rows) {
    await translateWithCache(item.name, 'en');
    await translateWithCache(item.description, 'en');
  }
  
  console.log('Translation cache warmed up');
}
```

---

*With local LibreTranslate Docker, Approach B becomes the clear winner!* 🏆
