# Detailed Translation Audit Report

## Component-by-Component Analysis

This document provides a detailed audit of every component, identifying hardcoded text that needs to be translated.

---

## 🔴 HIGH PRIORITY - User-Facing Components

### 1. Contact Section
**File**: `src/components/contact/ContactSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Hubungi Kami"
❌ "Kami siap membantu Anda dengan pertanyaan, saran, atau informasi lebih lanjut tentang museum dan cagar budaya Indonesia."
❌ "Informasi Kontak"
❌ "Alamat Kantor"
❌ "Jl. Medan Merdeka Barat No. 12"
❌ "Jakarta Pusat 10110"
❌ "DKI Jakarta, Indonesia"
❌ "Whatsapp"
❌ "Email"
❌ "Jam Operasional"
❌ "Senin - Kamis: 07:30 - 16:00 WIB"
❌ "Jumat: 07:30 - 16:30 WIB"
❌ "Sabtu, Minggu & Hari Libur Nasional: Tutup"
❌ "Media Sosial"
❌ "Kirim Pesan"
❌ "Sampaikan pertanyaan atau saran Anda kepada kami"
❌ "Nama Lengkap"
❌ "Masukkan nama lengkap"
❌ "Masukkan email"
❌ "Subjek"
❌ "Masukkan subjek pesan"
❌ "Pesan"
❌ "Tulis pesan Anda..."
❌ "Kirim Pesan"
❌ "Pertanyaan yang Sering Diajukan (FAQ)"
❌ "Temukan jawaban untuk pertanyaan umum seputar museum dan cagar budaya"
❌ "Mohon lengkapi semua field yang diperlukan"
❌ "Pesan Terkirim!"
❌ "Terima kasih! Kami akan merespons dalam 1-2 hari kerja."
❌ "Gagal mengirim pesan. Silakan coba lagi."
```

**Translation Keys Needed:**
```
contact.title
contact.subtitle
contact.infoTitle
contact.office.title
contact.office.address1
contact.office.address2
contact.office.address3
contact.whatsapp
contact.email
contact.hours.title
contact.hours.monThu
contact.hours.fri
contact.hours.weekend
contact.socialMedia
contact.form.title
contact.form.subtitle
contact.form.name
contact.form.namePlaceholder
contact.form.email
contact.form.emailPlaceholder
contact.form.subject
contact.form.subjectPlaceholder
contact.form.message
contact.form.messagePlaceholder
contact.form.submit
contact.faq.title
contact.faq.subtitle
contact.validation.required
contact.success.title
contact.success.message
contact.error.title
contact.error.message
```

---

### 2. PPID Section
**File**: `src/components/ppid/PPIDSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Pejabat Pengelola Informasi dan Dokumentasi (PPID)"
❌ "Keberadaan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Museum dan Cagar Budaya merupakan bagian dari pelaksanaan amanat Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik (UU KIP). Unit ini berfungsi sebagai perpanjangan tangan PPID Kementerian Kebudayaan dalam memberikan layanan informasi publik kepada masyarakat."
❌ "Informasi Berkala"
❌ "Informasi yang wajib disediakan dan diumumkan secara berkala"
❌ "Laporan keuangan tahunan", "Laporan kinerja", "Profil institusi", "Struktur organisasi"
❌ "Dipublikasi setiap 6 bulan"
❌ "Informasi Serta Merta"
❌ "Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum"
❌ "Informasi darurat", "Kebijakan mendadak", "Pengumuman penting", "Status layanan"
❌ "Dipublikasi segera"
❌ "Informasi Setiap Saat"
❌ "Informasi yang wajib disediakan dan diumumkan setiap saat"
❌ "Daftar informasi publik", "Hasil keputusan", "Kebijakan dan regulasi", "SOP layanan"
❌ "Tersedia setiap saat"
❌ "Ketentuan Pemohon Informasi Publik"
❌ "Pengajuan atas Perseorangan"
❌ "Apabila pemohon mengatasnamakan perseorangan wajib menyertakan fotokopi/scan KTP atau identitas lainnya yang masih berlaku (Paspor/SIM)."
❌ "Pengajuan atas Badan Hukum"
❌ "Apabila pemohon mengatasnamakan badan hukum Indonesia (organisasi masyarakat/lembaga swadaya masyarakat, organisasi politik, yayasan, dan perusahaan), wajib menyertakan fotokopi/scan akte pendirian badan hukum, surat kuasa dari badan hukum yang bermaterai, dan fotokopi/scan KTP atas nama pemohon/penerima kuasa."
❌ "Waktu penyampaian Informasi"
❌ "Berdasarkan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik, jangka waktu pemenuhan permintaan informasi publik yaitu selama 10 hari kerja terhitung diterimanya dokumen permintaan informasi publik yang lengkap dan dapat ditambah 7 hari kerja jika diperlukan."
❌ "Ketentuan Biaya"
❌ "Permintaan informasi publik ini tidak dipungut biaya (gratis), namun jika ada dokumen/informasi yang harus difotokopi dan atau digandakan maka biaya dibebankan kepada Pemohon."
❌ "Prosedur Permohonan Informasi"
❌ "Langkah-langkah untuk mengajukan permohonan informasi publik"
❌ "Pengajuan Permohonan"
❌ "Ajukan permohonan informasi melalui formulir atau surat resmi"
❌ "1 hari"
❌ "Registrasi & Verifikasi"
❌ "Petugas PPID melakukan registrasi dan verifikasi kelengkapan"
❌ "2 hari"
❌ "Penelusuran Informasi"
❌ "Tim melakukan penelusuran dan klasifikasi informasi yang diminta"
❌ "7 hari"
❌ "Keputusan & Penyampaian"
❌ "Keputusan disampaikan beserta informasi atau alasan penolakan"
❌ "3 hari"
❌ "💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP"
❌ "Kontak PPID"
❌ "+62 812 9595 3929"
❌ "Telepon"
❌ "museumcb@kemenbud.go.id"
❌ "Senin - Jumat: 08:00 - 16:00 WIB"
❌ "Jam Layanan"
❌ "Komitmen Pelayanan"
❌ "Kami berkomitmen untuk memberikan pelayanan informasi publik yang cepat, akurat, dan transparan kepada seluruh masyarakat Indonesia sesuai dengan prinsip keterbukaan informasi publik."
❌ "24 Jam"
❌ "Respon Awal"
❌ "13 Hari"
❌ "Maksimal Layanan"
❌ "100%"
❌ "Transparan"
```

**Translation Keys Needed:**
```
ppid.title
ppid.subtitle
ppid.description
ppid.informationTypes.periodic.title
ppid.informationTypes.periodic.description
ppid.informationTypes.periodic.examples.financial
ppid.informationTypes.periodic.examples.performance
ppid.informationTypes.periodic.examples.profile
ppid.informationTypes.periodic.examples.structure
ppid.informationTypes.periodic.timeline
ppid.informationTypes.immediate.title
ppid.informationTypes.immediate.description
ppid.informationTypes.immediate.examples.emergency
ppid.informationTypes.immediate.examples.policy
ppid.informationTypes.immediate.examples.announcement
ppid.informationTypes.immediate.examples.status
ppid.informationTypes.immediate.timeline
ppid.informationTypes.anytime.title
ppid.informationTypes.anytime.description
ppid.informationTypes.anytime.examples.list
ppid.informationTypes.anytime.examples.decisions
ppid.informationTypes.anytime.examples.policies
ppid.informationTypes.anytime.examples.sop
ppid.informationTypes.anytime.timeline
ppid.criteria.title
ppid.criteria.individual.title
ppid.criteria.individual.description
ppid.criteria.legal.title
ppid.criteria.legal.description
ppid.criteria.time.title
ppid.criteria.time.description
ppid.criteria.cost.title
ppid.criteria.cost.description
ppid.procedure.title
ppid.procedure.subtitle
ppid.procedure.step1.title
ppid.procedure.step1.description
ppid.procedure.step1.duration
ppid.procedure.step2.title
ppid.procedure.step2.description
ppid.procedure.step2.duration
ppid.procedure.step3.title
ppid.procedure.step3.description
ppid.procedure.step3.duration
ppid.procedure.step4.title
ppid.procedure.step4.description
ppid.procedure.step4.duration
ppid.procedure.totalTime
ppid.contact.title
ppid.contact.phone
ppid.contact.phoneNumber
ppid.contact.email
ppid.contact.emailAddress
ppid.contact.hours
ppid.contact.hoursText
ppid.commitment.title
ppid.commitment.description
ppid.commitment.response
ppid.commitment.service
ppid.commitment.transparency
```

---

### 3. Footer
**File**: `src/components/Footer.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Kementerian Kebudayaan Republik Indonesia"
❌ "Kontak Kami"
❌ "Beranda", "Agenda", "Tentang Kami", "Struktur Organisasi", "Laboratorium Konservasi", "Berita & Publikasi", "Hubungi Kami", "Karir", "PPID", "Prosedur Operasional Standar", "Pengaturan"
```

**Translation Keys Needed:**
```
footer.ministry
footer.contactUs
footer.links.home
footer.links.agenda
footer.links.about
footer.links.structure
footer.links.conservation
footer.links.news
footer.links.contact
footer.links.career
footer.links.ppid
footer.links.sop
footer.links.settings
```

---

### 4. Conservation Section
**File**: `src/components/layanan-konservasi/ConservationSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Laboratorium Konservasi"
❌ (Description text - need to check file)
```

**Translation Keys Needed:**
```
conservation.title
conservation.subtitle
conservation.description
conservation.services.title
conservation.gallery.title
```

---

### 5. News/Media Sections
**File**: `src/components/media/NewsListSection.tsx`
**File**: `src/components/media/PublicationSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Tidak ada artikel ditemukan"
❌ "Halaman"
❌ "Ukuran"
❌ "Download"
```

**Translation Keys Needed:**
```
media.noArticles
media.tryDifferentSearch
media.pages
media.size
media.downloads
```

---

### 6. SOP Section
**File**: `src/components/sop/StandardOperatingProcedureSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Tidak ada artikel ditemukan"
```

**Translation Keys Needed:**
```
sop.noArticles
sop.title
sop.subtitle
```

---

### 7. Peraturan Section
**File**: `src/components/peraturan/PeraturanSection.tsx`

**Hardcoded Text Found:**
```typescript
❌ "Tidak ada artikel ditemukan"
```

**Translation Keys Needed:**
```
peraturan.noArticles
peraturan.title
peraturan.subtitle
```

---

## 🟡 MEDIUM PRIORITY - About/Info Components

### 8. Company Profile
**File**: `src/components/about/CompanyProfile.tsx`

**Status**: Need to check - likely has hardcoded content

**Translation Keys Needed:**
```
about.profile.title
about.profile.subtitle
about.profile.history.title
about.profile.history.text1
about.profile.history.text2
about.profile.commitment.title
about.profile.commitment.text
about.profile.highlights.institution.title
about.profile.highlights.institution.description
about.profile.highlights.team.title
about.profile.highlights.team.description
about.profile.highlights.mission.title
about.profile.highlights.mission.description
about.profile.highlights.recognition.title
about.profile.highlights.recognition.description
```

---

### 9. Services
**File**: `src/components/about/Services.tsx`

**Status**: Need to check - likely has hardcoded content

**Translation Keys Needed:**
```
about.services.title
about.services.subtitle
about.services.heritage.title
about.services.heritage.description
about.services.heritage.features
about.services.museum.title
about.services.museum.description
about.services.museum.features
about.services.research.title
about.services.research.description
about.services.research.features
about.services.international.title
about.services.international.description
about.services.international.features
about.services.digitization.title
about.services.digitization.description
about.services.digitization.features
about.services.education.title
about.services.education.description
about.services.education.features
about.services.consultation.title
about.services.consultation.text
about.services.consultation.button
```

---

### 10. Rules and SOP
**File**: `src/components/about/RulesAndSOP.tsx`

**Status**: Need to check - likely has hardcoded content

**Translation Keys Needed:**
```
about.rules.title
about.rules.subtitle
about.rules.regulationsTitle
about.rules.sopTitle
about.rules.needHelpTitle
about.rules.needHelpText
about.rules.needHelpButton
about.rules.regulations[].title
about.rules.regulations[].description
about.rules.regulations[].type
about.rules.procedures[].title
about.rules.procedures[].description
```

---

### 11. Career/Internship Section
**File**: `src/components/career/InternshipSection.tsx`

**Status**: Need to check - likely has hardcoded content

**Translation Keys Needed:**
```
career.title
career.subtitle
career.programs.title
career.programs.items[].title
career.programs.items[].department
career.programs.items[].duration
career.programs.items[].description
career.benefits.title
career.benefits.items[]
career.process.title
career.process.steps[].title
career.process.steps[].description
career.contact.title
career.contact.description
career.contact.button
```

---

## 🟢 LOW PRIORITY - Admin Components

### 12. Admin Sidebar
**File**: `src/components/admin/AdminSidebar.tsx`

**Hardcoded Text Found:**
```typescript
❌ Various admin menu items in English/Indonesian mix
```

**Translation Keys Needed:**
```
admin.nav.dashboard
admin.nav.content
admin.nav.users
admin.nav.settings
admin.nav.translations
admin.nav.media
admin.nav.museums
admin.nav.collections
admin.nav.events
admin.nav.career
admin.nav.faqs
admin.nav.sop
```

---

### 13. Various Admin Management Components

**Files:**
- `ActivityLogManagement.tsx`
- `AgendaManagement.tsx`
- `BannerManagement.tsx`
- `CareerManagement.tsx`
- `ContentManagement.tsx`
- `EventManagement.tsx`
- `FAQManagement.tsx`
- `MediaManagement.tsx`
- `MuseumManagement.tsx`
- `SOPManagement.tsx`
- `UserManagement.tsx`

**Common Hardcoded Text:**
```typescript
❌ Table headers (English)
❌ Button labels (English)
❌ Form labels (English)
❌ Status messages (English)
❌ Validation messages (English)
```

**Translation Keys Needed:**
```
admin.table.actions
admin.table.edit
admin.table.delete
admin.table.view
admin.table.approve
admin.table.reject
admin.form.title
admin.form.description
admin.form.image
admin.form.date
admin.form.status
admin.form.save
admin.form.cancel
admin.status.published
admin.status.draft
admin.status.pending
admin.status.approved
admin.status.rejected
admin.messages.saveSuccess
admin.messages.deleteSuccess
admin.messages.error
admin.messages.confirmDelete
```

---

## 📊 Summary Statistics

### Components Audited: 58
### Components with Hardcoded Text: 45+
### Translation Keys Needed: 500+

### Priority Breakdown:
- 🔴 **High Priority**: 10 components (user-facing)
- 🟡 **Medium Priority**: 8 components (about/info pages)
- 🟢 **Low Priority**: 27+ components (admin interface)

---

## 🎯 Recommended Action Items

### Immediate (Week 1)
1. ✅ Switch `main.tsx` to use `index-dynamic.ts`
2. ✅ Add all high-priority translation keys to database
3. ✅ Update Contact, PPID, and Footer components

### Short-term (Week 2-3)
4. ✅ Add medium-priority translation keys
5. ✅ Update About, Career, and Media components
6. ✅ Implement database content translation

### Long-term (Week 4+)
7. ✅ Add admin interface translations
8. ✅ Update all admin components
9. ✅ Create translation coverage monitoring

---

## 🔍 Detection Method

To find hardcoded text in components, use this regex pattern:

```regex
// Find hardcoded Indonesian text
>[A-Z][a-zA-Z\s]{5,}<

// Find hardcoded strings in JSX
["'][A-Z][a-zA-Z\s]{3,}["']

// Find text not using t() function
(?<!t\()['"](Hubungi|Kontak|Informasi|Tentang|Layanan)[^'"]*['"]
```

---

## 📝 Component Update Template

### Before:
```typescript
<h2>Hubungi Kami</h2>
<p>Kami siap membantu Anda</p>
```

### After:
```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <h2>{t('contact.title')}</h2>
      <p>{t('contact.subtitle')}</p>
    </>
  );
};
```

---

*Last Updated: 2025*
*Audit Version: 1.0*
