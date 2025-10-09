import pool from '../config/database';
import translationService from '../services/translationService';

/**
 * Comprehensive UI Translations Migration
 * Adds all missing translation keys for the entire application
 */

const allTranslations = {
  // Museum Page
  'museum.pageTitle': 'Museum dan Cagar Budaya',
  'museum.search.placeholder': 'Cari museum berdasarkan nama atau lokasi...',
  'museum.filter.type': 'Filter berdasarkan tipe',
  'museum.filter.all': 'Semua Tipe',
  'museum.card.buyTicket': 'Beli Tiket',
  'museum.card.visitMuseum': 'Kunjungi Museum',
  'museum.noResults': 'Tidak ada museum yang ditemukan',
  
  // Heritage Page
  'heritage.pageTitle': 'Warisan Budaya Indonesia',
  'heritage.subtitle': 'Jelajahi kekayaan warisan budaya Indonesia',
  'heritage.search.placeholder': 'Cari warisan budaya...',
  'heritage.filter.category': 'Filter berdasarkan kategori',
  'heritage.filter.location': 'Filter berdasarkan lokasi',
  'heritage.card.viewDetails': 'Lihat Detail',
  'heritage.noResults': 'Tidak ada warisan budaya yang ditemukan',
  
  // Sites Page
  'sites.pageTitle': 'Situs Bersejarah',
  'sites.subtitle': 'Temukan situs-situs bersejarah di Indonesia',
  'sites.search.placeholder': 'Cari situs bersejarah...',
  'sites.filter.type': 'Filter berdasarkan tipe',
  'sites.filter.province': 'Filter berdasarkan provinsi',
  'sites.card.explore': 'Jelajahi Situs',
  'sites.noResults': 'Tidak ada situs yang ditemukan',
  
  // Collection Page
  'collection.pageTitle': 'Koleksi Museum',
  'collection.subtitle': 'Koleksi artefak dan benda bersejarah',
  'collection.search.placeholder': 'Cari koleksi...',
  'collection.filter.museum': 'Filter berdasarkan museum',
  'collection.filter.category': 'Filter berdasarkan kategori',
  'collection.filter.period': 'Filter berdasarkan periode',
  'collection.card.viewCollection': 'Lihat Koleksi',
  'collection.noResults': 'Tidak ada koleksi yang ditemukan',
  
  // Collection Detail
  'collectionDetail.title': 'Detail Koleksi',
  'collectionDetail.description': 'Deskripsi',
  'collectionDetail.museum': 'Museum',
  'collectionDetail.category': 'Kategori',
  'collectionDetail.period': 'Periode',
  'collectionDetail.material': 'Material',
  'collectionDetail.dimensions': 'Dimensi',
  'collectionDetail.origin': 'Asal',
  'collectionDetail.backToList': 'Kembali ke Daftar Koleksi',
  
  // Event/Agenda Page
  'event.pageTitle': 'Agenda & Kegiatan',
  'event.subtitle': 'Ikuti berbagai kegiatan dan acara budaya',
  'event.search.placeholder': 'Cari agenda atau kegiatan...',
  'event.filter.category': 'Filter berdasarkan kategori',
  'event.filter.date': 'Filter berdasarkan tanggal',
  'event.filter.location': 'Filter berdasarkan lokasi',
  'event.card.register': 'Daftar Sekarang',
  'event.card.viewDetails': 'Lihat Detail',
  'event.card.date': 'Tanggal',
  'event.card.time': 'Waktu',
  'event.card.location': 'Lokasi',
  'event.noResults': 'Tidak ada agenda yang ditemukan',
  
  // Event Detail
  'eventDetail.title': 'Detail Acara',
  'eventDetail.description': 'Deskripsi Acara',
  'eventDetail.dateTime': 'Tanggal & Waktu',
  'eventDetail.location': 'Lokasi',
  'eventDetail.organizer': 'Penyelenggara',
  'eventDetail.contact': 'Kontak',
  'eventDetail.registration': 'Pendaftaran',
  'eventDetail.share': 'Bagikan Acara',
  'eventDetail.backToList': 'Kembali ke Daftar Agenda',
  
  // Memory of World Page
  'memory.pageTitle': 'Memory of the World',
  'memory.subtitle': 'Program UNESCO untuk pelestarian warisan dokumenter',
  'memory.search.placeholder': 'Cari dokumen warisan...',
  'memory.description': 'Memory of the World adalah program UNESCO yang bertujuan untuk melestarikan warisan dokumenter dunia',
  'memory.card.viewDocument': 'Lihat Dokumen',
  'memory.noResults': 'Tidak ada dokumen yang ditemukan',
  
  // Asset Utilization Page
  'asset.pageTitle': 'Pemanfaatan Aset',
  'asset.subtitle': 'Informasi pemanfaatan aset cagar budaya',
  'asset.search.placeholder': 'Cari aset...',
  'asset.description': 'Informasi mengenai pemanfaatan aset cagar budaya untuk kepentingan publik',
  'asset.card.viewDetails': 'Lihat Detail',
  'asset.noResults': 'Tidak ada aset yang ditemukan',
  
  // Museum Detail
  'museumDetail.title': 'Detail Museum',
  'museumDetail.about': 'Tentang Museum',
  'museumDetail.collections': 'Koleksi',
  'museumDetail.facilities': 'Fasilitas',
  'museumDetail.visitInfo': 'Informasi Kunjungan',
  'museumDetail.openingHours': 'Jam Buka',
  'museumDetail.ticketPrice': 'Harga Tiket',
  'museumDetail.address': 'Alamat',
  'museumDetail.phone': 'Telepon',
  'museumDetail.email': 'Email',
  'museumDetail.website': 'Website',
  'museumDetail.directions': 'Petunjuk Arah',
  'museumDetail.backToList': 'Kembali ke Daftar Museum',
  
  // Heritage Detail
  'heritageDetail.title': 'Detail Warisan Budaya',
  'heritageDetail.description': 'Deskripsi',
  'heritageDetail.history': 'Sejarah',
  'heritageDetail.significance': 'Nilai Penting',
  'heritageDetail.location': 'Lokasi',
  'heritageDetail.category': 'Kategori',
  'heritageDetail.period': 'Periode',
  'heritageDetail.status': 'Status Perlindungan',
  'heritageDetail.gallery': 'Galeri Foto',
  'heritageDetail.backToList': 'Kembali ke Daftar Warisan',
  
  // Sites Detail
  'sitesDetail.title': 'Detail Situs',
  'sitesDetail.description': 'Deskripsi Situs',
  'sitesDetail.history': 'Sejarah',
  'sitesDetail.location': 'Lokasi',
  'sitesDetail.type': 'Tipe Situs',
  'sitesDetail.period': 'Periode',
  'sitesDetail.findings': 'Temuan',
  'sitesDetail.visitInfo': 'Informasi Kunjungan',
  'sitesDetail.backToList': 'Kembali ke Daftar Situs',
  
  // Company Profile
  'profile.pageTitle': 'Profil Perusahaan',
  'profile.vision': 'Visi',
  'profile.mission': 'Misi',
  'profile.values': 'Nilai-Nilai',
  'profile.history': 'Sejarah',
  'profile.organization': 'Struktur Organisasi',
  'profile.leadership': 'Kepemimpinan',
  
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
  'common.close': 'Tutup',
  'common.open': 'Buka',
  'common.select': 'Pilih',
  'common.selected': 'Dipilih',
  'common.clear': 'Hapus',
  'common.apply': 'Terapkan',
  'common.reset': 'Reset',
  'common.refresh': 'Muat Ulang',
  
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
  'buttons.export': 'Ekspor',
  'buttons.import': 'Impor',
  'buttons.viewMore': 'Lihat Lebih Banyak',
  'buttons.viewLess': 'Lihat Lebih Sedikit',
  
  // Filters
  'filter.sortBy': 'Urutkan Berdasarkan',
  'filter.sortBy.newest': 'Terbaru',
  'filter.sortBy.oldest': 'Terlama',
  'filter.sortBy.nameAZ': 'Nama (A-Z)',
  'filter.sortBy.nameZA': 'Nama (Z-A)',
  'filter.sortBy.popular': 'Terpopuler',
  'filter.sortBy.rating': 'Rating Tertinggi',
  'filter.showResults': 'Tampilkan Hasil',
  'filter.clearAll': 'Hapus Semua Filter',
  
  // Pagination
  'pagination.page': 'Halaman',
  'pagination.of': 'dari',
  'pagination.showing': 'Menampilkan',
  'pagination.to': 'sampai',
  'pagination.results': 'hasil',
  'pagination.perPage': 'per halaman',
  
  // Date/Time
  'date.today': 'Hari Ini',
  'date.yesterday': 'Kemarin',
  'date.tomorrow': 'Besok',
  'date.thisWeek': 'Minggu Ini',
  'date.thisMonth': 'Bulan Ini',
  'date.thisYear': 'Tahun Ini',
  'date.lastWeek': 'Minggu Lalu',
  'date.lastMonth': 'Bulan Lalu',
  'date.lastYear': 'Tahun Lalu',
  
  // Days of Week
  'days.monday': 'Senin',
  'days.tuesday': 'Selasa',
  'days.wednesday': 'Rabu',
  'days.thursday': 'Kamis',
  'days.friday': 'Jumat',
  'days.saturday': 'Sabtu',
  'days.sunday': 'Minggu',
  
  // Months
  'months.january': 'Januari',
  'months.february': 'Februari',
  'months.march': 'Maret',
  'months.april': 'April',
  'months.may': 'Mei',
  'months.june': 'Juni',
  'months.july': 'Juli',
  'months.august': 'Agustus',
  'months.september': 'September',
  'months.october': 'Oktober',
  'months.november': 'November',
  'months.december': 'Desember',
  
  // Status
  'status.active': 'Aktif',
  'status.inactive': 'Tidak Aktif',
  'status.pending': 'Menunggu',
  'status.approved': 'Disetujui',
  'status.rejected': 'Ditolak',
  'status.published': 'Dipublikasikan',
  'status.draft': 'Draft',
  'status.archived': 'Diarsipkan',
  
  // Validation Messages
  'validation.required': 'Field ini wajib diisi',
  'validation.email': 'Email tidak valid',
  'validation.phone': 'Nomor telepon tidak valid',
  'validation.url': 'URL tidak valid',
  'validation.minLength': 'Minimal {min} karakter',
  'validation.maxLength': 'Maksimal {max} karakter',
  'validation.min': 'Nilai minimal {min}',
  'validation.max': 'Nilai maksimal {max}',
  'validation.passwordMatch': 'Password tidak cocok',
  'validation.invalidFormat': 'Format tidak valid',
  'validation.fileSize': 'Ukuran file terlalu besar',
  'validation.fileType': 'Tipe file tidak didukung',
  
  // Success Messages
  'success.saved': 'Data berhasil disimpan',
  'success.deleted': 'Data berhasil dihapus',
  'success.updated': 'Data berhasil diperbarui',
  'success.submitted': 'Data berhasil dikirim',
  'success.uploaded': 'File berhasil diunggah',
  'success.downloaded': 'File berhasil diunduh',
  'success.copied': 'Berhasil disalin',
  'success.sent': 'Berhasil dikirim',
  
  // Error Messages
  'error.general': 'Terjadi kesalahan. Silakan coba lagi.',
  'error.network': 'Koneksi jaringan bermasalah',
  'error.notFound': 'Data tidak ditemukan',
  'error.unauthorized': 'Anda tidak memiliki akses',
  'error.forbidden': 'Akses ditolak',
  'error.serverError': 'Kesalahan server. Silakan coba lagi nanti.',
  'error.timeout': 'Waktu permintaan habis',
  'error.invalidData': 'Data tidak valid',
  'error.uploadFailed': 'Gagal mengunggah file',
  'error.downloadFailed': 'Gagal mengunduh file',
  
  // Hero Section
  'hero.welcome': 'Selamat Datang',
  'hero.subtitle': 'Jelajahi Warisan Budaya Indonesia',
  'hero.exploreNow': 'Jelajahi Sekarang',
  'hero.learnMore': 'Pelajari Lebih Lanjut',
  
  // Agenda Section
  'agenda.title': 'Agenda & Kegiatan',
  'agenda.subtitle': 'Ikuti berbagai kegiatan dan acara budaya',
  'agenda.viewAll': 'Lihat Semua Agenda',
  'agenda.upcoming': 'Akan Datang',
  'agenda.past': 'Telah Berlalu',
  'agenda.ongoing': 'Sedang Berlangsung',
  
  // Profile Section
  'profileSection.title': 'Tentang Kami',
  'profileSection.subtitle': 'Mengenal lebih dekat Museum Cagar Budaya',
  'profileSection.readMore': 'Baca Selengkapnya',
  
  // Management Section
  'management.title': 'Manajemen',
  'management.subtitle': 'Struktur organisasi dan kepemimpinan',
  'management.viewStructure': 'Lihat Struktur Organisasi',
  
  // PPID Section
  'ppid.title': 'PPID',
  'ppid.subtitle': 'Pejabat Pengelola Informasi dan Dokumentasi',
  'ppid.publicInfo': 'Informasi Publik',
  'ppid.infoRequest': 'Permohonan Informasi',
  'ppid.complaint': 'Pengaduan',
  'ppid.viewMore': 'Lihat Lebih Banyak',
};

async function addAllUITranslations() {
  console.log('🚀 Starting comprehensive UI translations migration...');
  console.log('📊 Total translations to add:', Object.keys(allTranslations).length);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Get all active languages
  const languagesResult = await pool.query(
    'SELECT code FROM languages WHERE is_active = true ORDER BY code'
  );
  const languages = languagesResult.rows.map(row => row.code);

  console.log('🌐 Active languages:', languages.join(', '));
  console.log('');

  for (const [key, indonesianText] of Object.entries(allTranslations)) {
    const [module, ...rest] = key.split('.');
    const page = rest.length > 1 ? rest[0] : 'common';
    const translationKey = rest.length > 1 ? rest.slice(1).join('.') : rest[0];

    try {
      // Add translation for each language
      for (const langCode of languages) {
        let text = indonesianText;
        let autoTranslated = false;

        // Auto-translate if not Indonesian
        if (langCode !== 'id') {
          console.log(`🔄 Translating: ${key} (${langCode})...`);
          const result = await translationService.translate(indonesianText, langCode, 'id');
          
          if (result.success) {
            text = result.translatedText;
            autoTranslated = true;
            console.log(`✅ ${key} (${langCode}): "${indonesianText}" → "${text}"`);
          } else {
            console.log(`⚠️  Translation failed for ${key} (${langCode}), using original text`);
          }
        } else {
          console.log(`✅ ${key} (${langCode}): "${text}"`);
        }

        // Insert or update translation
        await pool.query(
          `INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated) 
           VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
           ON CONFLICT (module, page, key, language_code) 
           DO UPDATE SET text = $5, auto_translated = $6, last_updated = NOW()`,
          [module, page, translationKey, langCode, text, autoTranslated]
        );

        successCount++;
      }

      console.log('');
    } catch (error) {
      errorCount++;
      const errorMsg = `Failed to add translation for ${key}: ${error}`;
      errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
      console.log('');
    }
  }

  console.log('');
  console.log('📊 Migration Summary:');
  console.log('===================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total: ${successCount + errorCount}`);

  if (errors.length > 0) {
    console.log('');
    console.log('❌ Errors encountered:');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('');
  console.log('✨ UI translations migration complete!');
}

// Run the migration
addAllUITranslations()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
