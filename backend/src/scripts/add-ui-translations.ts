import pool from '../config/database';
import translationService from '../services/translationService';

/**
 * Script to add all missing UI translation keys to the database
 * This includes all hardcoded text found in the audit
 */

interface TranslationKey {
  key: string;
  indonesianText: string;
  page: string;
}

const uiTranslations: TranslationKey[] = [
  // Contact Section
  { key: 'contact.title', indonesianText: 'Hubungi Kami', page: 'contact' },
  { key: 'contact.subtitle', indonesianText: 'Kami siap membantu Anda dengan pertanyaan, saran, atau informasi lebih lanjut tentang museum dan cagar budaya Indonesia.', page: 'contact' },
  { key: 'contact.infoTitle', indonesianText: 'Informasi Kontak', page: 'contact' },
  { key: 'contact.office.title', indonesianText: 'Alamat Kantor', page: 'contact' },
  { key: 'contact.office.address1', indonesianText: 'Jl. Medan Merdeka Barat No. 12', page: 'contact' },
  { key: 'contact.office.address2', indonesianText: 'Jakarta Pusat 10110', page: 'contact' },
  { key: 'contact.office.address3', indonesianText: 'DKI Jakarta, Indonesia', page: 'contact' },
  { key: 'contact.whatsapp', indonesianText: 'Whatsapp', page: 'contact' },
  { key: 'contact.email', indonesianText: 'Email', page: 'contact' },
  { key: 'contact.hours.title', indonesianText: 'Jam Operasional', page: 'contact' },
  { key: 'contact.hours.monThu', indonesianText: 'Senin - Kamis: 07:30 - 16:00 WIB', page: 'contact' },
  { key: 'contact.hours.fri', indonesianText: 'Jumat: 07:30 - 16:30 WIB', page: 'contact' },
  { key: 'contact.hours.weekend', indonesianText: 'Sabtu, Minggu & Hari Libur Nasional: Tutup', page: 'contact' },
  { key: 'contact.socialMedia', indonesianText: 'Media Sosial', page: 'contact' },
  { key: 'contact.form.title', indonesianText: 'Kirim Pesan', page: 'contact' },
  { key: 'contact.form.subtitle', indonesianText: 'Sampaikan pertanyaan atau saran Anda kepada kami', page: 'contact' },
  { key: 'contact.form.name', indonesianText: 'Nama Lengkap', page: 'contact' },
  { key: 'contact.form.namePlaceholder', indonesianText: 'Masukkan nama lengkap', page: 'contact' },
  { key: 'contact.form.email', indonesianText: 'Email', page: 'contact' },
  { key: 'contact.form.emailPlaceholder', indonesianText: 'Masukkan email', page: 'contact' },
  { key: 'contact.form.subject', indonesianText: 'Subjek', page: 'contact' },
  { key: 'contact.form.subjectPlaceholder', indonesianText: 'Masukkan subjek pesan', page: 'contact' },
  { key: 'contact.form.message', indonesianText: 'Pesan', page: 'contact' },
  { key: 'contact.form.messagePlaceholder', indonesianText: 'Tulis pesan Anda...', page: 'contact' },
  { key: 'contact.form.submit', indonesianText: 'Kirim Pesan', page: 'contact' },
  { key: 'contact.faq.title', indonesianText: 'Pertanyaan yang Sering Diajukan (FAQ)', page: 'contact' },
  { key: 'contact.faq.subtitle', indonesianText: 'Temukan jawaban untuk pertanyaan umum seputar museum dan cagar budaya', page: 'contact' },
  { key: 'contact.validation.required', indonesianText: 'Mohon lengkapi semua field yang diperlukan', page: 'contact' },
  { key: 'contact.success.title', indonesianText: 'Pesan Terkirim!', page: 'contact' },
  { key: 'contact.success.message', indonesianText: 'Terima kasih! Kami akan merespons dalam 1-2 hari kerja.', page: 'contact' },
  { key: 'contact.error.title', indonesianText: 'Error', page: 'contact' },
  { key: 'contact.error.message', indonesianText: 'Gagal mengirim pesan. Silakan coba lagi.', page: 'contact' },

  // PPID Section
  { key: 'ppid.title', indonesianText: 'Pejabat Pengelola Informasi dan Dokumentasi (PPID)', page: 'ppid' },
  { key: 'ppid.subtitle', indonesianText: 'Pelayanan informasi publik yang transparan dan akuntabel sesuai dengan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.', page: 'ppid' },
  { key: 'ppid.description', indonesianText: 'Keberadaan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Museum dan Cagar Budaya merupakan bagian dari pelaksanaan amanat Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik (UU KIP). Unit ini berfungsi sebagai perpanjangan tangan PPID Kementerian Kebudayaan dalam memberikan layanan informasi publik kepada masyarakat.', page: 'ppid' },
  
  // PPID Information Types
  { key: 'ppid.informationTypes.periodic.title', indonesianText: 'Informasi Berkala', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.description', indonesianText: 'Informasi yang wajib disediakan dan diumumkan secara berkala', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.timeline', indonesianText: 'Dipublikasi setiap 6 bulan', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.examples.financial', indonesianText: 'Laporan keuangan tahunan', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.examples.performance', indonesianText: 'Laporan kinerja', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.examples.profile', indonesianText: 'Profil institusi', page: 'ppid' },
  { key: 'ppid.informationTypes.periodic.examples.structure', indonesianText: 'Struktur organisasi', page: 'ppid' },
  
  { key: 'ppid.informationTypes.immediate.title', indonesianText: 'Informasi Serta Merta', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.description', indonesianText: 'Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.timeline', indonesianText: 'Dipublikasi segera', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.examples.emergency', indonesianText: 'Informasi darurat', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.examples.policy', indonesianText: 'Kebijakan mendadak', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.examples.announcement', indonesianText: 'Pengumuman penting', page: 'ppid' },
  { key: 'ppid.informationTypes.immediate.examples.status', indonesianText: 'Status layanan', page: 'ppid' },
  
  { key: 'ppid.informationTypes.anytime.title', indonesianText: 'Informasi Setiap Saat', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.description', indonesianText: 'Informasi yang wajib disediakan dan diumumkan setiap saat', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.timeline', indonesianText: 'Tersedia setiap saat', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.examples.list', indonesianText: 'Daftar informasi publik', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.examples.decisions', indonesianText: 'Hasil keputusan', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.examples.policies', indonesianText: 'Kebijakan dan regulasi', page: 'ppid' },
  { key: 'ppid.informationTypes.anytime.examples.sop', indonesianText: 'SOP layanan', page: 'ppid' },

  // PPID Criteria
  { key: 'ppid.criteria.title', indonesianText: 'Ketentuan Pemohon Informasi Publik', page: 'ppid' },
  { key: 'ppid.criteria.individual.title', indonesianText: 'Pengajuan atas Perseorangan', page: 'ppid' },
  { key: 'ppid.criteria.individual.description', indonesianText: 'Apabila pemohon mengatasnamakan perseorangan wajib menyertakan fotokopi/scan KTP atau identitas lainnya yang masih berlaku (Paspor/SIM).', page: 'ppid' },
  { key: 'ppid.criteria.legal.title', indonesianText: 'Pengajuan atas Badan Hukum', page: 'ppid' },
  { key: 'ppid.criteria.legal.description', indonesianText: 'Apabila pemohon mengatasnamakan badan hukum Indonesia (organisasi masyarakat/lembaga swadaya masyarakat, organisasi politik, yayasan, dan perusahaan), wajib menyertakan fotokopi/scan akte pendirian badan hukum, surat kuasa dari badan hukum yang bermaterai, dan fotokopi/scan KTP atas nama pemohon/penerima kuasa.', page: 'ppid' },
  { key: 'ppid.criteria.time.title', indonesianText: 'Waktu penyampaian Informasi', page: 'ppid' },
  { key: 'ppid.criteria.time.description', indonesianText: 'Berdasarkan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik, jangka waktu pemenuhan permintaan informasi publik yaitu selama 10 hari kerja terhitung diterimanya dokumen permintaan informasi publik yang lengkap dan dapat ditambah 7 hari kerja jika diperlukan.', page: 'ppid' },
  { key: 'ppid.criteria.cost.title', indonesianText: 'Ketentuan Biaya', page: 'ppid' },
  { key: 'ppid.criteria.cost.description', indonesianText: 'Permintaan informasi publik ini tidak dipungut biaya (gratis), namun jika ada dokumen/informasi yang harus difotokopi dan atau digandakan maka biaya dibebankan kepada Pemohon.', page: 'ppid' },

  // PPID Procedure
  { key: 'ppid.procedure.title', indonesianText: 'Prosedur Permohonan Informasi', page: 'ppid' },
  { key: 'ppid.procedure.subtitle', indonesianText: 'Langkah-langkah untuk mengajukan permohonan informasi publik', page: 'ppid' },
  { key: 'ppid.procedure.totalTime', indonesianText: '💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP', page: 'ppid' },
  { key: 'ppid.procedure.step1.title', indonesianText: 'Pengajuan Permohonan', page: 'ppid' },
  { key: 'ppid.procedure.step1.description', indonesianText: 'Ajukan permohonan informasi melalui formulir atau surat resmi', page: 'ppid' },
  { key: 'ppid.procedure.step1.duration', indonesianText: '1 hari', page: 'ppid' },
  { key: 'ppid.procedure.step2.title', indonesianText: 'Registrasi & Verifikasi', page: 'ppid' },
  { key: 'ppid.procedure.step2.description', indonesianText: 'Petugas PPID melakukan registrasi dan verifikasi kelengkapan', page: 'ppid' },
  { key: 'ppid.procedure.step2.duration', indonesianText: '2 hari', page: 'ppid' },
  { key: 'ppid.procedure.step3.title', indonesianText: 'Penelusuran Informasi', page: 'ppid' },
  { key: 'ppid.procedure.step3.description', indonesianText: 'Tim melakukan penelusuran dan klasifikasi informasi yang diminta', page: 'ppid' },
  { key: 'ppid.procedure.step3.duration', indonesianText: '7 hari', page: 'ppid' },
  { key: 'ppid.procedure.step4.title', indonesianText: 'Keputusan & Penyampaian', page: 'ppid' },
  { key: 'ppid.procedure.step4.description', indonesianText: 'Keputusan disampaikan beserta informasi atau alasan penolakan', page: 'ppid' },
  { key: 'ppid.procedure.step4.duration', indonesianText: '3 hari', page: 'ppid' },

  // PPID Contact
  { key: 'ppid.contact.title', indonesianText: 'Kontak PPID', page: 'ppid' },
  { key: 'ppid.contact.phone', indonesianText: 'Telepon', page: 'ppid' },
  { key: 'ppid.contact.phoneNumber', indonesianText: '+62 812 9595 3929', page: 'ppid' },
  { key: 'ppid.contact.email', indonesianText: 'Email', page: 'ppid' },
  { key: 'ppid.contact.emailAddress', indonesianText: 'museumcb@kemenbud.go.id', page: 'ppid' },
  { key: 'ppid.contact.hours', indonesianText: 'Jam Layanan', page: 'ppid' },
  { key: 'ppid.contact.hoursText', indonesianText: 'Senin - Jumat: 08:00 - 16:00 WIB', page: 'ppid' },

  // PPID Commitment
  { key: 'ppid.commitment.title', indonesianText: 'Komitmen Pelayanan', page: 'ppid' },
  { key: 'ppid.commitment.description', indonesianText: 'Kami berkomitmen untuk memberikan pelayanan informasi publik yang cepat, akurat, dan transparan kepada seluruh masyarakat Indonesia sesuai dengan prinsip keterbukaan informasi publik.', page: 'ppid' },
  { key: 'ppid.commitment.response', indonesianText: '24 Jam', page: 'ppid' },
  { key: 'ppid.commitment.responseLabel', indonesianText: 'Respon Awal', page: 'ppid' },
  { key: 'ppid.commitment.service', indonesianText: '13 Hari', page: 'ppid' },
  { key: 'ppid.commitment.serviceLabel', indonesianText: 'Maksimal Layanan', page: 'ppid' },
  { key: 'ppid.commitment.transparency', indonesianText: '100%', page: 'ppid' },
  { key: 'ppid.commitment.transparencyLabel', indonesianText: 'Transparan', page: 'ppid' },

  // Footer
  { key: 'footer.ministry', indonesianText: 'Kementerian Kebudayaan Republik Indonesia', page: 'footer' },
  { key: 'footer.contactUs', indonesianText: 'Kontak Kami', page: 'footer' },

  // Media
  { key: 'media.noArticles', indonesianText: 'Tidak ada artikel ditemukan', page: 'media' },
  { key: 'media.tryDifferentSearch', indonesianText: 'Coba kata kunci pencarian yang berbeda', page: 'media' },
  { key: 'media.pages', indonesianText: 'Halaman', page: 'media' },
  { key: 'media.size', indonesianText: 'Ukuran', page: 'media' },
  { key: 'media.downloads', indonesianText: 'Download', page: 'media' },

  // Conservation
  { key: 'conservation.title', indonesianText: 'Laboratorium Konservasi', page: 'conservation' },
  { key: 'conservation.subtitle', indonesianText: 'Pelestarian dan Perawatan Warisan Budaya', page: 'conservation' },

  // SOP
  { key: 'sop.noArticles', indonesianText: 'Tidak ada artikel ditemukan', page: 'sop' },
  { key: 'sop.title', indonesianText: 'Prosedur Operasional Standar', page: 'sop' },

  // Peraturan
  { key: 'peraturan.noArticles', indonesianText: 'Tidak ada artikel ditemukan', page: 'peraturan' },
  { key: 'peraturan.title', indonesianText: 'Peraturan', page: 'peraturan' },

  // Common Messages
  { key: 'messages.loading', indonesianText: 'Memuat...', page: 'common' },
  { key: 'messages.noData', indonesianText: 'Tidak ada data', page: 'common' },
  { key: 'messages.error', indonesianText: 'Terjadi kesalahan', page: 'common' },
  { key: 'messages.success', indonesianText: 'Berhasil', page: 'common' },
];

async function addUITranslations() {
  console.log('🚀 Starting UI translations migration...');
  console.log(`📊 Total translations to add: ${uiTranslations.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const translation of uiTranslations) {
    try {
      // Insert Indonesian (source language)
      await pool.query(`
        INSERT INTO translations (module, page, key, language_code, text, auto_translated)
        VALUES ('translation', $1, $2, 'id', $3, false)
        ON CONFLICT (module, page, key, language_code) 
        DO UPDATE SET text = EXCLUDED.text, last_updated = NOW()
      `, [translation.page, translation.key, translation.indonesianText]);

      console.log(`✅ Added Indonesian: ${translation.key}`);

      // Auto-translate to English
      const englishTranslation = await translationService.translate(
        translation.indonesianText,
        'en',
        'id'
      );

      if (englishTranslation.success) {
        await pool.query(`
          INSERT INTO translations (module, page, key, language_code, text, auto_translated)
          VALUES ('translation', $1, $2, 'en', $3, true)
          ON CONFLICT (module, page, key, language_code) 
          DO UPDATE SET text = EXCLUDED.text, last_updated = NOW()
        `, [translation.page, translation.key, englishTranslation.translatedText]);

        console.log(`✅ Added English: ${translation.key} -> ${englishTranslation.translatedText}`);
        successCount++;
      } else {
        console.warn(`⚠️  Translation failed for ${translation.key}: ${englishTranslation.error}`);
        errorCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error adding translation ${translation.key}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${uiTranslations.length}`);
  console.log('\n✨ UI translations migration complete!');
}

// Run the script
addUITranslations()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
