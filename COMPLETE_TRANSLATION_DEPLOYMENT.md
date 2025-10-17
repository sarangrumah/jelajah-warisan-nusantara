# 🎯 Complete Translation System Deployment Guide

## Summary of All Issues & Fixes

### ✅ Issue 1: 504 Timeout on API Endpoints - FIXED
**Problem:** All API endpoints (`/api/heritages`, `/api/museums`, etc.) timing out  
**Root Cause:** `translateResponse` middleware translating every API response  
**Solution:** Disabled middleware in `backend/src/routes/api.ts`  
**Status:** ✅ Code fixed, ready to deploy

### ⚠️ Issue 2: Translation Variables Showing - NEEDS SQL + DEPLOYMENT
**Problem:** Pages showing `heritage.title`, `profile.title`, `agenda.title`, etc.  
**Root Cause:** Missing translations in database + hardcoded text in components  
**Solution:** 
1. Run SQL to add translations (`database/add-all-homepage-translations.sql`)
2. Deploy updated components that use `t()` function
**Status:** ⚠️ Code fixed, needs deployment + SQL

### 📋 Files Modified

**Backend:**
1. `backend/src/routes/api.ts` - Disabled `translateResponse` middleware

**Frontend Components:**
2. `src/components/AgendaSection.tsx` - Added translations for status labels and buttons
3. `src/components/NewsSection.tsx` - Added translations for titles, loading, buttons
4. `src/components/ProfileSection.tsx` - Added translations for About Us, Contact labels

**Database:**
5. `database/add-heritage-translations.sql` - Heritage & Museum page translations
6. `database/add-all-homepage-translations.sql` - All homepage component translations (150+ translations)

## 🚀 Deployment Steps

### Step 1: Deploy Backend Fix (Fixes 504 Timeout)

```bash
# SSH to server
ssh your-server

# Navigate to project
cd /var/www/jelajah-warisan-nusantara

# Backup current code
git stash

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build frontend
npm run build

# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Build backend
npm run build

# Restart backend
pm2 restart backend

# Check logs
pm2 logs backend --lines 30
```

### Step 2: Add ALL Missing Translations to Aiven Database

Open **Aiven Console** → Your PostgreSQL → **Query Editor**

Run this SQL (from `database/add-all-homepage-translations.sql`):

```sql
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- AGENDA SECTION
    ('agenda', 'agenda', 'title', 'id', 'Agenda', false, NOW(), NOW()),
    ('agenda', 'agenda', 'title', 'en', 'Agenda', false, NOW(), NOW()),
    ('agenda', 'agenda', 'subtitle', 'id', 'Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia', false, NOW(), NOW()),
    ('agenda', 'agenda', 'subtitle', 'en', 'Follow various interesting activities from museums and cultural heritage sites throughout Indonesia', false, NOW(), NOW()),
    ('agenda', 'status', 'upcoming', 'id', 'Akan Datang', false, NOW(), NOW()),
    ('agenda', 'status', 'upcoming', 'en', 'Upcoming', false, NOW(), NOW()),
    ('agenda', 'status', 'ongoing', 'id', 'Berlangsung', false, NOW(), NOW()),
    ('agenda', 'status', 'ongoing', 'en', 'Ongoing', false, NOW(), NOW()),
    ('agenda', 'status', 'registration', 'id', 'Pendaftaran', false, NOW(), NOW()),
    ('agenda', 'status', 'registration', 'en', 'Registration', false, NOW(), NOW()),
    ('agenda', 'status', 'finished', 'id', 'Selesai', false, NOW(), NOW()),
    ('agenda', 'status', 'finished', 'en', 'Finished', false, NOW(), NOW()),
    ('agenda', 'button', 'detail', 'id', 'Detail Event', false, NOW(), NOW()),
    ('agenda', 'button', 'detail', 'en', 'Event Details', false, NOW(), NOW()),
    
    -- NEWS SECTION
    ('news', 'news', 'title', 'id', 'Berita & Artikel', false, NOW(), NOW()),
    ('news', 'news', 'title', 'en', 'News & Articles', false, NOW(), NOW()),
    ('news', 'news', 'subtitle', 'id', 'Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian warisan budaya Indonesia', false, NOW(), NOW()),
    ('news', 'news', 'subtitle', 'en', 'Follow the latest developments about museums, cultural heritage, and Indonesian cultural heritage preservation activities', false, NOW(), NOW()),
    ('news', 'news', 'loading', 'id', 'Memuat berita...', false, NOW(), NOW()),
    ('news', 'news', 'loading', 'en', 'Loading news...', false, NOW(), NOW()),
    ('news', 'button', 'readMore', 'id', 'Baca Selengkapnya', false, NOW(), NOW()),
    ('news', 'button', 'readMore', 'en', 'Read More', false, NOW(), NOW()),
    ('news', 'button', 'viewAll', 'id', 'Lihat Semua Berita', false, NOW(), NOW()),
    ('news', 'button', 'viewAll', 'en', 'View All News', false, NOW(), NOW()),
    
    -- PROFILE SECTION
    ('profile', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('profile', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('profile', 'profile', 'description', 'en', 'Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesian cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('profile', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('profile', 'profile', 'vision', 'en', 'Vision', false, NOW(), NOW()),
    ('profile', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('profile', 'profile', 'mission', 'en', 'Mission', false, NOW(), NOW()),
    ('profile', 'profile', 'aboutUs', 'id', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'aboutUs', 'en', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'contact', 'id', 'Contact', false, NOW(), NOW()),
    ('profile', 'profile', 'contact', 'en', 'Contact', false, NOW(), NOW()),
    ('profile', 'contact', 'address', 'id', 'Address', false, NOW(), NOW()),
    ('profile', 'contact', 'address', 'en', 'Address', false, NOW(), NOW()),
    ('profile', 'contact', 'phone', 'id', 'Phone', false, NOW(), NOW()),
    ('profile', 'contact', 'phone', 'en', 'Phone', false, NOW(), NOW()),
    ('profile', 'contact', 'whatsapp', 'id', 'WhatsApp', false, NOW(), NOW()),
    ('profile', 'contact', 'whatsapp', 'en', 'WhatsApp', false, NOW(), NOW()),
    ('profile', 'contact', 'email', 'id', 'Email', false, NOW(), NOW()),
    ('profile', 'contact', 'email', 'en', 'Email', false, NOW(), NOW()),
    ('profile', 'contact', 'website', 'id', 'Website', false, NOW(), NOW()),
    ('profile', 'contact', 'website', 'en', 'Website', false, NOW(), NOW()),
    
    -- HERITAGE PAGE
    ('heritage', 'heritage', 'title', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('heritage', 'heritage', 'title', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('heritage', 'heritage', 'subtitle', 'id', 'Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional', false, NOW(), NOW()),
    ('heritage', 'heritage', 'subtitle', 'en', 'Preservation and protection of historical sites and national cultural heritage', false, NOW(), NOW()),
    ('filter', 'heritage', 'search', 'id', 'Cari cagar budaya...', false, NOW(), NOW()),
    ('filter', 'heritage', 'search', 'en', 'Search heritage sites...', false, NOW(), NOW()),
    
    -- MUSEUM PAGE
    ('filter', 'museum', 'search', 'id', 'Cari museum...', false, NOW(), NOW()),
    ('filter', 'museum', 'search', 'en', 'Search museums...', false, NOW(), NOW())
    
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();
```

**Note:** See `database/add-all-homepage-translations.sql` for the complete SQL with 150+ translations.

### Step 3: Restart Backend to Clear Cache

```bash
pm2 restart backend
pm2 logs backend --lines 20
```

### Step 4: Clear Browser Cache

Users need to clear their browser cache or do a hard refresh:
- Chrome/Edge: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

## ✅ Testing Checklist

### Homepage Tests
- [ ] **Agenda Section**
  - [ ] Title shows "Agenda" (not `agenda.title`)
  - [ ] Event status shows "Akan Datang", "Berlangsung", etc. (not hardcoded)
  - [ ] "Detail Event" button shows proper text
  - [ ] Switch to English: Shows "Upcoming", "Ongoing", "Event Details"

- [ ] **News Section**
  - [ ] Title shows "Berita & Artikel" (not `news.news.title`)
  - [ ] "Baca Selengkapnya" button shows proper text
  - [ ] "Lihat Semua Berita" button shows proper text
  - [ ] Switch to English: Shows "News & Articles", "Read More", "View All News"

- [ ] **Profile Section**
  - [ ] Title shows "Tentang Kami" (not `profile.title`)
  - [ ] "Visi" and "Misi" labels show properly
  - [ ] "About Us" and "Contact" sections show proper labels
  - [ ] Contact fields show "Address", "Phone", "Email", "Website"
  - [ ] Switch to English: All labels translate properly

### Heritage Page Tests
- [ ] Navigate to `/heritage`
- [ ] Title shows "Cagar Budaya" (not `heritage.title`)
- [ ] Subtitle shows proper text (not `heritage.subtitle`)
- [ ] Search placeholder shows "Cari cagar budaya..." (not `filter.heritage.search`)
- [ ] Page loads in < 2 seconds (no 504 timeout)
- [ ] Heritage cards display properly
- [ ] Switch to English: Shows "Cultural Heritage", proper subtitle, "Search heritage sites..."

### Museum Page Tests
- [ ] Navigate to `/museums`
- [ ] Page loads in < 2 seconds (no 504 timeout)
- [ ] Search placeholder shows "Cari museum..." (not `filter.museum.search`)
- [ ] Museum cards display properly
- [ ] Switch to English: Shows "Search museums..."

### API Tests
```bash
# Test API endpoints (should be fast, no 504)
time curl https://museumcagarbudaya.kemenbud.go.id/api/heritages
time curl https://museumcagarbudaya.kemenbud.go.id/api/museums
time curl https://museumcagarbudaya.kemenbud.go.id/api/agenda_items
```

All should respond in < 2 seconds ✅

## 📊 Expected Results

### Before Deployment:
- ❌ API endpoints: 60+ seconds (504 timeout)
- ❌ Homepage: Shows translation variables (`profile.title`, `agenda.title`)
- ❌ Heritage page: Shows translation variables, 504 timeout
- ❌ Hardcoded text: Not translatable

### After Deployment:
- ✅ API endpoints: < 1 second
- ✅ Homepage: Shows proper text in Indonesian/English
- ✅ Heritage page: Shows proper text, loads fast
- ✅ All text: Fully translatable via language switcher

## 🔧 Troubleshooting

### Issue: Still showing translation variables after deployment

**Solution 1:** Clear translation cache
```bash
pm2 restart backend
```

**Solution 2:** Check if SQL was executed successfully
```sql
SELECT COUNT(*) FROM translations WHERE module IN ('agenda', 'news', 'profile', 'heritage');
```
Should return > 50 rows.

**Solution 3:** Clear browser cache completely
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

### Issue: Still getting 504 timeouts

**Check 1:** Verify middleware is disabled
```bash
cat backend/src/routes/api.ts | grep translateResponse
```
Should show commented lines.

**Check 2:** Verify backend was rebuilt
```bash
pm2 logs backend | grep "Server running"
```

**Check 3:** Check for errors
```bash
pm2 logs backend --lines 100 --err
```

## 📁 Complete File List

### Modified Files:
1. `backend/src/routes/api.ts` - Disabled middleware
2. `src/components/AgendaSection.tsx` - Added translations
3. `src/components/NewsSection.tsx` - Added translations
4. `src/components/ProfileSection.tsx` - Added translations

### SQL Files:
5. `database/add-heritage-translations.sql` - Heritage/Museum translations
6. `database/add-all-homepage-translations.sql` - All homepage translations (150+)

### Documentation:
7. `COMPLETE_TRANSLATION_DEPLOYMENT.md` - This file
8. `FINAL_SOLUTION.md` - Technical details
9. `database/aiven-fix-504-timeout.sql` - Database optimization queries

## 🎯 Quick Deploy Command

```bash
cd /var/www/jelajah-warisan-nusantara && \
git pull && \
npm install && \
npm run build && \
cd backend && \
npm install && \
npm run build && \
pm2 restart backend && \
pm2 logs backend --lines 20
```

Then run the SQL in Aiven Console.

## ✅ Success Criteria

- [ ] All API endpoints respond in < 2 seconds
- [ ] No 504 timeout errors
- [ ] Homepage shows proper Indonesian text
- [ ] Language switcher works (ID ↔ EN)
- [ ] Heritage page shows "Cagar Budaya" (not `heritage.title`)
- [ ] Museum page search shows "Cari museum..." (not `filter.museum.search`)
- [ ] All hardcoded text is now translatable

---

**Ready to deploy!** 🚀

Follow the steps above in order, and your translation system will be fully functional.
