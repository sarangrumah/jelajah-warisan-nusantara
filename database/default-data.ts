export const placeholder = {
  image: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
}
export const defaultSlides = [
    {
      image: '/src/assets/hero-borobudur.jpg',
      title: 'hero.museum.title',
      subtitle: 'hero.museum.subtitle',
      button_url_1: 'hero.museum.cta',
    },
    {
      image: '/src/assets/museum-interior.jpg',
      title: 'hero.collection.title',
      subtitle: 'hero.collection.subtitle',
      button_url_1: 'hero.collection.cta',
    },
    {
      image: '/src/assets/heritage-sites.jpg',
      title: 'hero.sites.title',
      subtitle: 'hero.sites.subtitle',
      button_url_1: 'hero.sites.cta',
    },
];
export const defaultVideos = [
  {
    title: 'Profil Lengkap IHA & MNI',
    video: '/src/assets/hero-sections/Profil Lengkap IHA & MNI.mp4',
  },
  {
    title: 'Ada Apa di MNI',
    video: '/src/assets/hero-sections/Ada Apa di MNI.mp4',
  },
  {
    title: 'Profil Pendek IHA',
    video: '/src/assets/hero-sections/Profil Pendek IHA.mp4',
  },
  {
    title: 'Profil IHA',
    video: '/src/assets/hero-sections/Profil IHA.mp4',
  },
  {
    title: 'Video Existing Web IHA',
    video: '/src/assets/hero-sections/Video Existing Web IHA.mp4',
  }
];
export const defaultMuseums = [
  {
    id: 1,
    name: 'Museum Nasional Indonesia',
    subtitle: 'Museum Nasional adalah jendela Indonesia yang menampilkan sejarah dan kebudayaan bangsa, mengangkat keunggulan pemikiran dan karya cipta masyarakat Nusantara, serta memetakan posisi penting Indonesia dalam dunia internasional',
    type: 'museum',
    description: 'Berlokasi strategis di jantung Kota Jakarta, Museum Nasional Indonesia adalah rumah bagi lebih dari 195.000 koleksi prasejarah, sejarah, arkeologi, etnografi, geografi, keramik, serta numismatik dan heraldik. Temukan pengalaman seru melalui pertunjukan video mapping di Ruang imersifA, pemanduan tetap keliling museum, hingga lokakarya menarik yang cocok untuk kamu. Jangan lupa, coba instalasi Mengenal Paras Nusantara serta bermain dan belajar di Ruang Anak yang hanya bisa kamu #TemuiDiMNI. Yuk, kunjungi dan ikuti perjalanan sejarah yang tak terlupakan—ikuti info terkini di Instagram @museumnasionalindonesia!',
    location: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Nasional Indonesia.jpg',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumnasional.or.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+6221-3868172",
    },
  },
  {
    id: 2,
    name: 'Galeri Nasional Indonesia',
    subtitle: 'Galeri Nasional Indonesia mengelola koleksi dan mempresentasikan karya seni rupa modern dan kontemporer, baik skala nasional, maupun internasional',
    type: 'museum',
    description: 'Galeri Nasional Indonesia mengelola koleksi dan mempresentasikan karya seni rupa modern dan kontemporer, baik skala nasional, maupun internasional. Koleksi yang dikelola meliputi gambar, cetak, lukis, patung, kriya, foto, multimedia, video, instalasi, suara, dan arsip. Mewadahi edukasi kreatif, perkembangan gagasan, dan praktik penciptaan karya seni yang inklusif. Galeri Nasional Indonesia berupaya untuk mengamplifikasi potensi seni rupa Indonesia di dunia seni internasional.',
    location: 'Jalan Medan Merdeka Timur. No.14, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, DKI Jakarta 10110',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Galeri Nasional Indonesia.jpg',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.gni.kemdikbud.go.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62858-9444-3839 (chat only)",
    },
  },
  {
    id: 3,
    name: 'Museum Basoeki Abdullah',
    subtitle: 'Museum Basoeki Abdullah mengelola koleksi dan mempresentasikan tokoh Basoeki Abdullah sebagai maestro seni rupa Indonesia melalui karya, memorial kehidupan, dan pengaruhnya yang menginspirasi dunia',
    type: 'museum',
    description: 'Museum Basoeki Abdullah mengelola koleksi dan mempresentasikan tokoh Basoeki Abdullah sebagai maestro seni rupa Indonesia melalui karya, memorial kehidupan, dan pengaruhnya yang menginspirasi dunia. Museum Basoeki Abdullah terbuka sebagai ruang kreatif melalui edukasi, destinasi budaya, dan sumber pengetahuan tentang tokoh Basoeki Abdullah.',
    location: 'Jalan Keuangan Raya RT.7/RW.5 No.19, Cilandak Barat, Kec. Cilandak, Kota Jakarta Selatan, DKI Jakarta 12430',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Basoeki Abdullah.jpg',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumbasoekiabdullah.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "-",
    },
  },
  {
    id: 4,
    name: 'Museum Batik Indonesia',
    subtitle: 'Museum Batik Indonesia merepresentasikan ekosistem Batik Indonesia dari hulu ke hilir.',
    type: 'museum',
    description: 'Museum Batik Indonesia merupakan pusat pengetahuan batik sebagai warisan budaya Indonesia yang diakui dunia melalui pengelolaan koleksi, edukasi, dan penguatan ekosistem batik yang berkelanjutan',
    location: 'Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, DKI Jakarta 13820',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Batik Indonesia.jpg',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumbatik.kemdikbud.go.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+6221-22097046",
    },
  },
  {
    id: 5,
    name: 'Museum Kebangkitan Nasional',
    subtitle: 'Museum Kebangkitan Nasional berfokus pada awal kebangkitan kesadaran kebangsaan para pemuda yang sedang sekolah di STOVIA (sekolah kedokteran bumiputera).',
    type: 'museum',
    description: 'Museum ini juga mendorong pengunjung memahami sejarah kebangsaan dan memajukan Indonesia melalui inisiatif pribadi.',
    location: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Kebangkitan Nasional.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumkebangkitannasional.com',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62851-5617-2853 (chat only)",
    },
  },
  {
    id: 6,
    name: 'Museum Sumpah Pemuda',
    subtitle: 'Museum Sumpah Pemuda berfokus pada formulasi ide kebangsaan yaitu bahwa tanah air, bangsa, dan bahasa persatuan adalah satu: Indonesia.',
    type: 'museum',
    description: 'Museum Sumpah Pemuda adalah Museum bersejarah yang terletak di Jalan Kramat Raya No. 106, Jakarta Pusat. Dahulu, Museum ini merupakan rumah tinggal milik Sie Kong Lian dan kemudian menjadi rumah kost bagi para pemuda dari berbagai daerah yang belajar di Stovia, dimana mereka berkumpul, bertukar pikiran, dan melakukan berbagai aktivitas kepemudaan serta menjadi sentra pemuda. Museum ini menjadi Tempat Kongres Sumpah Pemuda Kedua (Indonesische Clubgebouw) dan menjadi saksi bisu dari semangat perjuangan dan persatuan Indonesia.',
    location: 'Jalan Kramat Raya No.106, RT.2/RW.9, Kwitang, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10420',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets//museums/Museum Sumpah Pemuda.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumsumpahpemuda.kemdikbud.go.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62817-028-1928",
    },
  },
  {
    id: 7,
    name: 'Museum Perumusan Naskah Proklamasi',
    subtitle: 'Museum Perumusan Naskah Proklamasi menampilkan peristiwa perjuangan kemerdekaan di rumah Laksamana Maeda pada 16 Agustus 1945.',
    type: 'museum',
    description: 'Ruangan-ruangan dalam museum menceritakan peristiwa perumusan naskah proklamasi, Masa Pendudukan Jepang, BPUPK, PPKI, hingga Indonesia merdeka.',
    location: 'Jalan Imam Bonjol No.1, RT.9/RW.4, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10310',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Perumusan Naskah Proklamasi.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.munasprok.or.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+6221-31447439",
    },
  },
  {
    id: 8,
    name: 'Museum Benteng Vredeburg Yogyakarta',
    subtitle: 'Museum Benteng Vredeburg (MBV) menyajikan sejarah perjuangan bangsa Indonesia di Yogyakarta.',
    type: 'museum',
    description: 'MBV menawarkan wisata edukasi kebangsaan di jantung Yogyakarta, kota yang pernah menjadi Ibu Kota Negara pada era revolusi 1946-1949.',
    location: 'Jalan Margo Mulyo No.6, Ngupasan, Kec. Gondomanan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55122',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Benteng Vredeburg Yogyakarta.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.vredeburg.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62812-2609-9292 / +62274-586934",
    },
  },
  {
    id: 9,
    name: 'Museum Perjuangan Yogyakarta',
    subtitle: 'Museum Perjuangan Yogyakarta menampilkan sejarah perjuangan melalui diplomasi dalam mempertahankan kemerdekaan.',
    type: 'museum',
    description: 'Museum ini mengedukasi tentang pentingnya diplomasi nasional dan internasional dalam menjaga kedaulatan Republik Indonesia',
    location: 'Jalan Kolonel Sugiyono No.24, Brontokusuman, Kec. Mergangsan, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55153',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Perjuangan Yogyakarta.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62823-2446-6767",
    },
  },
  {
    id: 10,
    name: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    subtitle: 'Museum Kepresidenan Republik Indonesia Balai Kirti mempresentasikan ketokohan presiden RI sebagai pemimpin bangsa.',
    type: 'museum',
    description: 'Museum menyajikan koleksi memorabilia, dokumentasi, dan arsip kebijakan untuk memperlihatkan perjalanan kepemimpinan yang kompleks, sekaligus menggambarkan perjalanan lembaga kepresidenan Indonesia sebagai sumber inspirasi dan pembelajaran bagi generasi penerus dalam memahami sejarah negara.',
    location: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Kepresidenan Republik Indonesia Balai Kirti.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumkepresidenan.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62812-1151-1722",
    },
  },
  {
    id: 11,
    name: "Museum Islam Indonesia KH Hasyim Asy'ari",
    subtitle: "Museum Islam Indonesia K.H. Hasyim Asy’ari (MINHA) menampilkan keindahan Islam sebagai rahmat bagi manusia dan bangsa Indonesia dengan mengangkat pemikiran K.H. Hasyim Asy’ari tentang kecintaan pada negara, menghormati kemanusiaan, dan menghargai perbedaan.",
    type: 'museum',
    description: 'MINHA menampilkan artefak dan dokumentasi sejarah Islam di Indonesia dengan tata pamer yang sangat informatif, serta mempresentasikan pemikiran ulama dan pemikir Islam sebagai inspirasi perkembangan peradaban Islam di Indonesia.',
    location: 'Tebuireng Gg. 4, Cukir, Kec. Diwek, Kabupaten Jombang, Jawa Timur 61471',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Islam Indonesia KH Hasyim Asyari.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62812-4984-3506",
    },
  },
  {
    id: 12,
    name: 'Museum Manusia Purba Sangiran Klaster Krikilan',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Krikilan, berdiri di tengah Kawasan Sangiran yang merupakan warisan dunia UNESCO.',
    type: 'museum',
    description: 'Kawasan Sangiran dengan luas 59,21 km2 menyimpan lebih dari 50% temuan Homo erectus dunia. Sebagai etalase utama, Klaster Krikilan tidak hanya memamerkan rekonstruksi Homo erectus dari fosil Sangiran 17 (tengkorak Homo erectus paling lengkap di Asia) tetapi juga memperlihatkan fosil fauna prasejarah serta kisah para tokoh dan peneliti lokal yang berjasa dalam dunia kepurbakalaan nasional.',
    location: 'Jalan Sangiran No.Km. 4, Kebayanan II, Krikilan, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Manusia Purba Sangiran Krikilan.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: 'www.museumnasional.or.id',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62821-7000-1296",
    },
  },
  {
    id: 13,
    name: 'Museum Manusia Purba Sangiran Klaster Ngebung',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Ngebung, yang terletak di lokasi kunci penemuan Situs Sangiran, dikenal sebagai tempat pertama kali “Sangiran Flake Industry” terungkap.',
    type: 'museum',
    description: 'Klaster Ngebung menjadi pusat penting bagi peneliti dari berbagai negara, menghadirkan nilai sejarah dan budaya melalui penemuan fosil manusia, binatang, dan artefak budaya dari Pleistosen Bawah hingga Pleistosen Tengah.',
    location: 'Kebayanan I, Ngebung, Kabupaten Sragen, Jawa Tengah 57275.',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Manusia Purba Sangiran Ngebung.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "-",
    },
  },
  {
    id: 14,
    name: 'Museum Manusia Purba Sangiran Klaster Bukuran',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Bukuran berperan penting dalam narasi evolusi manusia purba dengan ditemukannya fosil Homo erectus pertama di Situs Sangiran, yakni Sangiran 1a dan 1b.',
    type: 'museum',
    description: 'Klaster Bukuran menghubungkan penemuan lokal dengan bukti paleoantropologi dari seluruh dunia, menegaskan posisinya dalam peta evolusi manusia.',
    location: 'Dusun 3, Bukuran, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Manusia Purba Sangiran Bukuran.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "-",
    },
  },
  {
    id: 15,
    name: 'Museum Manusia Purba Sangiran Klaster Dayu',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Dayu berdiri sebagai saksi penting dalam perjalanan evolusi manusia, terletak strategis di dalam Kawasan Cagar Budaya Nasional Sangiran, dekat dengan lokasi penemuan tengkorak Homo erectus S-17.',
    type: 'museum',
    description: 'Lapisan tanah di Klaster Dayu menunjukkan urutan stratigrafi lengkap yang memberikan wawasan terkait kondisi lingkungan dan kehidupan jutaan tahun yang lalu.',
    location: 'Dayu, 57773, Dayu, Kec. Gondangrejo, Kabupaten Karanganyar, Jawa Tengah 57188',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Manusia Purba Sangiran Dayu.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "-",
    },
  },
  {
    id: 16,
    name: 'Museum Manusia Purba Sangiran Klaster Manyarejo',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Manyarejo menawarkan sebuah perspektif unik dalam memahami hubungan antara manusia purba, penelitian ilmiah, dan tradisi lokal.',
    type: 'museum',
    description: 'Klaster ini berhasil mengubah persepsi tentang “balung buto” dari sekadar mitos menjadi pemahaman ilmiah tentang fosil, sekaligus memperkenalkan interior tradisional dan display ekskavasi yang mempertemukan masa lalu dengan kearifan lokal.',
    location: 'Dusun 3, Manyarejo, Kec. Plupuh, Kabupaten Sragen, Jawa Tengah 57283',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Manusia Purba Sangiran Manyarejo.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "-",
    },
  },
  {
    id: 17,
    name: 'Museum Song Terus',
    subtitle: 'Museum Song Terus (MST), terletak di kawasan Gunung Sewu, merupakan mutiara tersembunyi yang menawarkan wawasan mendalam tentang budaya prasejarah dari masa paleolitik hingga paleometalik di wilayah tersebut.',
    type: 'museum',
    description: 'Salah satu temuan terbaiknya adalah “Mbah Sayem”, kerangka manusia modern awal yang ditemukan utuh di Song Terus.',
    location: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Prasejarah Song Terus.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62821-4052-3401",
    },
  },
  {
    id: 18,
    name: 'Museum Semedo',
    subtitle: 'Situs Semedo adalah situs manusia purba yang ditemukan pada 2005.',
    type: 'museum',
    description: 'Salah satu temuan paling fenomenal di Situs Semedo adalah primata raksasa bernama Gigantopithecus blackii.',
    location: 'Semedo, Kec. Kedungbanteng, Kabupaten Tegal, Jawa Tengah 52472',
    address: '',
    latitude: null,
    longitude: null,
    image_url: '/src/assets/museums/Museum Prasejarah Semedo.png',
    gallery_images: '',
    opening_hours: {"days_hours": "Selasa - Minggu: 08:00 - 16:00"},
    ticket_price: 'Dewasa: Rp 5.000, Anak: Rp 2.000',
    website: '-',
    facilities: ['Parkir', 'Toilet', 'Kafeteria', 'Toko Souvenir', 'Audio Guide', 'WiFi'],
    collections: [
      'Koleksi Prasejarah',
      'Koleksi Arkeologi',
      'Koleksi Keramik',
      'Koleksi Numismatik',
      'Koleksi Sejarah',
      'Koleksi Etnografi'
    ],
    contact_info: {
      "phone": "+62813-2590-7771",
    },
  },
];
export const defaultCollections = [
  {
    id: 1,
    title: 'Mahkota Sultan Siak Sri Indrapura',
    subtitle: 'Mahkota ini adalah mahkota Sultan Siak Sri Indrapura terbuat dari bahan emas 17 karat dihias berlian dan rubi.',
    category: 'crown',
    museum: 'Museum Nasional Indonesia',
    period: '-',
    image_url: '/src/assets/collections/Mahkota Sultan Siak Sri.JPG',
    description: 'Mahkota ini adalah mahkota Sultan Siak Sri Indrapura terbuat dari bahan emas 17 karat dihias berlian dan rubi. Motif pada mahkota dibuat dengan teknik karawang atau filigree. Motif ini biasanya digunakan untuk perhiasan dengan menggunakan benang logam atau kawat halus (emas, perak, atau tembaga) yang dipelintir, dianyam, dibentuk, dan disatukan dengan patri menjadi sebuah bentuk tertentu. Teknik karawang atau filigree dibuat secara manual dan membutuhkan ketelitian dan keahlian yang tinggi dengan menyusun kawat-kawat tipis tersebut kemudian disolder atau ditempelkan pada kerangka sehingga menghasilkan motif yang unik, personal, juga bernilai tinggi. Mahkota bukan sekedar hiasan kepala yang dikenakan oleh raja, ratu ataupun dewa. Mahkota ialah simbol kemasyhuran penguasa, kekuasaan legitimasi, keabadian, kemakmuran serta kehidupan setelah kematian. Mahkota ini beserta benda regalia lainnya diberikan oleh Sultan Syarif Kasim Abdul Jalil Syaifuddin atau dikenal dengan nama Sultan Syarif Kasim II kepada pemerintah Republik Indonesia pada tahun 1945 sebagai bentuk dukungan penuh terhadap kemerdekaan Indonesia. Dukungan diberikan dengan cara mengakui bahwa Kesultanan Siak Sri Indrapura merupakan bagian dari Negara Kesatuan Republik Indonesia. Mahkota ini telah ditetapkan sebagai Cagar Budaya berperingkat Nasional melalui Surat Keputusan Nomor 248/M/2013 pada tanggal 27 Desember 2013 oleh Menteri Pendidikan dan Kebudayaan.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 2,
    title: 'Kamera SLR Leica',
    subtitle: 'Kamera Leica ini adalah kamera pribadi milik Presiden B.J. Habibie yang kerap beliau gunakan.',
    category: 'camera',
    museum: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    period: '-',
    image_url: '/src/assets/collections/Kamera SLR Leica.jpg',
    description: 'Kamera Leica ini adalah kamera pribadi milik Presiden B.J. Habibie yang kerap beliau gunakan. Presiden B.J. Habibie dikenal mempunyai kegemaran dalam bidang fotografi. Ketika menjabat sebagai Presiden RI ke-3, B.J. Habibie pernah menggelar pameran dan peluncuran buku fotografi yang menampilkan hasil karya-karyanya. Pameran yang menampilkan 178 karya foto dan peluncuran buku "Pesona Cahaya, Kecepatan, Waktu, dan Ruang Angkasa" tersebut diselenggarakan di Galeri Depdikbud (saat ini Galeri Nasional) pada tanggal 26 Juni 1999 hingga 2 Juli 1999. Objek fotografi yang menjadi kesukaan beliau antara lain awan, lanskap, rumah, laut, hutan cemara, gunung, hingga bunga-bunga yang bermekaran di taman. Dalam waktu senggangnya, Presiden B.J. Habibie juga senang mengabadikan momen-momen kebersamaan dengan keluarga menggunakan kamera tersebut.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 3,
    title: 'Lukisan dr. Wahidin Soedirohoesodo',
    subtitle: 'Lukisan Dokter Wahidin Soedirohoesodo merupakan karya maestro lukis Indonesia Basoeki Abdullah.',
    category: 'portrait',
    museum: 'Museum Kebangkitan Nasional',
    period: '-',
    image_url: '/src/assets/collections/Lukisan dr. Wahidin Soedirohoesodo.jpg',
    description: 'Lukisan Dokter Wahidin Soedirohoesodo merupakan karya maestro lukis Indonesia Basoeki Abdullah. Karakter Wahidin Soedirohoesodo dilukis dengan teliti khususnya pada bagian wajah. Pada bagian baju dan kain proses lukis dilakukan dengan gaya realis impresif, sedangkan pada bagian belakang brushstroke dilakukan dengan menggunakan campuran cat yang terdiri dari merah, kuning, orange, dan putih yang dipadukan dengan warna biru tua dan ungu, sehingga menghasilkan kesan gelap terang yang dramatis. Posisi tangan pada lukisan bersedekap yang dimaknai sebagai sebuah keprihatinan terhadap kondisi masyarakat yang sengsara karena penjajahan, sedangkan kaki tidak menggunakan alas sebagai lambang bahwa Dokter Wahidin Soedirohoesodo sangat merakyat. Hal ini dibutktikan dengan usahanya menemui bangsawan dan priyayi di Pulau Jawa dengan berjalan kaki untuk memperkenalkan dana belajar untuk para pelajar yang tidak mampu.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 4,
    title: 'Master Poster Soekarno',
    subtitle: 'Master Poster ini berbentuk seperti vinyet yang merupakan gambar dekoratif tanpa maksud yang jelas, biasanya berupa kreasi improvisatif sebagai pengisi halaman kosong.',
    category: 'portrait',
    museum: 'Museum Perumusan Naskah Proklamasi',
    period: '-',
    image_url: '/src/assets/collections/Master Poster Soekarno.jpg',
    description: 'Master Poster ini berbentuk seperti vinyet yang merupakan gambar dekoratif tanpa maksud yang jelas, biasanya berupa kreasi improvisatif sebagai pengisi halaman kosong. Siluet merupakan efek yang dihasilkan dalam fotografi karena adanya perbedaan signifikan antara pantulan cahaya objek utama di bagian depan gambar dengan latar belakangnya. gambar Ir. Soekarno dari arah samping kiri. Tampak Ir. Soekarno memakai peci. Master poster ini berwarna hitam putih.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 5,
    title: 'Biola W.R. Supratman',
    subtitle: 'Biola WR Supratman ini yang digunakan saat melagukan Indonesa Raya pada 28 Oktober 1928 saat kongres sumpah pemuda dilaksanakan.',
    category: 'music instrument',
    museum: 'Museum Sumpah Pemuda',
    period: '-',
    image_url: '/src/assets/collections/Biola W.R. Supratman.jpg',
    description: 'Biola WR Supratman ini yang digunakan saat melagukan Indonesa Raya pada 28 Oktober 1928 saat kongres sumpah pemuda dilaksanakan. Pada bagian dalam terdapat tulisan “Nicolaus Amatus Fecit In Cremona 16” yang menunjukkan nama pembuat dan alamatnya. Pada bagian badan juga terdapat tick rest atau penahan dagu. Adapun biola ini memiliki ukuran standar (4/4) dengan panjang badan 36 cm, lebar badan bagian bawah 20 cm, lebar badan bagian atas 11 cm, tebal 4,1 cm pada bagian tepi, dan tebal 6 cm pada bagian tengah. Leher biola berukuran panjang 37,2 cm, lebar leher pada sisi terlebar 4 cm dan sisi tersempit 2,5 cm. Pada bagian leher ini terdapat setelan senar sepanjang 6 cm yang berujung bundar dengan diameter 2,5 cm. Penggesek biola memiliki ukuran panjang 71,2 cm dan panjang senar 62,5 cm. Kayu Cyprus (Peronema canescens): Membentuk bagian depan biola. Kayu Maple Italia (Acer pseudoplatanus): Membentuk bagian samping (side plate), bagian belakang (back plate), leher (neck), kepala (scroll), dan jembatan (bridge). Kayu Eboni Afrika Selatan (Diospyros melanida): Membentuk bagian senar holder (tail piece), penggulung senar (driver), kriplang (finger board), dan end pin. Lis tepi biola: Terbuat dari kayu rosewood atau eboni.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 6,
    title: 'Set Lukisan Pimpinan GNB (5 buah): 1. 14 Pimp Neg GNB dari M Zanawi (Ethiophia)',
    subtitle: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992.',
    category: 'portrait',
    museum: 'Museum Basoeki Abdullah',
    period: '-',
    image_url: '/src/assets/collections/Set Lukisan Pimpinan GNB1.JPG',
    description: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992. Karya ini diciptakan sebagai bentuk penghormatan kepada para pemimpin negara anggota GNB yang hadir dalam forum internasional yang diselenggarakan di Jakarta, Indonesia, pada 1–6 September 1992. Dalam proses kreatifnya, Basoeki Abdullah melukis potret para kepala negara ini berdasarkan foto resmi yang dikirimkan oleh masing-masing negara peserta. Dengan pendekatan realisme, ia berhasil menangkap tidak hanya rupa, tetapi juga karakter dan wibawa setiap tokoh. Detail yang halus, ketepatan anatomi, serta penyajian ekspresi yang kuat menjadikan seri lukisan ini tidak hanya sebagai dokumentasi visual, tetapi juga sebagai karya seni yang sarat nilai historis, diplomatik, dan estetika.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 7,
    title: 'Set Lukisan Pimpinan GNB (5 buah): 2. 10 Pim Neg GNB dari N Soglo',
    subtitle: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992.',
    category: 'portrait',
    museum: 'Museum Basoeki Abdullah',
    period: '-',
    image_url: '/src/assets/collections/Set Lukisan Pimpinan GNB2.JPG',
    description: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992. Karya ini diciptakan sebagai bentuk penghormatan kepada para pemimpin negara anggota GNB yang hadir dalam forum internasional yang diselenggarakan di Jakarta, Indonesia, pada 1–6 September 1992. Dalam proses kreatifnya, Basoeki Abdullah melukis potret para kepala negara ini berdasarkan foto resmi yang dikirimkan oleh masing-masing negara peserta. Dengan pendekatan realisme, ia berhasil menangkap tidak hanya rupa, tetapi juga karakter dan wibawa setiap tokoh. Detail yang halus, ketepatan anatomi, serta penyajian ekspresi yang kuat menjadikan seri lukisan ini tidak hanya sebagai dokumentasi visual, tetapi juga sebagai karya seni yang sarat nilai historis, diplomatik, dan estetika.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 8,
    title: 'Set Lukisan Pimpinan GNB (5 buah): 3. 10 Pimp Neg GNB dari Demond H (Guyana)',
    subtitle: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992.',
    category: 'portrait',
    museum: 'Museum Basoeki Abdullah',
    period: '-',
    image_url: '/src/assets/collections/Set Lukisan Pimpinan GNB3.JPG',
    description: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992. Karya ini diciptakan sebagai bentuk penghormatan kepada para pemimpin negara anggota GNB yang hadir dalam forum internasional yang diselenggarakan di Jakarta, Indonesia, pada 1–6 September 1992. Dalam proses kreatifnya, Basoeki Abdullah melukis potret para kepala negara ini berdasarkan foto resmi yang dikirimkan oleh masing-masing negara peserta. Dengan pendekatan realisme, ia berhasil menangkap tidak hanya rupa, tetapi juga karakter dan wibawa setiap tokoh. Detail yang halus, ketepatan anatomi, serta penyajian ekspresi yang kuat menjadikan seri lukisan ini tidak hanya sebagai dokumentasi visual, tetapi juga sebagai karya seni yang sarat nilai historis, diplomatik, dan estetika.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 9,
    title: 'Set Lukisan Pimpinan GNB (5 buah): 4. 10 Pimp Neg GNB dari Dr.RB. Cellos (Equador)',
    subtitle: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992.',
    category: 'portrait',
    museum: 'Museum Basoeki Abdullah',
    period: '-',
    image_url: '/src/assets/collections/Set Lukisan Pimpinan GNB4.JPG',
    description: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992. Karya ini diciptakan sebagai bentuk penghormatan kepada para pemimpin negara anggota GNB yang hadir dalam forum internasional yang diselenggarakan di Jakarta, Indonesia, pada 1–6 September 1992. Dalam proses kreatifnya, Basoeki Abdullah melukis potret para kepala negara ini berdasarkan foto resmi yang dikirimkan oleh masing-masing negara peserta. Dengan pendekatan realisme, ia berhasil menangkap tidak hanya rupa, tetapi juga karakter dan wibawa setiap tokoh. Detail yang halus, ketepatan anatomi, serta penyajian ekspresi yang kuat menjadikan seri lukisan ini tidak hanya sebagai dokumentasi visual, tetapi juga sebagai karya seni yang sarat nilai historis, diplomatik, dan estetika.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 10,
    title: 'Set Lukisan Pimpinan GNB (5 buah): 5. 41 Pimp Neg GNB',
    subtitle: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992.',
    category: 'portrait',
    museum: 'Museum Basoeki Abdullah',
    period: '-',
    image_url: '/src/assets/collections/Set Lukisan Pimpinan GNB5.JPG',
    description: 'Koleksi Lukisan Kepala Negara KTT-GNB terdiri dari 5 (lima) seri lukisan potret para kepala negara peserta Konferensi Tingkat Tinggi Gerakan Non-Blok (KTT-GNB) yang dilukis oleh maestro lukis Indonesia, Basoeki Abdullah, pada tahun 1992. Karya ini diciptakan sebagai bentuk penghormatan kepada para pemimpin negara anggota GNB yang hadir dalam forum internasional yang diselenggarakan di Jakarta, Indonesia, pada 1–6 September 1992. Dalam proses kreatifnya, Basoeki Abdullah melukis potret para kepala negara ini berdasarkan foto resmi yang dikirimkan oleh masing-masing negara peserta. Dengan pendekatan realisme, ia berhasil menangkap tidak hanya rupa, tetapi juga karakter dan wibawa setiap tokoh. Detail yang halus, ketepatan anatomi, serta penyajian ekspresi yang kuat menjadikan seri lukisan ini tidak hanya sebagai dokumentasi visual, tetapi juga sebagai karya seni yang sarat nilai historis, diplomatik, dan estetika.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 11,
    title: 'Lukisan Kapal Tenggelam/The Sinking Ship , c.1840, karya Raden Saleh Sjarif Boestaman (c.1811 - 1880)',
    subtitle: 'Badai di laut dan kapal tenggelam termasuk pengalaman dasar sejak manusia mulai berlayar.',
    category: 'portrait',
    museum: 'Galeri Nasional Indonesia',
    period: '1811 - 1880',
    image_url: '/src/assets/collections/Lukisan Kapal Tenggelam.jpg',
    description: 'Badai di laut dan kapal tenggelam termasuk pengalaman dasar sejak manusia mulai berlayar. Tema lukisan ini berkembang di Eropa karena kedekatan mereka dengan laut dan perdagangan maritim. Raden Saleh, yang mengalami badai saat berlayar ke Eropa, melukis "Zinkend Schip/Kapal Tenggelam" dengan gaya Romantikisme, menggambarkan pergulatan dramatis kapal melawan alam. Karya ini mencerminkan ketegangan antara imajinasi dan realitas, dengan pencahayaan dramatis serta suasana yang mencekam. Lukisan tersebut menggambarkan dua buah kapal yang sedang berjuang melawan badai dahsyat. Tampak sebuah kapal hampir tenggelam dan kapal lainnya pecah berantakan terhempas batu karang.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 12,
    title: 'Batik Sogan Parang Ukel Seling',
    subtitle: 'Kain panjang batik tulis bermotif Parang Ukel Seling, salah satu variasi motif Parang dalam langgam Sudagaran, dengan paduan warna kecoklatan (sogan) dan menampilkan aksen remekan khas Batik Wonogiri.',
    category: 'fabric',
    museum: 'Museum Batik Indonesia',
    period: '-',
    image_url: '/src/assets/collections/Batik Sogan Parang Ukel Seling.jpg',
    description: 'Kain panjang batik tulis bermotif Parang Ukel Seling, salah satu variasi motif Parang dalam langgam Sudagaran, dengan paduan warna kecoklatan (sogan) dan menampilkan aksen remekan khas Batik Wonogiri. Pada salah satu sudut kain terdapat tanda stempel “Ibu Puspaningrat” yang mengindikasikan bahwa kain ini berasal dari Surakarta. Kain ini pernah menjadi bagian dari koleksi pribadi Ibu Tien Soeharto, dikenakan oleh beliau ketika menghadiri acara peringatan Hari Pers Nasional di Sulawesi Selatan pada tanggal 8 Februari 1990. Koleksi ini merupakan hibah dari Museum Purna Bhakti Pertiwi yang masuk sebagai koleksi Museum Batik Indonesia pada tahun 2024.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 13,
    title: 'Fosil Fragmen Tengkorak (Cranium) Homo erectus',
    subtitle: 'Fosil ini ditemukan secara tidak sengaja oleh Setu Wiryorejo penduduk Dusun Bojong, Desa Manyarejo, Kecamatan Plupuh, Kabupaten Sragen pada tanggal 6 Februari 2016.',
    category: 'sculpture',
    museum: 'Museum Manusia Purba Sangiran Klaster Manyarejo',
    period: '-',
    image_url: '/src/assets/collections/Fosil Fragmen Tengkorak (Cranium) Homo erectus.jpg',
    description: 'Fosil ini ditemukan secara tidak sengaja oleh Setu Wiryorejo penduduk Dusun Bojong, Desa Manyarejo, Kecamatan Plupuh, Kabupaten Sragen pada tanggal 6 Februari 2016. Fosil ditemukan pada dasar Sungai Bojong yang terletak di Dusun Bojong, Desa Manyarejo, Kecamatan Plupuh, Kabupaten Sragen. Fosil ditemukan dalam perjalanan pulang setelah mencari rumput untuk pakan ternak. Selanjutnya fosil diserahkan oleh penemu kepada Museum Manusia Purba Sangiran Sangiran pada hari berikutnya, yaitu tanggal 7 Februari 2016. Dalam peninjauan di lokasi penemuan diketahui bahwa tengkorak Homo erectus tersebut merupakan temuan lepas (berada di endapan alluvium Sungai Bojong). Daerah ini dapat dikatakan merupakan zona perubahan dari Formasi Pucangan-Kabuh. Ahli paleoanthropologi Dr. Harry Widianto telah melakukan craniometry dan identifikasi terhadap fosil ini dan memasukkannya dalam kelompok Homo erectus arkaik yang merupakan Homo erectus tertua yang pernah hidup di Sangiran. Selanjutnya ahli paleontologi Perancis Dominique melakukan pembersihan mekanis terhadap tengkorak ini. Lapisan tanah yang menempel pada fosil merupakan endapan lempung pasiran. Dari beberapa temuan tengkorak Homo erectus arkaik sampai saat ini, fosil temuan Setu ini merupakan atap tengkorak terlengkap nomor 2 setelah temuan dari Situs Perning yang ditemukan pada tahun 1936.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 14,
    title: 'Kendil Dalung',
    subtitle: 'Kendil dalung milik Mertopawiro atau dikenal dengan nama Mbah Sayuk yang digunakan untuk merebus 3 butir telur ayam sebagai jamuan makan malam Jenderal Soedirman ketika beristirahat dalam perjalanan gerilyanya di rumah Mbah Sayuk.',
    category: 'pottery',
    museum: 'Museum Benteng Vredeburg Yogyakarta & Museum Perjuangan Yogyakarta',
    period: '-',
    image_url: '/src/assets/collections/Kendil Dalung.png',
    description: 'Kendil dalung milik Mertopawiro atau dikenal dengan nama Mbah Sayuk yang digunakan untuk merebus 3 butir telur ayam sebagai jamuan makan malam Jenderal Soedirman ketika beristirahat dalam perjalanan gerilyanya di rumah Mbah Sayuk. Menghadapi Agresi Militer Belanda II, Jenderal Soedirman memutuskan untuk mundur ke luar kota dan berjuang gerilya membentuk pertahanan di desa-desa dengan menjadikan rumah penduduk sebagai tempat singgah atau markas sementara, salah satunya adalah rumah Mbah Sayuk di Paliyan, Karangduwet, Gunung Kidul. Pada tanggal 21 Desember 1948 sekitar pukul 16.00, Jenderal Soedirman datang dari arah selatan dengan ditandu dan berhenti di rumah Mbah Sayuk. Bersama Kapten Soepardjo Roestam, Tjokropranolo, dan dr. Soewondo, mereka beristirahat dari pukul 16.00 hingga 23.30. Saat itu, Jenderal Soedirman berbaring di ruang tengah rumah Mbah Sayuk yang berbentuk limasan Jawa dan hanya mau disebut dengan panggilan “Kang” bukan jenderal atau komandan. Pada tanggal 21 Oktober 1996, kendil dalung ini diserahkan ke Museum Benteng Vredeburg untuk dijadikan koleksi dan saat ini dipamerkan di Ruang Tata Pameran Diorama 3. Karena nilai penting sejarah, ilmu pengetahuan, pendidikan, dan kebudayaan, maka pada tanggal 26 November 2019, kendil dalung ditetapkan sebagai benda cagar budaya peringkat kabupaten.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 15,
    title: "Jubah KH. Hasyim Asy'ari",
    subtitle: "Jubah ini ditemukan secara tidak sengaja oleh Bapak Abdul Malik, seorang abdi dalem Nyai Masruroh (istri KH. Hasyim Asy’ari asal Kediri) dan putri beliau, Nyai Hj. Chodidjah Hasyim, di Pondok Pesantren Tebuireng.",
    category: 'fabric',
    museum: "Museum Islam Indonesia KH Hasyim Asy'ari",
    period: 'abad ke-19',
    image_url: '/src/assets/collections/Jubah KH. Hasyim Asyari.jpg',
    description: "Jubah ini ditemukan secara tidak sengaja oleh Bapak Abdul Malik, seorang abdi dalem Nyai Masruroh (istri KH. Hasyim Asy’ari asal Kediri) dan putri beliau, Nyai Hj. Chodidjah Hasyim, di Pondok Pesantren Tebuireng. Pada tahun 1977, saat hendak mencuci pakaian para pengasuh pondok, Bapak Abdul Malik menemukan jubah ini di antara tumpukan pakaian. Karena penasaran, beliau menanyakannya kepada Nyai Masruroh. Beliau pun menjelaskan bahwa jubah tersebut merupakan milik KH. Hasyim Asy’ari. Bersama putrinya, Nyai Hj. Chodidjah Hasyim, Nyai Masruroh kemudian menyerahkan jubah tersebut kepada Bapak Abdul Malik untuk disimpan. Sejak saat itu, jubah ini disimpan oleh Bapak Abdul Malik di kampung halamannya, tepatnya di Jl. KH. Hasyim Asy'ari No. 69, RT 002, RW 002, Dusun Kapurejo, Desa Pagu, Kecamatan Pagu, Kabupaten Kediri, Jawa Timur. Jubah ini merupakan simbol busana kaum muslim Indonesia yang telah menunaikan ibadah haji pada abad ke-19 dan ke-20 Masehi. Pada tahun 2023, jubah ini dihibahkan ke Museum Islam Indonesia KH. Hasyim Asy’ari dan kini dipamerkan di Ruang Pameran KH. Hasyim Asy’ari sebagai bagian dari warisan sejarah dan tokoh bangsa.",
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 16,
    title: 'Replika Rangka ST-1 "Mbah Sayem"',
    subtitle: 'Satu-satunya temuan rangka utuh di Situs Song Terus.',
    category: 'sculpture',
    museum: 'Museum Song Terus',
    period: '-',
    image_url: '/src/assets/collections/Replika Rangka ST-1 Mbah Sayem.jpg',
    description: 'Satu-satunya temuan rangka utuh di Situs Song Terus. Rangka ditemukan dengan posisi dikuburkan terlipat. Berjenis kelamin laki-laki, berumur kurang lebih 50-60 tahun, dan termasuk dalam ras Australomelanesid. Berasal dari masa 8500 tahun yang lalu dan termasuk dalam periode Mesolitik/Preneolitik. Temuan ini menjadi representasi bagaimana manusia menjalani hidup pada Masa Prasejarah khususnya di wilayah Gunung Sewu.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 17,
    title: 'Mata Panah',
    subtitle: 'Merupakan alat yang berasal dari Masa Neolitik, berbentuk segitiga, tipis, diretus pada kedua sisinya dan memiliki dasar yang berbentuk cekung.',
    category: 'weapon',
    museum: 'Museum Song Terus',
    period: '-',
    image_url: '/src/assets/collections/MST_MATA PANAH-1.jpg',
    description: 'Merupakan alat yang berasal dari Masa Neolitik, berbentuk segitiga, tipis, diretus pada kedua sisinya dan memiliki dasar yang berbentuk cekung. Artefak ini menjadi bukti bahwa wilayah Gunung Sewu menjadi kawasan bagaimana industri litik berkembang di Masa Prasejarah dari alat sederhana di Masa Paleolitik hingga mencapai puncak teknologinya di Masa Neolitik yang salah satunya diwakili oleh mata panah.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 18,
    title: 'Beliung Setengah Jadi',
    subtitle: 'Merupakan beliung persegi yang belum selesai dikerjakan, terbuat dari batuan basalt dengan dominasi warna abu-abu gelap.',
    category: 'weapon',
    museum: 'Museum Semedo',
    period: '-',
    image_url: '/src/assets/collections/Beliung Setengah Jadi.jpg',
    description: 'Merupakan beliung persegi yang belum selesai dikerjakan, terbuat dari batuan basalt dengan dominasi warna abu-abu gelap. Pada koleksi ini terdapat korteks pada satu sisi, sedangkan sisi yang lain sudah tidak berkorteks. Jejak pembuatan yang masih dapat diamati berupa pemangkasan pada permukaannya. Koleksi beliung persegi setengah jadi menjadi indikasi bahwa budaya artefak batu Kawasan Cagar Budaya Semedo tidak hanya berlangsung pada periode Paloelitik, melainkan hingga periode Neolitik.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 19,
    title: 'Fragmen Tempurung Kura-Kura',
    subtitle: 'Merupakan tempurung kura-kura yang terkonservasi bagian carapace dan plastron.',
    category: 'sculpture',
    museum: 'Museum Semedo',
    period: '-',
    image_url: '/src/assets/collections/Fragmen Tempurung Kura-Kura.JPG',
    description: 'Merupakan tempurung kura-kura yang terkonservasi bagian carapace dan plastron. Permukaan koleksi didominasi warna coklat keabuan. Pada carapace masih dapat diamati bagian pleural dan periphericalnya, tetapi sebagian carapace telah hilang dan tertutup sedimen. Pada bagian plastron yang masih dapat diamati adalah bagian hypoplastron, xiphiplastron, sedikit bagian hyoplatron dan epiplastron, sedangkan bagian lainnya sudah mengalami pergeseran akibat sedimentasi. Berdasarkan penelitian Prof. Akio Takahashi dari Okayama University of Science, fosil fauna ini diduga berasal dari spesies kura-kura Duboisemys isoclina dan merupakan spesimen terbaik kedua setelah spesiman sejenis yang ditemukan di Trinil.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 20,
    title: 'Benteng Marlborough',
    subtitle: 'Benteng Marlborough adalah benteng kolonial yang dibangun oleh East India Company (EIC) pada 1713–1719.',
    category: 'fortress',
    museum: 'CB Unit Banten, Jawa Barat, Sumatera',
    period: '-',
    image_url: '/src/assets/collections/Benteng Marlborough.JPG',
    description: 'Benteng Marlborough adalah benteng kolonial yang dibangun oleh East India Company (EIC) pada 1713–1719. Benteng ini menjadi markas penting Inggris di Pantai Barat Sumatera selama masa kolonial yang bertujuan untuk melindungi kepentingan perdagangan rempah-rempah dan sebagai pusat pertahanan melawan saingan seperti Belanda dan pemberontakan lokal. Benteng ini memiliki desain berbentuk kura-kura dengan dinding tebal dan parit pertahanan, mencerminkan arsitektur militer Eropa abad ke-18 Masehi. Benteng ini juga merupakan saksi peristiwa “Mount Fellix” tahun 1807 yang menewaskan residen EIC, Thomas Parr. Peristiwa ini merupakan perlawanan dan protes para rakyat Bengkulu terhadap sistem tanam kopi yang dipaksakan. Pada 1825, Inggris menyerahkan Bengkulu kepada Belanda melalui Traktat London (Anglo-Dutch Treaty of 1824) dengan ditukar wilayah Melaka. Benteng ini kemudian beralih fungsi menjadi markas militer selama masa kolonial Belanda hingga masa pendudukan Jepang. Benteng Marlborough telah ditetapkan sebagai Cagar Budaya dan merupakan bukti interaksi kompleks antara kolonialisme, perlawanan lokal, dan dinamika perdagangan global.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 21,
    title: 'Rumah Bekas Pengasingan Bung Karno',
    subtitle: 'Rumah kediaman Bung Karno di Bengkulu adalah salah satu situs bersejarah yang terkait dengan masa pengasingan Presiden pertama Indonesia, Soekarno, oleh pemerintah kolonial Belanda pada 1938–1942.',
    category: 'sites',
    museum: 'CB Unit Banten, Jawa Barat, Sumatera',
    period: '-',
    image_url: '/src/assets/collections/Rumah Bekas Pengasingan Bung Karno.JPG',
    description: 'Rumah kediaman Bung Karno di Bengkulu adalah salah satu situs bersejarah yang terkait dengan masa pengasingan Presiden pertama Indonesia, Soekarno, oleh pemerintah kolonial Belanda pada 1938–1942. Bangunan ini awalnya merupakan rumah milik seorang pedagang Tionghoa yang disewa Belanda untuk tempat tinggal Soekarno selama diasingkan di Bengkulu. Selama menempati rumah ini, Soekarno aktif berinteraksi dengan masyarakat lokal, mengajar, berkesenian, dan menyebarkan ide-ide nasionalisme. Ia juga merancang beberapa bangunan, termasuk Masjid Jami’ Bengkulu, yang masih berdiri hingga kini. Rumah ini menjadi saksi perjalanan politik Soekarno sebelum kemerdekaan Indonesia. Setelah Indonesia merdeka, rumah tersebut kemudian dipugar dan dijadikan tempat menyimpan dan memajang barang-barang koleksi Bung Karno, meliputi furnitur, foto-foto, barangbarang, dan dokumen peninggalan Bung Karno. Rumah yang dibangun awal abad ke-20 ini berbentuk persegi panjang seluas 162 m², terletak di tengah halaman yang luas dan dikelilingi pagar. Bangunan ini memiliki teras depan dan belakang, jendela kaca besar, pintu masuk utama berdaun ganda, dan atap limas. Di dalamnya, terdapat ruang tamu, beberapa kamar (tiga di sisi kanan dan dua di sisi kiri), serta paviliun di belakang. Bagian belakang rumah juga memiliki beranda dan bangunan memanjang berisi kamar mandi, gudang, dan dapur.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 22,
    title: 'Situs Megalitik Pugung Raharjo',
    subtitle: 'Taman Purbakala Pugung Raharjo adalah kompleks arkeologi yang berlokasi di Lampung, yang mengandung peninggalan dari masa prasejarah hingga pengaruh Hindu-Buddha.',
    category: 'sites',
    museum: 'CB Unit Banten, Jawa Barat, Sumatera',
    period: 'Abad ke-14',
    image_url: '/src/assets/collections/Situs Megalitik Pugung Raharjo.JPG',
    description: 'Taman Purbakala Pugung Raharjo adalah kompleks arkeologi yang berlokasi di Lampung, yang mengandung peninggalan dari masa prasejarah hingga pengaruh Hindu-Buddha. Situs ini ditemukan pada 1957 secara tidak sengaja oleh transmigran yang membuka lahan di wilayah Lampung Timur. Temuan-temuan di Taman Purbakala mencakup berbagai struktur seperti punden berundak, batu berdiri (menhir), dolmen, parit kuno, dan arca, serta artefak seperti keramik asing dan prasasti abad ke-14. Di salah satu punden itu juga ditemukan Arca Boddhisatwa "Putri Bodariah". Temuan-temuan tersebut menunjukkan perpaduan kebudayaan megalitik dan pengaruh kerajaan seperti Sriwijaya. Selain itu, terdapat mata air dengan kolam dan batuan bergores, serta temuan arca lain termasuk sosok duduk berhias dan Arca Avalokitecvara perunggu berlanggam Sailendra, menegaskan kekayaan sejarah dan budaya situs ini. Situs ini awalnya dianggap sebagai pemukiman kuno yang berkembang antara abad ke-7 hingga sekitar abad ke-13 Masehi. Beberapa peneliti meyakini Pugung Raharjo berfungsi sebagai pusat ritual atau permukiman pertahanan, dibuktikan dengan adanya parit buatan dan struktur tanah yang membentuk benteng alami.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 23,
    title: 'Situs Megalitik Gunung Padang',
    subtitle: 'Situs Gunung Padang di Cianjur, Jawa Barat, merupakan salah satu kompleks megalitik terbesar di Asia Tenggara yang memicu perdebatan menarik di kalangan arkeolog.',
    category: 'sites',
    museum: 'CB Unit Banten, Jawa Barat, Sumatera', 
    period: '1500 - 2500 SM',
    image_url: '/src/assets/collections/Situs Megalitik Gunung Padang.jpg',
    description: 'Situs Gunung Padang di Cianjur, Jawa Barat, merupakan salah satu kompleks megalitik terbesar di Asia Tenggara yang memicu perdebatan menarik di kalangan arkeolog. Dikenal sebagai "gunung cahaya" oleh masyarakat setempat, situs ini terdiri dari lima teras bertingkat dengan susunan batu kolom andesit berbentuk unik, diduga kuat berasal dari masa Neolitik (1500-2500 SM). Keunikan situs ini terletak pada kontroversi usianya. Dalam penelitian geoelektrik diklaim adanya struktur bawah tanah yang mungkin berusia hingga 20.000 tahun, menjadikannya potensial sebagai struktur piramida tertua di dunia. Namun, klaim ini masih diperdebatkan karena bukti arkeologis hanya mendukung interpretasi penggunaan situs sebagai tempat pemujaan megalitik pada milenium pertama SM. Terlepas dari kontroversi yang ada, Gunung Padang diakui sebagai warisan megalitik penting dengan nilai budaya tinggi, tercermin dari statusnya sebagai cagar budaya nasional. Temuan alat batu dan fragmen gerabah memperkuat dugaan sebagai pusat aktivitas spiritual masa lalu. Cagar Budaya Gunung Padang saat ini menjadi tempat yang menawarkan pengalaman luar biasa tentang hubungan manusia, alam, dan spiritualitasnya. Di sini, kita dapat merenung tentang bagaimana nenek moyang kita dapat membangun peradaban dengan kepemimpinan yang hebat dan kerjasama yang erat. Jejak-jejak nilai luhur yang ditemukan di Gunung Padang ini bisa menjadi inspirasi bagi kita dalam menjalani kehidupan sehari-hari.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 24,
    title: 'Candi Borobudur',
    subtitle: 'Terletak di Jawa Tengah, sekitar 40 km dari Yogyakarta, Candi Borobudur berdiri megah di atas bukit alami dengan struktur batu andesit yang simetris dan tanpa atap.',
    category: 'sites',
    museum: 'Unit Wardun Borobudur', 
    period: 'Abad ke-9',
    image_url: '/src/assets/collections/Candi Borobudur.jpg',
    description: 'Terletak di Jawa Tengah, sekitar 40 km dari Yogyakarta, Candi Borobudur berdiri megah di atas bukit alami dengan struktur batu andesit yang simetris dan tanpa atap. Candi Borobudur, monumen Buddha terbesar di dunia yang dibangun abad ke-9 oleh Dinasti Sailendra, merupakan mahakarya arsitektur dan spiritual Jawa Kuno. Prasasti Tri Tepusan (842 M) menyebutnya sebagai kamulan ni Bhumisambhara (bukit kebijaksanaan), dengan struktur 10 tingkat berbentuk piramida berundak dari batu andesit, melambangkan perjalanan menuju pencerahan dalam Buddhisme. Desainnya yang menyerupai bunga teratai mencerminkan simbol kesucian, sementara lebih dari 2.600 panel reliefnya mengilustrasikan ajaran Buddha seperti karmawibhangga (hukum sebab-akibat), lalitawistara (kisah Siddharta Gautama), dan gandawyuha (pencarian kebijaksanaan). Selain nilai keagamaan dan moral, relief juga menyimpan informasi sosial-budaya masyarakat Jawa Kuna: alat musik, senjata, kapal dagang, pakaian, dan arsitektur. Hal ini menandakan peradaban yang maju dalam ilmu pengetahuan, kemaritiman, dan agrikultur, serta memiliki keselarasan hidup dengan alam. Candi Borobudur adalah simbol kebijaksanaan, toleransi, dan nilai-nilai kemanusiaan. Ia merupakan warisan adiluhung Nusantara yang mencerminkan perpaduan antara spiritualitas dan kejayaan budaya Jawa Kuna.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 25,
    title: 'Candi Pawon',
    subtitle: 'Candi Pawon, terletak di antara Candi Mendut dan Borobudur, diperkirakan dibangun pada abad ke-8 Masehi sebagai bagian dari kompleks ritual Dinasti Syailendra.',
    category: 'sites',
    museum: 'Unit Wardun Borobudur', 
    period: 'Abad ke-8',
    image_url: '/src/assets/collections/Candi Pawon.jpg',
    description: 'Candi Pawon, terletak di antara Candi Mendut dan Borobudur, diperkirakan dibangun pada abad ke-8 Masehi sebagai bagian dari kompleks ritual Dinasti Syailendra. Menurut epigraf J.G. de Casparis, candi ini dikaitkan dengan Raja Indra, ayah Samaratungga, dengan nama "Pawon" yang diduga berasal dari kata pa-awu-an (tempat abu), mengisyaratkan fungsi pemujaan atau pensucian. Prasasti Karang Tengah (824 M) menyebutkan arca logam yang mengeluarkan vajranala (api petir), diduga terkait dengan nama daerah "Brojonalan". Secara arsitektural, Candi Pawon memiliki struktur tiga bagian (kaki, tubuh, atap) dengan puncak stupa besar dikelilingi delapan stupa kecil. Uniknya, candi ini tidak memiliki pagar langkan tetapi dilengkapi ventilasi persegi panjang di tiga sisi dan relung bermotif Kala-Makara tanpa arca. Reliefnya kaya simbol Buddhisme, seperti Kuwera (dewa kekayaan), Kinara-Kinari (makhluk setengah burung), dan Purnakalasa (jambangan kesuburan), mencerminkan nilai kemakmuran dan spiritualitas. Ahli Poerbatjaraka menilai kesamaan motif Candi Pawon, Mendut, dan Borobudur menunjukkan hubungan fungsional sebagai satu kesatuan ritual, dengan Pawon sebagai upa angga (bagian pendukung) menuju Borobudur. Namun, beberapa ahli masih memperdebatkan fungsi pastinya karena terbatasnya bukti tertulis.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 26,
    title: 'Candi Mendut',
    subtitle: 'Candi Mendut merupakan candi bercorak keagamaan Buddha Mahayana yang didirikan pada masa pemerintahan Raja Indra dari Dinasti Syailendra, masa kerajaan Mataram Kuna pada abad ke-8 M.',
    category: 'sites',
    museum: 'Unit Wardun Borobudur', 
    period: 'Abad ke-8',
    image_url: '/src/assets/collections/Candi Mendut.jpg',
    description: 'Candi Mendut merupakan candi bercorak keagamaan Buddha Mahayana yang didirikan pada masa pemerintahan Raja Indra dari Dinasti Syailendra, masa kerajaan Mataram Kuna pada abad ke-8 M. Candi ini dibangun tidak jauh dari Candi Borobudur dan Candi Pawon, membentuk satu rangkaian spiritual Buddhis. Arsitekturnya yang persegi panjang dengan tiga bagian (kaki, tubuh, atap) menampilkan tiga arca utama: Adhi Buddha (pemutar roda dharma), Avalokiteshvara, dan Vajrapani. Relief pada Candi Mendut menggambarkan cerita Jataka, Tantri, dan Pancatantra, serta tokohtokoh penting seperti Hariti dan Kuwera yang melambangkan kesuburan dan perlindungan anak. Relief Bodhisattva seperti Manjushri, Padmapani, Maitreya, Samantabhadra, dan lainnya menunjukkan adanya pemujaan terhadap Asta Maha Bodhisattva (delapan Bodhisattva utama). Keberadaan arca dan relief tersebut mengindikasikan bahwa Candi Mendut berfungsi tidak hanya sebagai tempat pemujaan Buddha, tetapi kemungkinan juga sebagai tempat penobatan raja pada masa Mataram Kuna.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 27,
    title: 'Kawasan Percandian Dieng',
    subtitle: 'Kawasan Cagar Budaya Percandian Dieng, sebuah kumpulan candi Hindu yang terletak di dataran tinggi kaki Pegunungan Dieng pada ketinggian sekitar 2000 mdpl, membentang sepanjang 1900 meter dari utara ke selatan dengan lebar 800 meter.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: 'Abad ke-8',
    image_url: '/src/assets/collections/Kawasan Percandian Dieng.jpeg',
    description: 'Kawasan Cagar Budaya Percandian Dieng, sebuah kumpulan candi Hindu yang terletak di dataran tinggi kaki Pegunungan Dieng pada ketinggian sekitar 2000 mdpl, membentang sepanjang 1900 meter dari utara ke selatan dengan lebar 800 meter. Secara administratif, kompleks ini terbagi antara Kabupaten Banjarnegara (meliputi Kelompok Percandian Arjuna, Dwarawati, Parikesit, Bima, dan Gangsiran Aswatama) dan Kabupaten Wonosobo (termasuk Petirtaan Bima Lukar, Watu Kelir, dan Situs Sitinggil), dengan Kali Tulis sebagai batas pembatas. Kawasan ini telah ditetapkan sebagai cagar budaya sejak tahun 1998 karena menyimpan sejarah peradaban Hindu dari abad ke-8 hingga ke-12 M, ditandai dengan keberadaan candi-candi dan struktur ritual lainnya. Pembangunan kompleks di puncak gunung dengan suhu dingin ini menunjukkan dedikasi spiritual luar biasa dari para pembangunnya.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 28,
    title: 'Kompleks Percandian Gedongsongo',
    subtitle: 'Candi Gedong Songo, terletak di lereng Gunung Ungaran, Jawa Tengah, merupakan kompleks percandian Hindu dari abad ke-8 hingga ke-9 Masehi yang terdiri dari sembilan candi kecil yang tersebar di ketinggian 1.200-1.400 mdpl.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: 'Abad ke-8',
    image_url: '/src/assets/collections/Kompleks Percandian Gedongsongo.JPG',
    description: 'Candi Gedong Songo, terletak di lereng Gunung Ungaran, Jawa Tengah, merupakan kompleks percandian Hindu dari abad ke-8 hingga ke-9 Masehi yang terdiri dari sembilan candi kecil yang tersebar di ketinggian 1.200-1.400 mdpl. Candi-candi ini diduga kuat dibangun pada masa Wangsa Sanjaya dan memiliki kesamaan gaya arsitektur dengan Candi Dieng, meskipun ukurannya lebih kecil dan sederhana. Situs ini terletak pada lokasi yang strategis di kawasan pegunungan dengan pemandangan alam memukau, serta pola penyebaran candi yang mengikuti kontur alam, menunjukkan adaptasi terhadap lingkungan berbukit. Candi-candi tersebut umumnya dipersembahkan untuk Dewa Siwa, dengan ditemukannya "lingga-yoni" dan arca-arca Hindu di beberapa candi, meskipun kondisi sebagian besar struktur sudah tidak utuh lagi.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 29,
    title: 'Situs Candi Sukuh',
    subtitle: 'Situs Cagar Budaya Candi Sukuh terletak di Desa Berjo, Kecamatan Ngargoyoso, Kab. Karanganyar, Jawa Tengah.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: 'Abad ke-15',
    image_url: '/src/assets/collections/Situs Candi Sukuh.jpeg',
    description: 'Situs Cagar Budaya Candi Sukuh terletak di Desa Berjo, Kecamatan Ngargoyoso, Kab. Karanganyar, Jawa Tengah. Candi Sukuh dibangun pada akhir periode klasik Hindu-Buddha (masa akhir Majapahit) sekitar abad ke-15 Masehi, pada masa pemerintahan Ratu Suhita (1429-1446). Situs Candi Sukuh terdiri atas 3 halaman teras yang semakin ke belakang semakin tinggi. Setiap teras dibatasi pagar/talud batu dan untuk memasuki masing- masing teras harus melalui sebuah gapura. Pada halaman ketiga, halaman yang paling sakral terdapat struktur candi utama Sukuh berukuran 15 x 15 meter. Candi utama di Sukuh berbentuk "piramida terpancung". Bentuk khas piramida terpancung merupakan karya kreatif yang sangat langka, tidak umum ditemui di candi-candi lain di Indonesia. Candi Sukuh sarat akan nilai pembebasan, penyucian kembali atau ruwatan dan mitologi ikonik dari tokoh-tokoh arca yang ditemui. Cerita dan tokoh tersebut menjadi ciri khas Candi Sukuh, yaitu Garudeya (pembebasan Dewi Winata), Bima Suci (pencerahan Bima oleh Dewa Ruci dalam kisah Bima mencari Tirtha Amrta, Sudhamala (pembebasan/pelepasan kutukan Dewi Durga oleh Sadewa), dan Samudramanthana',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 30,
    title: 'Situs Candi Cetho',
    subtitle: 'Candi Cetho, terletak di lereng Gunung Lawu pada ketinggian 1.400 mdpl di Kabupaten Karanganyar, Jawa Tengah, merupakan candi Hindu peninggalan akhir masa Majapahit (abad ke-15 Masehi) yang menunjukkan ciri khas arsitektur Jawa Timur periode akhir.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: 'Abad ke-15',
    image_url: '/src/assets/collections/Situs Candi Cetho.jpg',
    description: 'Candi Cetho, terletak di lereng Gunung Lawu pada ketinggian 1.400 mdpl di Kabupaten Karanganyar, Jawa Tengah, merupakan candi Hindu peninggalan akhir masa Majapahit (abad ke-15 Masehi) yang menunjukkan ciri khas arsitektur Jawa Timur periode akhir. Kata cetho sendiri berarti "jelas" dalam bahasa Jawa karena pemandangan luas dari lokasi candi. Candi Cetho terkait erat dengan Candi Sukuh dan diduga berfungsi sebagai situs suci penghormatan arwah leluhur dan monumen Hindu-Jawa dengan karakter lokal untuk pensucian diri. Candi Cetho memiliki struktur berundak paling banyak di Indonesia yaitu 13 teras, yang memadukan fungsi religius dan astronomis, serta dianggap sebagai tempat pertapaan dan pemujaan Siwa. Keunikannya terletak pada relief yang menggambarkan kisah wayang dan simbol-simbol spiritual, termasuk lingga-yoni yang masih digunakan untuk ritual hingga saat ini oleh masyarakat setempat. Ciri khas lain candi ini adalah arca berukuran besar dengan pahatan sederhana seperti arca Bima, dan gaya arsitekturnya menyerupai punden berundak. Meskipun diakui sebagai situs penting untuk memahami transisi Hindu-Buddha di Jawa pasca- Majapahit, keaslian candi ini menjadi bahan perdebatan karena telah mengalami rekonstruksi cukup signifikan pada tahun 1928 oleh Van der Vlis dan pemugaran kontroversial pada era 1970-an yang mengubah beberapa struktur aslinya.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 31,
    title: 'Kawasan Sangiran',
    subtitle: 'Kawasan Sangiran di Jawa Tengah merupakan salah satu situs prasejarah terpenting di dunia, dikenal sebagai "laboratorium evolusi manusia" yang menyumbangkan setidaknya 50% fosil Homo erectus dunia atau sekitar 60% fosil Homo erectus di Indonesia.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: '-',
    image_url: '/src/assets/collections/Kawasan Sangiran.jpg',
    description: 'Kawasan Sangiran di Jawa Tengah merupakan salah satu situs prasejarah terpenting di dunia, dikenal sebagai "laboratorium evolusi manusia" yang menyumbangkan setidaknya 50% fosil Homo erectus dunia atau sekitar 60% fosil Homo erectus di Indonesia. Sangiran ditetapkan sebagai Warisan Dunia UNESCO pada 1996 karena nilai pentingnya bagi dunia. Situs arkeologinya sendiri memiliki luas 59,21 km² dan berada di wilayah dua kabupaten, yaitu Kabupaten Sragen dan Karanganyar. Situs ini ini menyajikan rekaman kehidupan manusia purba sejak 2,4 juta tahun lalu beserta lingkungannya melalui lapisan stratigrafi yang utuh dari masa Pliosen-Holosen. Temuan penting dari Kawasan Sangiran di antaranya adalah fosil "Sangiran 17" (tengkorak Homo erectus terlengkap) dan berbagai alat batu paleolitik membuktikan perkembangan teknologi manusia purba di Asia.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 32,
    title: 'Candi Plaosan',
    subtitle: 'Candi Plaosan, terletak di Kabupaten Klaten, Jawa Tengah, merupakan kompleks candi unik dari abad ke-9 Masehi yang mencerminkan harmoni antara agama Hindu dan Buddha pada masa Kerajaan Medang.',
    category: 'sites',
    museum: 'CB Unit Jateng', 
    period: 'Abad ke-9',
    image_url: '/src/assets/collections/Candi Plaosan.jpeg',
    description: 'Candi Plaosan, terletak di Kabupaten Klaten, Jawa Tengah, merupakan kompleks candi unik dari abad ke-9 Masehi yang mencerminkan harmoni antara agama Hindu dan Buddha pada masa Kerajaan Medang. Dibangun atas prakarsa Rakai Pikatan dari Wangsa Sanjaya (Hindu) dan Permaisuri Pramodhawardhani dari Wangsa Syailendra (Buddha), kompleks candi yang dulunya disebut Jina Mandira ini terdiri dari Candi Plaosan Lor (utara) yang bercorak Buddha dengan arca-arca Bodhisattva dan Candi Plaosan Kidul (selatan) yang menunjukkan pengaruh Hindu. Keunikan arsitekturnya terlihat dari perpaduan gaya Jawa Tengah dan Jawa Timur, serta relief-relief halus yang menggambarkan kehidupan spiritual masa itu. Plaosan menjadi bukti nyata kerukunan antar umat beragama di masa lalu dan pencapaian seni yang tinggi. Arsitekturnya megah, unik, kaya ornamen yang indah. Arsitektur Candi Plaosan menunjukkan ciri khas dengan dua candi induk “kembar” dua lantai yang dikelilingi candi perwara dan stupa perwara serta parit buatan. Ciri khas dalam konsep religi tercermin dari keberadaan Pantheon tiga Trikaya Buddha serta relief dewa-dewi wewangian dan cahaya di kedua candi induknya. Arca-arcanya memiliki gaya seni tersendiri yang menjadi penanda zaman. Bentang pandang ke arah Gunung Merapi di utara dan deretan pegunungan breksi di Selatan. Golden moment saat sunrise dan sunset membentuk siluet percandian yang indah dan langka, dikelilingi lahan sawah dan tegalan yang luas, didukung nuansa pedesaan. Lokasinya dekat dengan candi-candi lainnya yang berada kawasan Prambanan yang juga kaya akan peninggalan budaya tak benda lainnya.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 33,
    title: 'Candi Prambanan',
    subtitle: 'Candi Prambanan, terletak di perbatasan Jawa Tengah dan Yogyakarta, adalah gugusan candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi oleh Wangsa Sanjaya.',
    category: 'sites',
    museum: 'CB Unit DIY', 
    period: 'Abad ke-9',
    image_url: '/src/assets/collections/Candi Prambanan.jpeg',
    description: 'Candi Prambanan, terletak di perbatasan Jawa Tengah dan Yogyakarta, adalah gugusan candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9 Masehi oleh Wangsa Sanjaya. Sebagai salah satu warisan budaya dunia UNESCO, Candi Prambanan memiliki tiga candi utama yang dipersembahkan untuk Trimurti (Siwa, Wisnu, dan Brahma). Candi Siwa adalah struktur utama setinggi 47 meter yang dihiasi relief epos Ramayana. Arsitekturnya yang megah menampilkan ciri khas Hindu Jawa dengan menara meru (atap bertingkat) dan patung-patung dewa yang detail, mencerminkan kejayaan Kerajaan Mataram Kuno. Gugusan candi ini diakui sebagai mahakarya seni dan spiritual yang diperkirakan ditinggalkan sekitar abad ke-10 Masehi, diduga akibat letusan Gunung Merapi atau perpindahan pusat kekuasaan ke Jawa Timur. Ciri khas arsitektur batu klasik Jawa Tengah dengan pahatan bas-relief yang indah, baik sebagai relief cerita maupun ornamentasi, menjadi daya tarik utama Candi Prambanan. Keberadaan gugusan candi Hindu ini berdampingan dengan candi Buddha di sekitarnya (Candi Sewu) juga menunjukkan toleransi agama dan praktik multikulturalisme pada masa itu. Gugusan Candi Prambanan, bersama Candi Sewu, telah ditetapkan sebagai Warisan Budaya Dunia oleh UNESCO pada tahun 1991 dengan nama Prambanan Temple Compound. Candi ini diakui sebagai karya adiluhung kreativitas manusia dari abad ke-10 M dan contoh harmonisasi arsitektur, teknologi, dan lanskap budaya yang menggambarkan tahapan penting dalam sejarah manusia.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 34,
    title: 'Candi Ratu Boko',
    subtitle: 'Kompleks Ratu Boko adalah kawasan arkeologi yang unik yang terletak di perbukitan Sleman, Yogyakarta, dengan karakteristik campuran antara istana kerajaan dan struktur religius.',
    category: 'sites',
    museum: 'CB Unit DIY', 
    period: 'Abad ke-8',
    image_url: '/src/assets/collections/Candi Ratu Boko.jpeg',
    description: 'Kompleks Ratu Boko adalah kawasan arkeologi yang unik yang terletak di perbukitan Sleman, Yogyakarta, dengan karakteristik campuran antara istana kerajaan dan struktur religius. Berdasarkan prasasti yang ditemukan, situs ini diperkirakan dibangun pada abad ke-8 Masehi oleh Wangsa Sailendra atau Mataram Kuno. Arsitekturnya yang megah terbagi menjadi lima kelompok utama: Gapura Utama, Paseban (area pertemuan), Keputren (kompleks wanita), Pendapa (aula), dan Gua (termasuk Gua Lanang dan Gua Wadon), masing-masing dengan karakteristik arsitektur dan fungsinya sendiri, lengkap dengan batur, kolam, pagar, dan struktur pendukung lainnya yang menunjukkan kemahiran teknik masa itu. Keunikan situs ini terletak pada perpaduan unsur Hindu dan Buddha yang tercermin dalam relief dan struktur bangunan, menunjukkan toleransi beragama di masa lalu.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 35,
    title: 'Candi Ijo',
    subtitle: 'Candi Ijo merupakan candi Hindu dari abad ke-9 hingga ke-10 Masehi yang terletak di Bukit Ijo, Sleman, Yogyakarta, pada ketinggian 357 meter di atas permukaan laut.',
    category: 'sites',
    museum: 'CB Unit DIY', 
    period: 'Abad ke-9',
    image_url: '/src/assets/collections/Candi Ijo.jpeg',
    description: 'Candi Ijo merupakan candi Hindu dari abad ke-9 hingga ke-10 Masehi yang terletak di Bukit Ijo, Sleman, Yogyakarta, pada ketinggian 357 meter di atas permukaan laut. Sebagai salah satu candi di lokasi tertinggi di Yogyakarta, situs ini terdiri dari satu candi utama dan 17 struktur bangunan yang tersebar di sebelas teras berundak, memanfaatkan kontur bukit untuk menciptakan tata ruang yang hierarkis. Pada candi utama terdapat lingga-yoni yang melambangkan Dewa Siwa dan Dewi Parwati, serta relungrelung untuk arca Agastya, Ganesha, dan Durga di dinding luarnya. Di depan candi induk, terdapat tiga candi perwara yang menghadap timur; candi perwara tengah berisi arca Nandi dan meja batu. Selain itu, di halaman utama terdapat delapan lingga patok yang mengelilingi mata angin, dan sisa-sisa bangunan lain tersebar di teras-teras lainnya, meskipun beberapa teras tidak memiliki struktur yang ditemukan. Candi Ijo merupakan contoh adaptasi arsitektur Hindu terhadap topografi alam dengan nilai spiritual yang tinggi.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 36,
    title: 'Candi Sambisari',
    subtitle: 'Candi Sambisari merupakan candi Hindu yang ditemukan secara tidak sengaja pada tahun 1966 oleh seorang petani di Sleman, Yogyakarta.',
    category: 'sites',
    museum: 'CB Unit DIY', 
    period: 'Abad ke-9',
    image_url: '/src/assets/collections/Candi Sambisari.jpeg',
    description: 'Candi Sambisari merupakan candi Hindu yang ditemukan secara tidak sengaja pada tahun 1966 oleh seorang petani di Sleman, Yogyakarta. Keunikan utama candi ini terletak pada posisinya yang berada 6,5 meter di bawah permukaan tanah, memunculkan teori bahwa candi ini terkubur oleh material vulkanik dari letusan Gunung Merapi kuno. Candi ini terdiri dari satu candi utama yang didedikasikan untuk Dewa Siwa dan tiga candi perwara yang lebih kecil, dengan struktur batu andesit yang relatif utuh meskipun bagian atapnya telah runtuh. Arsitektur Candi Sambisari menunjukkan ciri khas candi Hindu Jawa Tengah dengan relief yang menggambarkan dewa-dewa Hindu seperti Durga, Ganesha, dan Agastya. Temuan penting di situs ini termasuk lingga-yoni dan beberapa arca yang menunjukkan fungsi candi sebagai tempat pemujaan Siwa. Sejarah pasti pendiriannya belum jelas, namun arsitektur dan inskripsi "om siwa sthana" pada lempeng emas pada peripih mengindikasikan bahwa Candi Sambisari didirikan antara abad ke-8 hingga ke-9 Masehi, sezaman dengan candi-candi terdekat seperti Lumbung, Gebang, Batumiring, Prambanan, Plaosan, dan Sojiwan. Setelah penemuan, candi ini menjalani rekonstruksi sementara dari 1966-1975, pemugaran dari 1975-1987, dan diresmikan setelah purna pugar pada tahun 1987. Candi Sambisari merupakan saksi bisu letusan Merapi masa lalu.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 37,
    title: 'Kawasan Trowulan',
    subtitle: 'Kawasan Trowulan di Mojokerto, Jawa Timur, diyakini sebagai bekas ibu kota Kerajaan Majapahit (abad ke-13 hingga ke-16 Masehi) dan merupakan kompleks arkeologi terpenting dari periode klasik Indonesia.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: '-',
    image_url: '/src/assets/collections/Kawasan Trowulan.jpg',
    description: 'Kawasan Trowulan di Mojokerto, Jawa Timur, diyakini sebagai bekas ibu kota Kerajaan Majapahit (abad ke-13 hingga ke-16 Masehi) dan merupakan kompleks arkeologi terpenting dari periode klasik Indonesia. Situs seluas sekitar 100 km² ini menyimpan berbagai tinggalan seperti candi (misalnya Candi Tikus dan Candi Bajang Ratu), kolam kuno, saluran air, serta struktur permukiman yang menunjukkan tata kota Majapahit yang maju. Temuan arkeologis seperti artefak keramik asing, perhiasan emas, dan prasasti memperkuat gambaran Trowulan sebagai pusat politik, ekonomi, dan budaya yang terhubung dengan jaringan perdagangan Asia.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 38,
    title: 'Candi Panataran',
    subtitle: 'Candi Panataran, terletak di Kabupaten Blitar, Jawa Timur, merupakan candi kerajaan (state temple) terbesar peninggalan Majapahit yang berfungsi sebagai pusat spiritual dan keagamaan antara abad ke- 14 hingga ke-15 Masehi.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: 'Abad ke-14',
    image_url: '/src/assets/collections/Candi Panataran.jpg',
    description: 'Candi Panataran, terletak di Kabupaten Blitar, Jawa Timur, merupakan candi kerajaan (state temple) terbesar peninggalan Majapahit yang berfungsi sebagai pusat spiritual dan keagamaan antara abad ke- 14 hingga ke-15 Masehi. Dibangun secara bertahap sejak masa Raja Jayanagara hingga Ratu Suhita, kompleks candi terdiri dari tiga halaman bertingkat dengan struktur utama seperti Candi Induk, Candi Naga, dan Bale Agung, serta dua kolam suci (patirthan). Keunikan candi ini terletak pada relief naratif seperti Ramayana dan Kresnayana, serta ornamen naga yang dominan, mencerminkan perpaduan seni, filosofi Hindu-Siwa, dan kosmologi. Sebagai pusat pemujaan Paramasiva (Siwa tertinggi dalam ajaran Siwasiddhanta), Candi Panataran juga diduga berfungsi sebagai kadewaguruan (pusat pendidikan agama), sebagaimana disebut dalam naskah Bhujangga Manik. Relief dan arsitekturnya menyimbolkan konsep axis mundi (poros alam semesta) dan mitologi Samudramanthana, dengan naga sebagai penjaga keseimbangan kosmis. Namun, ketiadaan arca utama di garbhagrha (ruang suci) dan kerusakan sebagian struktur memunculkan perdebatan tentang fungsi spesifik dan bentuk asli candi.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 39,
    title: 'Candi Kidal',
    subtitle: 'Candi Kidal, terletak di Desa Kidal, Malang, Jawa Timur, adalah candi Hindu Siwa dari abad ke-13 Masehi yang dibangun sebagai tempat pendharmaan Raja Anusapati dari Kerajaan Singasari.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: 'Abad ke-13',
    image_url: '/src/assets/collections/Candi Kidal.jpg',
    description: 'Candi Kidal, terletak di Desa Kidal, Malang, Jawa Timur, adalah candi Hindu Siwa dari abad ke-13 Masehi yang dibangun sebagai tempat pendharmaan Raja Anusapati dari Kerajaan Singasari. Candi ini merupakan salah satu contoh awal arsitektur Jawa Timuran dengan struktur ramping, tinggi sekitar 12 meter, dan terbuat dari batu andesit. Candi Kidal memiliki tiga bagian utama: kaki candi yang dihiasi relief cerita Garudeya (simbol pembebasan dari dosa), tubuh candi dengan relung kosong (diduga sebelumnya berisi arca Siwa), dan atap bertingkat dengan hiasan kemuncak (ratna). Keunikan Candi Kidal terletak pada relief Garudeya yang mengelilingi kaki candi, menceritakan kisah Garuda yang berjuang membebaskan ibunya dari perbudakan dengan mencuri tirta amerta. Relief ini tidak hanya bernilai artistik, tetapi juga mengandung pesan moral tentang pengorbanan dan penebusan.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 40,
    title: 'Candi Badut',
    subtitle: 'Candi Badut merupakan salah satu candi Hindu tertua di Jawa Timur, diperkirakan dibangun pada abad ke-8 Masehi pada masa Kerajaan Kanjuruhan di bawah pemerintahan Raja Gajayana.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: '-',
    image_url: '/src/assets/collections/Candi Badut.jpg',
    description: 'Candi Badut merupakan salah satu candi Hindu tertua di Jawa Timur, diperkirakan dibangun pada abad ke-8 Masehi pada masa Kerajaan Kanjuruhan di bawah pemerintahan Raja Gajayana. Candi ini memiliki struktur unik yang menggabungkan elemen arsitektur Jawa Tengah (gaya Mataram Kuno) dengan ciri khas Jawa Timur, seperti bentuk tubuh candi yang ramping dan atap bersusun. Candi setinggi 8 meter ini terbuat dari batu andesit dan didedikasikan untuk pemujaan Dewa Siwa, dengan relung-relung yang kemungkinan pernah berisi arca Siwa, Durga, dan Ganesha. Keunikan Candi Badut terletak pada ornamen kalamakara di atas pintu masuk dan relief sederhana yang menunjukkan pengaruh seni India awal. Prasasti Dinoyo (760 M) yang ditemukan di sekitar candi menguatkan dugaan bahwa candi ini dibangun sebagai bagian dari kompleks keagamaan Kerajaan Kanjuruhan. Candi Badut merupakan bukti penting perkembangan awal Hindu-Siwa di Jawa Timur dan transisi gaya arsitektur Jawa Tengah ke Jawa Timur.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 41,
    title: 'Candi Jago',
    subtitle: 'Candi Jago, terletak di Tumpang, Malang, Jawa Timur, adalah candi peninggalan Kerajaan Singasari dari abad ke-13 Masehi yang dibangun sebagai tempat pendharmaan Raja Wisnuwardhana (ayah Raja Kertanegara).',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: '-',
    image_url: '/src/assets/collections/Candi Jago.jpg',
    description: 'Candi Jago, terletak di Tumpang, Malang, Jawa Timur, adalah candi peninggalan Kerajaan Singasari dari abad ke-13 Masehi yang dibangun sebagai tempat pendharmaan Raja Wisnuwardhana (ayah Raja Kertanegara). Candi ini memiliki keunikan arsitektur dengan bentuk teras bertingkat (punden berundak). Candi setinggi sekitar 10 meter ini juga terkenal dengan reliefnya yang sangat detail, terutama cerita Kunjarakarna dan Pancatantra, yang dipahat mengelilingi tubuh candi. Relief ini tidak hanya bernilai artistik tinggi, tetapi juga mengandung ajaran moral dan spiritual. Namun demikian, kondisi candi yang tidak utuh karena bagian atap dan sebagian struktur telah hilang, menyulitkan rekonstruksi lengkap bentuk aslinya. Candi Jago dianggap sebagai mahakarya seni relief masa Singasari dan bukti penting sinkretisme Hindu-Buddha di Jawa pada masa lalu.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 42,
    title: 'Candi Singasari',
    subtitle: 'Candi Singasari, terletak di Desa Candirenggo, Malang, Jawa Timur, merupakan candi Hindu-Buddha peninggalan Kerajaan Singasari yang dibangun sekitar abad ke-13 Masehi.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: 'Abad ke-13',
    image_url: '/src/assets/collections/Candi Singasari.jpeg',
    description: 'Candi Singasari, terletak di Desa Candirenggo, Malang, Jawa Timur, merupakan candi Hindu-Buddha peninggalan Kerajaan Singasari yang dibangun sekitar abad ke-13 Masehi. Candi ini diduga kuat sebagai tempat pendharmaan Raja Kertanegara, raja terakhir Singasari yang gugur dalam serangan Kerajaan Kediri tahun 1292. Dengan tinggi sekitar 15 meter, candi ini menampilkan gaya arsitektur khas Jawa Timuran yang megah, meskipun kini dalam kondisi tidak utuh, atap dan sebagian tubuh candi telah runtuh. Keunikan Candi Singasari terletak pada ornamennya yang kaya, termasuk patung-patung raksasa (Dwarapala) penjaga pintu setinggi 3,7 meter yang masih berdiri kokoh di kompleks candi. Relief dan arca yang ditemukan menunjukkan perpaduan unsur Hindu (terutama Siwa) dan Buddha, mencerminkan sinkretisme agama pada masa Kerajaan Singasari.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 43,
    title: 'Candi Jabung',
    subtitle: 'Candi Jabung merupakan candi Buddha peninggalan Majapahit yang terletak di Desa Jabung, Probolinggo, Jawa Timur, diperkirakan dibangun pada abad ke-14 Masehi.',
    category: 'sites',
    museum: 'CB Unit Jatim', 
    period: 'Abad ke-14',
    image_url: '/src/assets/collections/Candi Jabung.jpg',
    description: 'Candi Jabung merupakan candi Buddha peninggalan Majapahit yang terletak di Desa Jabung, Probolinggo, Jawa Timur, diperkirakan dibangun pada abad ke-14 Masehi. Candi ini disebutkan dalam kitab Nagarakretagama sebagai salah satu tempat yang dikunjungi Raja Hayam Wuruk selama perjalanan keliling kerajaannya. Dengan tinggi 16 meter, Candi Jabung memiliki struktur unik berbentuk silinder (seperti stupa) yang terbuat dari bata merah, berbeda dengan candi-candi Jawa Timur umumnya yang berbentuk persegi. Keunikan Candi Jabung terletak pada arsitekturnya yang menyerupai candi-candi di India Selatan, dengan relief cerita Sri Tanjung yang mengelilingi dinding candi. Relief ini tidak hanya bernilai seni tinggi, tetapi juga mengandung pesan spiritual tentang kesetiaan dan penebusan dosa.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 44,
    title: 'Leang Pettae',
    subtitle: 'Leang Pettae adalah gua yang terletak di Kelurahan Leang-Leang, Kecamatan Bantimurung, Kabupaten Maros, dalam kawasan Karst Maros-Pangkep.',
    category: 'sites',
    museum: 'CB Unit Sulawesi dan Maluku', 
    period: '-',
    image_url: '',
    description: 'Leang Pettae adalah gua yang terletak di Kelurahan Leang-Leang, Kecamatan Bantimurung, Kabupaten Maros, dalam kawasan Karst Maros-Pangkep. Gua ini merupakan lokasi pertama ditemukannya lukisan cadas di Sulawesi, menjadikannya tonggak penting dalam kajian arkeologi Sulawesi. Temuan dari gua ini meliputi lukisan cadas cap tangan dan babirusa berwarna merah, artefak mikrolit, maros point, lancipan, sampah dapur (kjokkenmoddinger), serta fosil fauna endemik seperti babirusa dan monyet hitam. Leang Pettae ditetapkan sebagai Cagar Budaya pada 10 Januari 2018. Gua ini memiliki nilai penting sebagai tempat identifikasi awal seni cadas di Sulawesi, representasi ekspresi budaya Toala, dan bukti kehidupan manusia prasejarah di Indonesia. Sebagai bagian dari Taman Arkeologi Leang-Leang, gua ini difungsikan sebagai objek wisata edukatif yang dapat diakses oleh publik.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 45,
    title: 'Leang Petta Kere',
    subtitle: 'Terletak tidak jauh dari Leang Pettae, sekitar 300 meter ke arah timur, Leang Petta Kere berada di Kelurahan Leang-Leang, Kecamatan Bantimurung, Kabupaten Maros.',
    category: 'sites',
    museum: 'CB Unit Sulawesi dan Maluku', 
    period: '-',
    image_url: '/src/assets/collections/Leang Petta Kere.jpeg',
    description: 'Terletak tidak jauh dari Leang Pettae, sekitar 300 meter ke arah timur, Leang Petta Kere berada di Kelurahan Leang-Leang, Kecamatan Bantimurung, Kabupaten Maros. Gua ini berada pada ketinggian sekitar 45 Mdpl serta merupakan salah satu gua di kawasan Karst Maros-Pangkep. Gua ini menyimpan tinggalan budaya yang sangat penting berupa lukisan cadas bergambar cap tangan dan babirusa, artefak mikrolit, maros point, serta sampah dapur (kjøkkenmoddinger). Lukisan cap tangan berjumlah sekitar 27 buah, dengan sebagian besar masih dalam kondisi utuh. Salah satu lukisan paling ikonik adalah gambar babirusa besar yang ditusuk tombak dan dikelilingi cap-cap tangan, yang menyampaikan ekspresi artistik masa lalu secara kuat. Pewarna merah pada lukisan diyakini berasal dari hematit (mineral besi alami) yang disemprotkan ke dinding gua. Leang Petta Kere merupakan gua pertama yang dikonservasi di kawasan Karst Maros-Pangkep, melalui kegiatan konservasi yang dilakukan oleh Suaka Peninggalan Sejarah dan Purbakala (SPSP) tahun 1986. Situs ini ditetapkan sebagai Cagar Budaya Kabupaten Maros pada 10 Januari 2018. Selain penting dari sisi arkeologi, Leang Petta Kere juga menjadi pelopor upaya konservasi gambar gua prasejarah di Indonesia dan saat ini difungsikan sebagai destinasi edukatif dalam kawasan Taman Arkeologi Leang-Leang.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 46,
    title: 'Benteng Rotterdam',
    subtitle: 'Benteng Rotterdam, yang semula bernama Benteng Jumpandang dan dibangun oleh Kerajaan Gowa-Tallo pada abad ke-15 M, kemudian dikembangkan oleh VOC pada abad ke-17 menjadi struktur seperti sekarang.',
    category: 'sites',
    museum: 'CB Unit Sulawesi dan Maluku', 
    period: 'Abad ke-15',
    image_url: '/src/assets/collections/Benteng Rotterdam.jpg',
    description: 'Benteng Rotterdam, yang semula bernama Benteng Jumpandang dan dibangun oleh Kerajaan Gowa-Tallo pada abad ke-15 M, kemudian dikembangkan oleh VOC pada abad ke-17 menjadi struktur seperti sekarang. Dengan denah menyerupai penyu dan lima bastion, benteng ini telah menjadi saksi bisu berbagai peristiwa sejarah, termasuk penahanan Pangeran Diponegoro yang bahkan menyusun catatannya di sini. Setelah berbagai fungsi mulai dari markas komando hingga pusat penelitian, benteng ini dipugar pada tahun 1970 dan kini menjadi kantor serta rumah bagi Museum La Galigo.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
  {
    id: 47,
    title: 'Benteng Duurstede',
    subtitle: 'Benteng Duurstede terletak di Pulau Saparua, Maluku Tengah.',
    category: 'sites',
    museum: 'CB Unit Sulawesi dan Maluku', 
    period: '-',
    image_url: '/src/assets/collections/Benteng Duurstede.jpg',
    description: 'Benteng Duurstede terletak di Pulau Saparua, Maluku Tengah. Awalnya dibangun oleh Portugis pada 1676 dan dibangun kembali oleh Gubernur Ambon, Nicolaes Schaghen, pada 1691. Arsitekturnya berbentuk belah ketupat dengan bastion berbentuk setengah lingkaran di sisi utara dan selatan, serta dua menara pengintai di sisi timur dan barat. Benteng ini menjadi saksi peristiwa penyerangan pada 16 Mei 1817 oleh rakyat Saparua yang dipimpin oleh Kapitan Pattimura. Seluruh penghuni benteng, termasuk Residen Jan Rudolf van den Berg dan keluarganya, gugur dalam peristiwa tersebut, kecuali putranya Johan Lubbert. Peristiwa ini dikenang sebagai bagian penting dari perlawanan rakyat Maluku terhadap kolonialisme Belanda.',
    material: 'Baja dengan pamor, gagang kayu, sarung kayu',
    dimensions: 'Panjang total: 45 cm, Panjang bilah: 32 cm',
    origin: 'Trowulan, Mojokerto, Jawa Timur',
    discovered_year: '1965',
    condition: 'Baik, terawat dengan preservasi khusus',
    significance: 'Keris ini memiliki nilai sejarah tinggi sebagai bukti kemajuan teknologi metallurgi pada masa Majapahit. Pamor pada bilahnya menunjukkan teknik penempaan yang sangat canggih.',
    cultural_context: 'Dalam budaya Jawa, keris bukan hanya senjata tetapi juga simbol status, kekuatan spiritual, dan warisan keluarga yang diwariskan turun temurun.',
    related_artifacts: [
      'Tombak Majapahit',
      'Pedang Ceremonial',
      'Perhiasan Emas Majapahit'
    ]
  },
];
export const defaultHeritages = [
  {
    id: 1,
    title: 'Benteng Marlborough',
    subtitle: 'Benteng Marlborough dibangun pada tahun 1714.',
    type: 'fortress',
    location: 'Jalan Benteng, Kebun Keling, Kec. Tlk. Segara, Kota Bengkulu, Bengkulu 38116',
    period: 'Abad ke-17',
    image_url: '/src/assets/sites/Benteng Marlborough.png',
    description: 'Nama Marlborough sendiri berasal dari seorang Jenderal Inggris terkenal, John Churchill Duke of Marlborough yang hidup di awal abad ke-17. Benteng ini dibangun dekat dengan tepi pantai dan terletak di sebuah tanah yang agak tinggi agar dapat lebih mudah mengawasi wilayah tersebut. Dalam proses pembangunannya, EIC meminta bantuan dari rakyat Bengkulu.',
    full_description: 'Benteng Marlborough dibangun pada tahun 1714. Nama Marlborough sendiri berasal dari seorang Jenderal Inggris terkenal, John Churchill Duke of Marlborough yang hidup di awal abad ke-17. Benteng ini dibangun dekat dengan tepi pantai dan terletak di sebuah tanah yang agak tinggi agar dapat lebih mudah mengawasi wilayah tersebut. Dalam proses pembangunannya, EIC meminta bantuan dari rakyat Bengkulu.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 2,
    title: 'Rumah Bekas Kediaman Bung Karno',
    subtitle: 'Salah satu tempat pengasingan Ir. Soekarno berada di Kota Bengkulu.',
    type: 'sites',
    location: 'Jalan Soekarno Hatta No.8, Anggut Atas, Kec. Gading Cempaka, Kota Bengkulu, Bengkulu 38222',
    period: 'Tahun 1938 hingga tahun 1942',
    image_url: '/src/assets/sites/Rumah Bekas Kediaman Bung Karno.png',
    description: 'Selama pengasingannya di Bengkulu, Bung Karno ditempatkan di sebuah rumah yang awalnya adalah tempat tinggal pengusaha yang bernama Tan Eng Cian. Tan Eng Cian menyuplai bahan pokok untuk kebutuhan pemerintahan kolonial Belanda. Soekarno menempati rumah tersebut dari tahun 1938 hingga tahun 1942.',
    full_description: 'Salah satu tempat pengasingan Ir. Soekarno berada di Kota Bengkulu. Selama pengasingannya di Bengkulu, Bung Karno ditempatkan di sebuah rumah yang awalnya adalah tempat tinggal pengusaha yang bernama Tan Eng Cian. Tan Eng Cian menyuplai bahan pokok untuk kebutuhan pemerintahan kolonial Belanda. Soekarno menempati rumah tersebut dari tahun 1938 hingga tahun 1942.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 3,
    title: 'Situs Banten Lama',
    subtitle: 'Kota Kuno Banten atau Banten Lama adalah kawasan situs bersejarah yang merupakan peninggalan dari sisa kejayaan Kesultanan Banten.',
    type: 'sites',
    location: 'Jalan Raya Serang - Jakarta, Kec. Serang, Kota Serang, Banten 42191',
    period: '-',
    image_url: '/src/assets/sites/Situs Banten Lama.png',
    description: 'Di tempat ini terdapat banyak situs peninggalan dari Kesultanan Banten, diantaranya Keraton Surosawan, Masjid Agung Banten, Situs Istana Kaibon, Benteng Speelwijk, Danau Tasikardi, Meriam Ki Amuk, Pelabuhan Karangantu dan Vihara Avalokitesvara.',
    full_description: 'Kota Kuno Banten atau Banten Lama adalah kawasan situs bersejarah yang merupakan peninggalan dari sisa kejayaan Kesultanan Banten. Di tempat ini terdapat banyak situs peninggalan dari Kesultanan Banten, diantaranya Keraton Surosawan, Masjid Agung Banten, Situs Istana Kaibon, Benteng Speelwijk, Danau Tasikardi, Meriam Ki Amuk, Pelabuhan Karangantu dan Vihara Avalokitesvara.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 4,
    title: 'Kawasan Trowulan',
    subtitle: 'Satuan ruang geografis Trowulan mengandung tinggalan purbakala masa kerajaan Mataram Kuno sampai dengan Majapahit abad X-XVI, berupa candi, gapura, kolam, waduk, jaringan kanal, unsur bangunan, ribuan peralatan rumah tangga dari terakota dan keramik.',
    type: 'sites',
    location: 'Kec. Trowulan, Kab. Mojokerto,Jawa Timur',
    period: 'Abad ke-26',
    image_url: '/src/assets/sites/Kawasan Trowulan.png',
    description: 'Temuan tersebut mengindikasikan satuan ruang geografis ini sebagai permukiman yang padat.',
    full_description: 'Satuan ruang geografis Trowulan mengandung tinggalan purbakala masa kerajaan Mataram Kuno sampai dengan Majapahit abad X-XVI, berupa candi, gapura, kolam, waduk, jaringan kanal, unsur bangunan, ribuan peralatan rumah tangga dari terakota dan keramik. Temuan tersebut mengindikasikan satuan ruang geografis ini sebagai permukiman yang padat.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 5,
    title: 'Benteng Rotterdam',
    subtitle: 'Benteng Rotterdam sebelumnya adalah benteng peninggalan Kerajaan Gowa-Tallo yang bernama Benteng Jumpandang yang dibangun pada abad XV, pada abad XVII dimanfaatkan dan dikembangkan oleh VOC menjadi seperti sekarang.',
    type: 'fortress',
    location: 'No.Road, Jalan Ujung Pandang, Bulo Gading, Kec. Ujung Pandang, Kota Makassar, Sulawesi Selatan 90171',
    period: 'Abad ke-15',
    image_url: '/src/assets/sites/Benteng Rotterdam.png',
    description: 'Benteng Rotterdam merupakan salah satu dari 15 benteng pengawal yang dibangun oleh Kerajaan Gowa-Tallo.',
    full_description: 'Benteng Rotterdam sebelumnya adalah benteng peninggalan Kerajaan Gowa-Tallo yang bernama Benteng Jumpandang yang dibangun pada abad XV, pada abad XVII dimanfaatkan dan dikembangkan oleh VOC menjadi seperti sekarang. Benteng Rotterdam merupakan salah satu dari 15 benteng pengawal yang dibangun oleh Kerajaan Gowa- Tallo.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 6,
    title: 'Makam Raja-raja Tallo',
    subtitle: 'Kompleks makam ini adalah tempat Raja-raja Tallo dimakamkan mulai Abad XVII s.d XIX.',
    type: 'sites',
    location: 'Jl. Sultan Abdullah Raya belakang makam raja, raja, Kec. Tallo, Kota Makassar, Sulawesi Selatan 90212',
    period: 'Abad ke-17 - Abad ke-19',
    image_url: '/src/assets/sites/Makam Raja-raja Tallo.png',
    description: 'Di kompleks makam ini diantaranya terdapat makam Mangkubumi kerajaan Gowa-Tallo, bernama I Malingkaang Daeng Manyonri dan makam seorang ulama dari Sumatera, bernama Khatib Tunggal Datuk Makmur, atau populer dengan nama Datuk Ri Bandang. I Malingkaang Daeng Manyonri, merupakan orang pertama yang memeluk agama Islam di Kerajaan Gowa-Tallo.',
    full_description: 'Kompleks makam ini adalah tempat Raja-raja Tallo dimakamkan mulai Abad XVII s.d XIX. Di kompleks makam ini diantaranya terdapat makam Mangkubumi kerajaan Gowa-Tallo, bernama I Malingkaang Daeng Manyonri dan makam seorang ulama dari Sumatera, bernama Khatib Tunggal Datuk Makmur, atau populer dengan nama Datuk Ri Bandang. I Malingkaang Daeng Manyonri, merupakan orang pertama yang memeluk agama Islam di Kerajaan Gowa-Tallo.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 7,
    title: 'Benteng Duurstede',
    subtitle: 'Benteng Duurstede adalah benteng peninggalan Belanda yang terdapat di daerah Saparua, Kabupaten Maluku Tengah.',
    type: 'fortress',
    location: 'Saparua, Kec. Saparua, Kabupaten Maluku Tengah, Maluku',
    period: 'Abad ke-17',
    image_url: '/src/assets/sites/Benteng Duurstede.png',
    description: 'Sejak dibangun pada abad ke-17, benteng yang terletak di tepi laut ini sempat berpindah tangan dari cengkeraman Portugis, Belanda, dan Inggris.',
    full_description: 'Benteng Duurstede adalah benteng peninggalan Belanda yang terdapat di daerah Saparua, Kabupaten Maluku Tengah. Sejak dibangun pada abad ke-17, benteng yang terletak di tepi laut ini sempat berpindah tangan dari cengkeraman Portugis, Belanda, dan Inggris.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 8,
    title: 'Makam Kyai Mojo',
    subtitle: 'Makam Kyai Mojo terletak di atas Bukit Tonda. Kyai Mojo terlahir dengan nama Muslim Muhammad Halifah.',
    type: 'sites',
    location: '8W7H+MJJ, Wulauan, Tondano Utara, Kembuan, Kec. Tondano Utara, Kabupaten Minahasa, Sulawesi Utara',
    period: 'Tahun 1849',
    image_url: '/src/assets/sites/Makam Kyai Mojo.png',
    description: 'Lahir tahun 1764 dan wafat 20 Desember 1849. Di lokasi makam ini terdapat dua buah cungkup berbentuk bangunan Jawa dengan atap sirap. Cungkup yang besar terdapat makam Kyai Mojo beserta pengikutnya, sementara cungkup lainnya merupakan makam Syeh Maulana (asal Cirebon).',
    full_description: 'Makam Kyai Mojo terletak di atas Bukit Tonda. Kyai Mojo terlahir dengan nama Muslim Muhammad Halifah. Lahir tahun 1764 dan wafat 20 Desember 1849. Di lokasi makam ini terdapat dua buah cungkup berbentuk bangunan Jawa dengan atap sirap. Cungkup yang besar terdapat makam Kyai Mojo beserta pengikutnya, sementara cungkup lainnya merupakan makam Syeh Maulana (asal Cirebon).',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 9,
    title: 'Situs Gunung Padang',
    subtitle: 'Keberadaan Gunung Padang dilaporkan pertama kali oleh Nicolaas Johannes Krom dalam Rapporten Oudheidkundige Dienst pada tahun 1914.',
    type: 'sites',
    location: 'Kp. Gunung Padang, Karyamukti, Kec. Campaka, Kabupaten Cianjur, Jawa Barat 43263',
    period: 'Tahun 1914',
    image_url: '/src/assets/sites/Situs Gunung Padang.png',
    description: 'Krom melaporkan bahwa di puncak Gunung Padang yang berdekatan dengan Gunung Melati terdapat empat teras yang disusun dari batu kasar dan dihiasi batu andesit berbentuk lingga. Di setiap teras terdapat gundukan tanah yang ditimbuni batu.',
    full_description: 'Keberadaan Gunung Padang dilaporkan pertama kali oleh Nicolaas Johannes Krom dalam Rapporten Oudheidkundige Dienst pada tahun 1914. Krom melaporkan bahwa di puncak Gunung Padang yang berdekatan dengan Gunung Melati terdapat empat teras yang disusun dari batu kasar dan dihiasi batu andesit berbentuk lingga. Di setiap teras terdapat gundukan tanah yang ditimbuni batu.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 10,
    title: 'Taman Purbakala Pugung Raharjo',
    subtitle: 'Situs Taman Purbakala Pugungraharjo di Lampung Timur adalah kompleks arkeologi luas yang mengungkapkan jejak peradaban dari zaman prasejarah hingga Hindu-Buddha.',
    type: 'sites',
    location: 'Pugung Raharjo, Kec. Sekampung Udik, Kabupaten Lampung Timur, Lampung 34384',
    period: '-',
    image_url: '/src/assets/sites/Taman Purbakala Pugung Raharjo.png',
    description: 'Situs ini menampilkan punden berundak, menhir, dan batu berlubang, serta artefak keramik dari Dinasti Han hingga Ming. Keberagaman artefak ini memberikan gambaran mendalam tentang perkembangan budaya dan teknologi masyarakat kuno di Lampung.',
    full_description: 'Situs Taman Purbakala Pugungraharjo di Lampung Timur adalah kompleks arkeologi luas yang mengungkapkan jejak peradaban dari zaman prasejarah hingga Hindu-Buddha. Situs ini menampilkan punden berundak, menhir, dan batu berlubang, serta artefak keramik dari Dinasti Han hingga Ming. Keberagaman artefak ini memberikan gambaran mendalam tentang perkembangan budaya dan teknologi masyarakat kuno di Lampung.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 11,
    title: 'Kawasan Sangiran',
    subtitle: 'Museum Manusia Purba Sangiran Klaster Krikilan, berdiri di tengah Kawasan Sangiran yang merupakan warisan dunia UNESCO.',
    type: 'museum',
    location: 'Jalan Sangiran No.Km. 4, Kebayanan II, Krikilan, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    period: '-',
    image_url: '/src/assets/sites/Kawasan Sangiran.png',
    description: 'Kawasan Sangiran dengan luas 59,21 km2 menyimpan lebih dari 50% temuan Homo erectus dunia. Sebagai etalase utama, Klaster Krikilan tidak hanya memamerkan rekonstruksi Homo erectus dari fosil Sangiran 17 (tengkorak Homo erectus paling lengkap di Asia) tetapi juga memperlihatkan fosil fauna prasejarah serta kisah para tokoh dan peneliti lokal yang berjasa dalam dunia kepurbakalaan nasional.',
    full_description: 'Situs Sangiran adalah salah satu situs manusia purba yang ada di dua wilayah kabupaten yang ada di Provinsi Jawa Tengah. Saat ini Situs Sangiran dikenal sebagai situs yang mampu menyumbangkan pengetahuan penting mengenai bukti-bukti evolusi manusia, evolusi fauna, kebudayaan, dan lingkungan, yang terjadi sejak dua juta tahun yang lalu. Situs Sangiran telah ditetapkan sebagai Warisan Budaya Dunia oleh UNESCO.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 12,
    title: 'Percandian Muaro Jambi',
    subtitle: 'Satuan ruang geografis Muaro Jambi adalah peninggalan Kerajaan Melayu Kuno dan Sriwijaya, menjadi pusat peribadatan agama Budha abad VII- XIII terluas di Indonesia.',
    type: 'sites',
    location: 'Jalan Gerbang Candi Muaro Jambi, Kec. Maro Sebo, Kabupaten Muaro Jambi, Jambi 36382',
    period: 'Abad ke-7 s.d. Abad ke-13',
    image_url: '/src/assets/sites/Percandian Muaro Jambi.png',
    description: 'Satuan ruang geografis Muaro Jambi adalah peninggalan Kerajaan Melayu Kuno dan Sriwijaya, menjadi pusat peribadatan agama Budha abad VII- XIII terluas di Indonesia.',
    full_description: 'Satuan ruang geografis Muaro Jambi adalah peninggalan Kerajaan Melayu Kuno dan Sriwijaya, menjadi pusat peribadatan agama Budha abad VII- XIII terluas di Indonesia.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 13,
    title: 'Percandian Batujaya',
    subtitle: 'Situs Batujaya pertama kali diteliti oleh tim arkeologi Fakultas Sastra Universitas Indonesia (sekarang disebut Fakultas Ilmu Budaya UI) pada tahun 1984 berdasarkan laporan adanya penemuan benda-benda purbakala di sekitar gundukan-gundukan tanah di tengah-tengah sawah.',
    type: 'sites',
    location: 'Jl Candi Jiwa, Dusun Sumurjaya, RT.11/RW.04, Segaran, Kec. Batujaya, Karawang, Jawa Barat 41354',
    period: '-',
    image_url: '/src/assets/sites/Percandian Batujaya.png',
    description: 'Gundukan-gundukan ini oleh penduduk setempat disebut sebagai onur atau unur dan dikeramatkan oleh warga sekitar.',
    full_description: 'Situs Batujaya pertama kali diteliti oleh tim arkeologi Fakultas Sastra Universitas Indonesia (sekarang disebut Fakultas Ilmu Budaya UI) pada tahun 1984 berdasarkan laporan adanya penemuan benda-benda purbakala di sekitar gundukan-gundukan tanah di tengah-tengah sawah. Gundukan-gundukan ini oleh penduduk setempat disebut sebagai onur atau unur dan dikeramatkan oleh warga sekitar.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 14,
    title: 'Candi Borobudur',
    subtitle: 'Candi Borobudur dibangun oleh Dinasti Syailendra antara tahun 750-842 M, adalah situs tinggalan sejarah yang megah di Jawa Tengah.',
    type: 'sites',
    location: 'Jalan Badrawati, Kw. Candi Borobudur, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah',
    period: 'Tahun 750-842 M',
    image_url: '/src/assets/sites/Candi Borobudur.png',
    description: 'Candi ini menampilkan keindahan relief dan patung Buddha yang memukau, mencerminkan puncak ajaran Buddha Mahayana. Sebagai situs warisan dunia UNESCO, Borobudur adalah tinggalan purbakala yang menunjukkan kebesaran dan kejayaan peradaban Bangsa Indonesia di masa lalu.',
    full_description: 'Candi Borobudur dibangun oleh Dinasti Syailendra antara tahun 750-842 M, adalah situs tinggalan sejarah yang megah di Jawa Tengah. Candi ini menampilkan keindahan relief dan patung Buddha yang memukau, mencerminkan puncak ajaran Buddha Mahayana. Sebagai situs warisan dunia UNESCO, Borobudur adalah tinggalan purbakala yang menunjukkan kebesaran dan kejayaan peradaban Bangsa Indonesia di masa lalu.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 15,
    title: 'Candi Pawon',
    subtitle: 'Candi Pawon terletak diantara Candi Mendut dan Candi Borobudur, tepat berjarak 1,75 km dari Candi Borobudur dan 1,15 km dari Candi Mendut.',
    type: 'sites',
    location: 'Brojonalan, Dusun 1, Wanurejo, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553',
    period: 'Tahun 782 - 812 M',
    image_url: '/src/assets/sites/Candi Pawon.png',
    description: 'Candi Mendut terletak di Dusun Brojonalan, Kelurahan Wanurejo, Kecamatan Borobudur, Kabupaten Magelang, Jawa Tengah. Candi Pawon didirikan antara abad VIII- IX Maehi pada masa kerajaan Mataram Kuna. Menurut Casparis, Candi Pawon merupakan tempat penyimpanan abu jenazah Raja Indra (782 - 812 M), ayah Raja Samarrattungga dari Dinasti Syailendra.',
    full_description: 'Candi Pawon terletak diantara Candi Mendut dan Candi Borobudur, tepat berjarak 1,75 km dari Candi Borobudur dan 1,15 km dari Candi Mendut. Candi Mendut terletak di Dusun Brojonalan, Kelurahan Wanurejo, Kecamatan Borobudur, Kabupaten Magelang, Jawa Tengah. Candi Pawon didirikan antara abad VIII- IX Maehi pada masa kerajaan Mataram Kuna. Menurut Casparis, Candi Pawon merupakan tempat penyimpanan abu jenazah Raja Indra (782 - 812 M), ayah Raja Samarrattungga dari Dinasti Syailendra.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 16,
    title: 'Candi Mendut',
    subtitle: 'Candi Mendut merupakan candi bercorak keagamaan Buddha Mahayana yang didirikan pada masa pemerintahan Raja Indra dari Dinasti Syailendra, masa kerajaan Mataram Kuno.',
    type: 'sites',
    location: 'Jalan Mayor Kusen, Sumberrejo, Mendut, Kec. Mungkid, Kabupaten Magelang, Jawa Tengah 56501',
    period: 'Tahun 824 Masehi',
    image_url: '/src/assets/sites/Candi Mendut.png',
    description: 'Prasasti Karang Tengah yang berangka tahun 824 Masehi menyebutkan bahwa Raja Indra membangun bangunan suci bernama crimad venuvana yang berarti bangunan suci di hutan bambu. Menurut J.G. de Casparis kata ini dihubungkan dengan pendirian Candi Mendut.',
    full_description: 'Candi Mendut merupakan candi bercorak keagamaan Buddha Mahayana yang didirikan pada masa pemerintahan Raja Indra dari Dinasti Syailendra, masa kerajaan Mataram Kuno. Prasasti Karang Tengah yang berangka tahun 824 Masehi menyebutkan bahwa Raja Indra membangun bangunan suci bernama crimad venuvana yang berarti bangunan suci di hutan bambu. Menurut J.G. de Casparis kata ini dihubungkan dengan pendirian Candi Mendut.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 17,
    title: 'Candi Prambanan',
    subtitle: 'Candi Prambanan merupakan bagian dari gugusan percandian yang mendapat predikat Warisan Budaya Dunia.',
    type: 'sites',
    location: 'Jalan Raya Solo - Yogyakarta No.16, Kranggan, Bokoharjo, Kec. Prambanan, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55571',
    period: '-',
    image_url: '/src/assets/sites/Candi Prambanan.png',
    description: 'Selain sebagai simbol kejayaan Mataram Kuno, Prambanan sering dikaitkan dengan bangunan suci untuk Dewa Siwa yang disebut Siwagrha atau Siwalaya, yang berarti “Rumah / Kuil Siwa”. Gugusan candi hindu yang bangunan pusatnya dipagari tembok keliling dan dikelilingi deretan sap-sap candi perwara hanya terdapat di Kompleks Candi Prambanan.',
    full_description: 'Candi Prambanan merupakan bagian dari gugusan percandian yang mendapat predikat Warisan Budaya Dunia. Selain sebagai simbol kejayaan Mataram Kuno, Prambanan sering dikaitkan dengan bangunan suci untuk Dewa Siwa yang disebut Siwagrha atau Siwalaya, yang berarti “Rumah / Kuil Siwa”. Gugusan candi hindu yang bangunan pusatnya dipagari tembok keliling dan dikelilingi deretan sap-sap candi perwara hanya terdapat di Kompleks Candi Prambanan.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 18,
    title: 'Keraton Ratu Boko',
    subtitle: 'Ratu Boko, situs permukiman masa klasik seluas 25 hektar ini memiliki ragam tinggalan berupa gapura, batur, talud, kolam, dan gua.',
    type: 'sites',
    location: 'Jalan Raya Piyungan - Prambanan No.2, Gatak, Bokoharjo, Kec. Prambanan, Kab. Sleman, Daerah Istimewa Yogyakarta',
    period: 'Tahun 856 M',
    image_url: '/src/assets/sites/Keraton Ratu Boko.png',
    description: 'Struktur bangunan dan prasasti menunjukkan kompleks bangunan di Boko merupakanwihara pendeta Buddha bernama Abhayagiri. Tahun 856 M, Rakai Walaing Pu Khumbayoni Ratu Boko, seorang penguasa beragama Hindu memfungsikannya sebagai keraton. Maka unsur Hindu dan Buddha tampak pada kompleks bangunan.',
    full_description: 'Ratu Boko, situs permukiman masa klasik seluas 25 hektar ini memiliki ragam tinggalan berupa gapura, batur, talud, kolam, dan gua. Struktur bangunan dan prasasti menunjukkan kompleks bangunan di Boko merupakan wihara pendeta Buddha bernama Abhayagiri. Tahun 856 M, Rakai Walaing Pu Khumbayoni Ratu Boko, seorang penguasa beragama Hindu memfungsikannya sebagai keraton. Maka unsur Hindu dan Buddha tampak pada kompleks bangunan.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 19,
    title: 'Candi Sewu',
    subtitle: 'Mempunyai luas 185 x 252 m, gugus Candi Sewu menjadi kompleks candi Budha terluas di Indonesia. Terdiri atas candi induk yang dikelilingi sekitar 252 candi perwara dalam empat deretan.',
    type: 'sites',
    location: 'Jalan Raya Solo - Yogyakarta No.KM.16, Bugisan, Kec. Prambanan, Kab. Sleman, Daerah Istimewa Yogyakarta 3',
    period: 'Tahun 782 Masehi',
    image_url: '/src/assets/sites/Candi Sewu.png',
    description: 'Sepasang dwarapala menjaga gerbang halaman candi di sebelah timur. Sifat keagamaan Candi Sewu diketahui dari prasasti Manjusrigrha tahun 714 Saka (792 Masehi) dan Prasasti Kelurak tahun 704 Saka (782 Masehi).',
    full_description: 'Mempunyai luas 185 x 252 m, gugus Candi Sewu menjadi kompleks candi Budha terluas di Indonesia. Terdiri atas candi induk yang dikelilingi sekitar 252 candi perwara dalam empat deretan. Sepasang dwarapala menjaga gerbang halaman candi di sebelah timur. Sifat keagamaan Candi Sewu diketahui dari prasasti Manjusrigrha tahun 714 Saka (792 Masehi) dan Prasasti Kelurak tahun 704 Saka (782 Masehi).',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 20,
    title: 'Candi Sambisari',
    subtitle: 'Candi Sambisari ditemukan seorang petani pada 1966 dalam kondisi tertimbun material lahar Gunung Merapi sedalam 6,5 m.',
    type: 'sites',
    location: 'Jalan Candi Sambisari, Sambisari, Purwomartani, Kec. Kalasan, Kab. Sleman, Daerah Istimewa Yogyakarta',
    period: '-',
    image_url: '/src/assets/sites/Candi Sambisari.png',
    description: 'Ekskavasi menghasilkan temuan penting yaitu arca Mahakala dan arca Nandiswara. Keduanya hilang dari tempat seharusnya di relung barat, sisi pintu bilik candi induk. Tujuh peripih yang di dalamnya terdapat berbagai benda dari perunggu dan lempeng emas berinskripsi om siwa sthana ditemukan di bawah umpak.',
    full_description: "Candi Sambisari ditemukan seorang petani pada 1966 dalam kondisi tertimbun material lahar Gunung Merapi sedalam 6,5 m. Ekskavasi menghasilkan temuan penting yaitu arca Mahakala dan arca Nandiswara. Keduanya hilang dari tempat seharusnya di relung barat, sisi pintu bilik candi induk. Tujuh peripih yang di dalamnya terdapat berbagai benda dari perunggu dan lempeng emas berinskripsi om siwa sthana ditemukan di bawah umpak.",
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 21,
    title: 'Candi Ijo',
    subtitle: 'Candi Ijo secara berada di Kecamatan Prambanan, Kabupaten Sleman dengan ketinggian 357.402 mdpl.',
    type: 'sites',
    location: 'Jalan Candi Ijo, Nglengkong, Sambirejo, Kec. Prambanan, Kab. Sleman, Daerah Istimewa Yogyakarta',
    period: '-',
    image_url: '/src/assets/sites/Candi Ijo.png',
    description: 'Candi Ijo merupakan kompleks percandian yang berada di atas perbukitan. Lansekap candi ini berupa lahan berterasteras yang dikelilingi tebing. Lahan yang menjadi keletakan bangunan terdiri atas tanah dan cadas. Tanah tersebut sangat labil, bila musim penghujan sangat becek dan bila musim kemarau tanahnya menjadi bercelah-celah atau pecah.',
    full_description: 'Candi Ijo secara berada di Kecamatan Prambanan, Kabupaten Sleman dengan ketinggian 357.402 mdpl. Candi Ijo merupakan kompleks percandian yang berada di atas perbukitan. Lansekap candi ini berupa lahan berterasteras yang dikelilingi tebing. Lahan yang menjadi keletakan bangunan terdiri atas tanah dan cadas. Tanah tersebut sangat labil, bila musim penghujan sangat becek dan bila musim kemarau tanahnya menjadi bercelah-celah atau pecah.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 22,
    title: 'Candi Plaosan',
    subtitle: 'Candi Plaosan menawarkan cerita yang tak kalah menarik, karena cerita di balik pembangunannya yang dilakukan oleh Rakai Pikatan dan Ratu Pramodawardhani mencerminkan kerjasama dan toleransi antar agama.',
    type: 'sites',
    location: 'Jl. Candi Plaosan, Plaosan Lor, Bugisan, Kec. Prambanan, Kabupaten Klaten, Jawa Tengah 57454',
    period: 'Abad ke-9',
    image_url: '/src/assets/sites/Candi Plaosan.png',
    description: 'Candi Plaosan adalah kompleks candi Buddha yang terletak di Prambanan, Jawa Tengah, Indonesia. Bangunan ini dibangun pada abad ke-9 oleh Raja Rakai Pikatan dan Ratu Pramudyawardani dari Kerajaan Mataram Kuno.',
    full_description: 'Candi Plaosan menawarkan cerita yang tak kalah menarik, karena cerita di balik pembangunannya yang dilakukan oleh Rakai Pikatan dan Ratu Pramodawardhani mencerminkan kerjasama dan toleransi antar agama. Candi Plaosan adalah kompleks candi Buddha yang terletak di Prambanan, Jawa Tengah, Indonesia. Bangunan ini dibangun pada abad ke-9 oleh Raja Rakai Pikatan dan Ratu Pramudyawardani dari Kerajaan Mataram Kuno.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 23,
    title: 'Candi Sukuh',
    subtitle: 'Situs Candi Sukuh diperkirakan dibangun pada masa akhir Kerajaan Majapahit, yaitu abad ke-15, pada masa pemerintahan Ratu Suhita (1429- 1446).',
    type: 'sites',
    location: 'Tambak, Berjo, Kec. Ngargoyoso, Kabupaten Karanganyar, Jawa Tengah 57793',
    period: 'Abad ke-15',
    image_url: '/src/assets/sites/Candi Sukuh.png',
    description: 'Latar keagamaan candi ini sangat jelas tergambar melalui perlambang linggayoni dan mitologi-mitologi Hindu yang dipahatkan pada relief dan arca-arcanya. Walaupun Candi Sukuh berlatar agama Hindu, namun konsep-konsep kebudayaan asli Indonesia sangatlah kental.',
    full_description: 'Situs Candi Sukuh diperkirakan dibangun pada masa akhir Kerajaan Majapahit, yaitu abad ke-15, pada masa pemerintahan Ratu Suhita (1429- 1446). Latar keagamaan candi ini sangat jelas tergambar melalui perlambang linggayoni dan mitologi-mitologi Hindu yang dipahatkan pada relief dan arca-arcanya. Walaupun Candi Sukuh berlatar agama Hindu, namun konsep-konsep kebudayaan asli Indonesia sangatlah kental.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 24,
    title: 'Candi Cetho',
    subtitle: 'Candi Cetho dibangun sekitar 1451- 1470 pada masa Majapahit ketika pengaruh Hindu di Jawa mulai pudar, sementara unsur tradisi prasejarah Indonesia kembali hidup.',
    type: 'sites',
    location: 'Ceto, RT.01/RW.03, Cetho, Gumeng, Kec. Jenawi, Kabupaten Karanganyar, Jawa Tengah 57792',
    period: 'Tahun 1451-1470',
    image_url: '/src/assets/sites/Candi Cetho.png',
    description: 'Ciri khas seni arca pada masa itu dibuat berukuran besar dengan pemahatan sederhana. Contohnya, arca Bima di halaman pertama. Gaya bangunan masa itu menyerupai punden berundak yang berkembang di Gunung Penanggungan dan Gunung Arjuna, Jawa Timur.',
    full_description: 'Candi Cetho dibangun sekitar 1451- 1470 pada masa Majapahit ketika pengaruh Hindu di Jawa mulai pudar, sementara unsur tradisi prasejarah Indonesia kembali hidup. Ciri khas seni arca pada masa itu dibuat berukuran besar dengan pemahatan sederhana. Contohnya, arca Bima di halaman pertama. Gaya bangunan masa itu menyerupai punden berundak yang berkembang di Gunung Penanggungan dan Gunung Arjuna, Jawa Timur.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 25,
    title: 'Kawasan Percandian Dieng',
    subtitle: 'Kumpulan candi Hindu beraliran Siwa ini diperkirakan dibangun antara akhir abad ke-8 sampai awal abad ke-9.',
    type: 'sites',
    location: 'Jl. Dieng No.km 19, Sidorejo, Tieng, Kec. Kejajar, Kabupaten Wonosobo, Jawa Tengah 56325',
    period: 'Abad ke-8',
    image_url: '/src/assets/sites/Kawasan Percandian Dieng.png',
    description: 'Diduga merupakan candi tertua di Jawa. Sampai saat ini belum ditemukan informasi tertulis tentang sejarah Candi Dieng, namun para ahli memperkirakan bahwa kumpulan candi ini dibangun atas perintah raja- raja dari Wangsa Sanjaya.',
    full_description: 'Kumpulan candi Hindu beraliran Siwa ini diperkirakan dibangun antara akhir abad ke-8 sampai awal abad ke-9. Diduga merupakan candi tertua di Jawa. Sampai saat ini belum ditemukan informasi tertulis tentang sejarah Candi Dieng, namun para ahli memperkirakan bahwa kumpulan candi ini dibangun atas perintah raja- raja dari Wangsa Sanjaya.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 26,
    title: 'Kawasan Percandian Gedong Songo',
    subtitle: 'Kawasan Cagar Budaya Gedong Songo diperkirakan oleh para ahli dibuat semasa dengan Candi Dieng yang dibuat pada kurun waktu abad ke 7 sampai 9 Masehi pada masa Dinasti Sanjaya dari Kerajaan Mataram Lama.',
    type: 'sites',
    location: 'Yogyakarta',
    period: 'Abad ke-7 sampai 9 Masehi',
    image_url: '/src/assets/sites/Kompleks Percandian Gedong Songo.png',
    description: 'Nama Gedongsongo diberikan oleh penduduk setempat yang berasal dari bahasa Jawa, “Gedong” berarti rumah atau bangunan, “Songo” berarti sembilan.',
    full_description: 'Kawasan Cagar Budaya Gedong Songo diperkirakan oleh para ahli dibuat semasa dengan Candi Dieng yang dibuat pada kurun waktu abad ke 7 sampai 9 Masehi pada masa Dinasti Sanjaya dari Kerajaan Mataram Lama. Nama Gedongsongo diberikan oleh penduduk setempat yang berasal dari bahasa Jawa, “Gedong” berarti rumah atau bangunan, “Songo” berarti sembilan.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 27,
    title: 'Candi Penataran',
    subtitle: 'Candi Panataran adalah candi kerajaan Kerajaan Majapahit, didirikan di sebuah tanah yang berpotensi sakral karena di tempat itu terdapat prasasti Palah dari jaman Kadiri, berisi tentang pemujaan Bhatara ri Palah.',
    type: 'sites',
    location: 'Penataran, Kec. Nglegok, Kab. Blitar, Jawa Timur 66181',
    period: '-',
    image_url: '/src/assets/sites/Candi Penataran.png',
    description: 'Pada jaman Majapahit, Candi Panataran adalah candi untuk memuja Paramasiwa yang disebut dengan berbagai nama, tattwa tertinggi dalam agama Siwasiddhanta. Candi Panataran adalah “pusat spiritual” kerajaan Majapahit.',
    full_description: 'Candi Panataran adalah candi kerajaan Kerajaan Majapahit, didirikan di sebuah tanah yang berpotensi sakral karena di tempat itu terdapat prasasti Palah dari jaman Kadiri, berisi tentang pemujaan Bhatara ri Palah. Pada jaman Majapahit, Candi Panataran adalah candi untuk memuja Paramasiwa yang disebut dengan berbagai nama, tattwa tertinggi dalam agama Siwasiddhanta. Candi Panataran adalah “pusat spiritual” kerajaan Majapahit.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 28,
    title: 'Candi Badut',
    subtitle: 'Situs Cagar Budaya Candi Badut ditemukan pada tahun 1921 oleh Maureen Breche.',
    type: 'sites',
    location: 'Jalan Raya Candi V No.5D, Doro, Karangwidoro, Kec. Dau, Kabupaten Malang, Jawa Timur 65151',
    period: 'Tahun 760 Masehi',
    image_url: '/src/assets/sites/Candi Badut.png',
    description: 'Nama badut sendiri ditafsirkan merupakan arti dari kata Liswa, kata ini tertulis pada baris ke dua pada prasasti Dinoyo yang berangka tahun 682 Saka atau 760 Masehi .Di dalam kamus Sansekerta kata Liswa berarti “anak kemidi, tukang tari”, yang didalam bahasa Jawa sepadan dengan kata “badut”.',
    full_description: 'Situs Cagar Budaya Candi Badut ditemukan pada tahun 1921 oleh Maureen Breche. Nama badut sendiri ditafsirkan merupakan arti dari kata Liswa, kata ini tertulis pada baris ke dua pada prasasti Dinoyo yang berangka tahun 682 Saka atau 760 Masehi .Di dalam kamus Sansekerta kata Liswa berarti “anak kemidi, tukang tari”, yang didalam bahasa Jawa sepadan dengan kata “badut”.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 29,
    title: 'Candi Kidal',
    subtitle: 'Candi Kidal berasal dari masa kerajaan Singhasari abad 13. Pararaton menjelaskan “Lina Sang Anusapati Çaka 1171 Dhinarma sira ring Kidal” yang disimpulkan bahwa candi ini merupakan tempat pendharmaan Raja Anusapati, raja kedua Singhasari, putra tiri Ken Arok dan Putra Ken Dedes.',
    type: 'sites',
    location: 'Jalan Raya, Panggung, Kidal, Tumpang, Malang Regency, East Java 65156',
    period: 'Abad ke-13',
    image_url: '/src/assets/sites/Candi Kidal.png',
    description: 'Pembangunan Candi Kidal diperkirakan selesai sekitar tahun 1260 M. Tujuan pembangunan candi ini adalah untuk mendarmakan Raja Anusapati, agar sang raja dapat mendapat kemuliaan sebagai Siwa Mahadewa.',
    full_description: 'Candi Kidal berasal dari masa kerajaan Singhasari abad 13. Pararaton menjelaskan “Lina Sang Anusapati Çaka 1171 Dhinarma sira ring Kidal” yang disimpulkan bahwa candi ini merupakan tempat pendharmaan Raja Anusapati, raja kedua Singhasari, putra tiri Ken Arok dan Putra Ken Dedes. Pembangunan Candi Kidal diperkirakan selesai sekitar tahun 1260 M. Tujuan pembangunan candi ini adalah untuk mendarmakan Raja Anusapati, agar sang raja dapat mendapat kemuliaan sebagai Siwa Mahadewa.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 30,
    title: 'Candi Jago',
    subtitle: '“Jajaghu” merupakan nama asli Candi Jago menurut kakawin Nagarakertagama.',
    type: 'sites',
    location: 'Jalan Wisnuwardhana, Ronggowuni, Tumpang, Kec. Tumpang, Kabupaten Malang, Jawa Timur 65156',
    period: 'Abad ke-13',
    image_url: '/src/assets/sites/Candi Jago.png',
    description: 'Candi ini didirikan pada masa Kerajaan Singhasari pada abad ke-13 dan dihubungkan dengan tokoh Wisnuwardhana, salah seorang raja Singhasari. Candi ini beraliran agama Syiwa Buddha Tantrayana, diketahui dari Arca Amoghapasa yang merupakan dewa tertinggi dalam ajaran Buddha Tantrayana. Arca ini adalah perwujudan dari Wisnuwardhana yang wafat pada tahun 1268 M.',
    full_description: '“Jajaghu” merupakan nama asli Candi Jago menurut kakawin Nagarakertagama. Candi ini didirikan pada masa Kerajaan Singhasari pada abad ke-13 dan dihubungkan dengan tokoh Wisnuwardhana, salah seorang raja Singhasari. Candi ini beraliran agama Syiwa Buddha Tantrayana, diketahui dari Arca Amoghapasa yang merupakan dewa tertinggi dalam ajaran Buddha Tantrayana. Arca ini adalah perwujudan dari Wisnuwardhana yang wafat pada tahun 1268 M.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 31,
    title: 'Candi Singosari',
    subtitle: 'Di kota Singosari yang tidak jauh dari kota Malang, terletak Candi Singosari yang ditemukan sekitar tahun 1803 oleh Nicolaus Engelhard.',
    type: 'sites',
    location: 'Jalan Kertanegara, Candirenggo, Kec. Singosari, Kabupaten Malang, Jawa Timur 65153',
    period: '-',
    image_url: '/src/assets/sites/Candi Singosari.png',
    description: 'Apabila memperhatikan struktur Candi Singosari yang memiliki dua tubuh/ruangan seperti pada Candi Jawi. Diperkirakan Candi Singosari berlatar belakang Siwa-Buddha.',
    full_description: 'Di kota Singosari yang tidak jauh dari kota Malang, terletak Candi Singosari yang ditemukan sekitar tahun 1803 oleh Nicolaus Engelhard. Apabila memperhatikan struktur Candi Singosari yang memiliki dua tubuh/ruangan seperti pada Candi Jawi. Diperkirakan Candi Singosari berlatar belakang Siwa-Buddha.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 32,
    title: 'Candi Jabung',
    subtitle: 'Dalam kitab Nagarakertagama Candi Jabung disebutkan dengan nama Bajrajinaparamitapura.',
    type: 'sites',
    location: 'Dusun Candi, Jabung Candi, Kec. Paiton, Kabupaten Probolinggo, Jawa Timur 67291',
    period: 'Tahun 1354 M',
    image_url: '/src/assets/sites/Candi Jabung.png',
    description: 'Suatu petunjuk bahwa candi ini berlatarbelakang aliran tantraisme dalam agama Buddha Mahayana. Angka tahun 1276 Saka atau 1354 M berada dalam masa pemerintahan Hayam Wuruk (1351- 1389 M). Dalam Nagarakretagama disebutkan bahwa candi ini pernah dikunjungi Hayam Wuruk pada tahun 1359 M ketika ia sedang melakukan perjalanan ke Lumajang.',
    full_description: 'Dalam kitab Nagarakertagama Candi Jabung disebutkan dengan nama Bajrajinaparamitapura. Suatu petunjuk bahwa candi ini berlatarbelakang aliran tantraisme dalam agama Buddha Mahayana. Angka tahun 1276 Saka atau 1354 M berada dalam masa pemerintahan Hayam Wuruk (1351- 1389 M). Dalam Nagarakretagama disebutkan bahwa candi ini pernah dikunjungi Hayam Wuruk pada tahun 1359 M ketika ia sedang melakukan perjalanan ke Lumajang.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 33,
    title: 'Situs Leang Timpuseng',
    subtitle: 'Leang Timpuseng atau Gua Timpuseng adalah situs arkeologi dan berstatus cagar budaya berperingkat nasional yang ada di wilayah Kabupaten Maros.',
    type: 'sites',
    location: 'Jalan Poros Leang Leang, Kalabbirang, Kec. Bantimurung, Kab. Maros, Sulawesi Selatan 90561',
    period: '-',
    image_url: '/src/assets/sites/Situs Leang Timpuseng.png',
    description: 'Hasil pertanggalan di Leang Timpuseng sangat menakjubkan. Dua lukisan yang dipertanggal dengan metode pertanggalan uranium series ternyata berumur sangat tua. Leang Timpuseng pun menjadi salah satu situs terpenting yang mengubah pandangan dunia tentang sejarah asal usul dan perkembangan lukisan gua.',
    full_description: 'Leang Timpuseng atau Gua Timpuseng adalah situs arkeologi dan berstatus cagar budaya berperingkat nasional yang ada di wilayah Kabupaten Maros. Hasil pertanggalan di Leang Timpuseng sangat menakjubkan. Dua lukisan yang dipertanggal dengan metode pertanggalan uranium series ternyata berumur sangat tua. Leang Timpuseng pun menjadi salah satu situs terpenting yang mengubah pandangan dunia tentang sejarah asal usul dan perkembangan lukisan gua.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
  {
    id: 34,
    title: 'Taman Arkeologi Leang-Leang',
    subtitle: 'Di taman ini terdapat banyak gua prasejarah yang menyimpan peninggalan arkeologis manusia purba yang unik dan menarik.',
    type: 'sites',
    location: 'Leang-Leang, Kec. Bantimurung, Kabupaten Maros, Sulawesi Selatan 90561',
    period: '-',
    image_url: '/src/assets/sites/Taman Arkeologi Leang-Leang.png',
    description: 'Para arkeolog berpendapat bahwa beberapa gua yang terdapat di sekitar kawasan tersebut pernah dihuni manusia sekitar 3.000-8.000 tahun SM.',
    full_description: 'Di taman ini terdapat banyak gua prasejarah yang menyimpan peninggalan arkeologis manusia purba yang unik dan menarik. Para arkeolog berpendapat bahwa beberapa gua yang terdapat di sekitar kawasan tersebut pernah dihuni manusia sekitar 3.000-8.000 tahun SM.',
    details: {
      height: '42 meter',
      baseSize: '123 x 123 meter',
      stones: '2.672.000 blok batu',
      reliefs: '2.672 panel relief',
      buddhaStatues: '504 patung Buddha'
    },
    visit_info: {
      openHours: '06:00 - 17:00 WIB',
      ticketPrice: 'Rp 50.000 - Rp 750.000',
      bestTime: 'Sunrise (05:30 - 07:00)',
    },
    facilities: ['Parkir', 'Toilet', 'Restoran', 'Toko Souvenir', 'Guide']
  },
];
export const eventCategories = [
  { id: 'semua', label: 'Semua Event' },
  { id: 'event', label: 'Event' },
  { id: 'pameranTemporer', label: 'Pameran Temporer' },
];
export const defaultEvents = [
  {
    id: 1,
    title: 'MCB FEST',
    category: 'event',
    date: '20 Februari 2024',
    time: '08:00 - 16:00 WIB',
    location: 'Galeri Nasional Indonesia',
    address: 'Jalan Medan Merdeka Timur. No.14, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, DKI Jakarta 10110',
    participants: 30,
    description: 'MCB Fest hadir sebagai ruang perjumpaan antara masa lalu, masa kini dan masa depan, sebuah perayaan terhadap museum dan cagar budaya yang tak hanya dilihat, tapi dialami. Melalui pendekatan interaktif, festival ini menghidupkan kembali warisan budaya bangsa dalam konteks kehidupan modern, mengajak publik menemukan relevansi sejarah dalam keseharian, dan merasakan bahwa budaya bukanlah milik masa lampau, melainkan bagian dari percakapan hari ini. Acara ini digelar di Terusan Permata Hijau, Senayan City dari 24-27 Juli 2025.',
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62858-9444-3839 (chat only)',
      email: '-',
      website: 'www.gni.kemdikbud.go.id'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 2,
    title: 'Pameran Kids Biennale Indonesia 2025: Tumbuh Tanpa Takut',
    category: 'pameranTemporer',
    date: '25 Februari 2024',
    time: '10:00 - 15:00 WIB',
    location: 'Galeri Nasional Indonesia',
    address: 'Jalan Medan Merdeka Timur. No.14, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, DKI Jakarta 10110',
    participants: 150,
    description: '',
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62858-9444-3839 (chat only)',
      email: '-',
      website: 'www.gni.kemdikbud.go.id'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 3,
    title: 'Pameran NYALA: 200 Tahun Perang Diponegoro',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Galeri Nasional Indonesia',
    address: 'Jalan Medan Merdeka Timur. No.14, Gambir, Kecamatan Gambir, Kota Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: '',
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62858-9444-3839 (chat only)',
      email: '-',
      website: 'www.gni.kemdikbud.go.id'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 4,
    title: 'Dinding kreasi "Rupa-Rupa Penuh Cerita"',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Basoeki Abdullah',
    address: 'Jalan Keuangan Raya RT.7/RW.5 No.19, Cilandak Barat, Kec. Cilandak, Kota Jakarta Selatan, DKI Jakarta 12430',
    participants: 50,
    description: 'Dinding kreasi "Rupa-Rupa Penuh Cerita" adalah sebuah ruang untuk pengunjung mengekspresikan dirinya melalui proses melukis wajah-wajah  humanoid yang dapat dikreasikan sesuai imajinasi, berlokasi di ruang pameran temporer Museum Basoeki Abdullah.',
    image_url: '/src/assets/events/Foto Dinding 2.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '-',
      email: '-',
      website: 'www.museumbasoekiabdullah.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 5,
    title: 'Workshop Mencanting',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Batik Indonesia',
    address: 'Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, DKI Jakarta 13820',
    participants: 50,
    description: 'Workshop Mencanting merupakan kegiatan pembuatan batik tulis yang dilakukan mulai dari menggambar pola hingga tahap mencanting di atas kain berukuran 25 x 25 cm. Pada kegiatan ini tidak dilakukan tahap pewarnaan.  Workshop tersedia pada Selasa-Minggu, jam 09.00-11.00 (kuota terbatas)',
    image_url: '/src/assets/events/Mencanting.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-22097046',
      email: '-',
      website: 'www.museumbatik.kemdikbud.go.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 6,
    title: 'Workshop Isen-Isen',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Batik Indonesia',
    address: 'Taman Mini Indonesia Indah, Ceger, Kec. Cipayung, Kota Jakarta Timur, DKI Jakarta 13820',
    participants: 50,
    description: 'Workshop Isen-Isen merupakan kegiatan menggambar isen-isen (isian) dari motif batik pada selembar kertas menggunakan pensil warna. Seluruh peralatan dipinjamkan oleh museum.  Workshop tersedia pada Selasa-Minggu, jam 09.00-11.00 (kuota terbatas)',
    image_url: '/src/assets/events/isen isen.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-22097046',
      email: '-',
      website: 'www.museumbatik.kemdikbud.go.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 7,
    title: 'Batavia Toastmaster',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `"Berdiri tahun 1924, Toastmasters adalah organisasi yang terfokus pada pengembangan komunikasi publik dan kepemimpinan, tersebar di 150 negara, salah satunya Indonesia.

Di masa sekarang, berbicara di depan umum tanpa memiliki struktur bicara yang jelas, akan dianggap kurang cakap. Tentunya, mayoritas orang ingin viral dengan menunjukkan potensi dalam diri mereka yang berkualitas.

Sebagai penggiat Public Speaking di Toastmasters International, kami menyadari bahwa keahlian berbicara dengan terstruktur bisa dipelajari oleh setiap orang. Untuk itu, kami menghadirkan Public Speaking Class yang bertemakan Viral Jalur Verbal 2.0 sebagai program edukasi untuk mengasah potensi berbicara di depan umum dengan lebih berkualitas dan percaya diri."`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 8,
    title: 'Masterclass Wayang Potehi: Make Your Own Wayang Potehi!',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Sanggar Wayang Potehi Siauw Pek San merupakan sanggar wayang yang berfokus pada preservasi, pengembangan, dan edukasi wayang potehi Indonesia. Komunitas ini merupakan satu-satunya yang berfokus pada wayang potehi yang berbasis di Jakarta Pusat. Didirikan pada Mei 2023, hingga kini Sanggar Wayang Potehi Siauw Pek San terus menerus menyebarluaskan dan mendekatkan pengetahuan wayang potehi ke masyarakat dengan pementasannya serta program edukasi seperti workshop “Sehari Bersama Wayang Potehi” dan “Mini Masterclass Membuat Wayang Potehi”. Melalui pementasannya serta program kolaborasi ruang publik seperti museum dan pameran, Siauw Pek San terus berupaya memperkenalkan kesenian tradisional Tionghoa ini kepada publik hingga sekarang ini`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 9,
    title: 'C.A.N.V.A.S. 2025 (Creative Art Narratives, Visual Aesthetic Showcase)',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `C.A.N.V.A.S. 2025 (Creative Art Narratives, Visual Aesthetic Showcase) adalah pameran karya desain dari siswa DKV SMKN 14 Jakarta yang akan diselenggarakan pada 24 Juni 2025 di Museum Kebangkitan Nasional. Mengangkat tema “Awal Mula Sejarah”, program ini menjadi ruang untuk menuangkan cerita dan estetika melalui desain visual. Selain pameran, akan ada sesi interaktif bersama pengunjung. Acara ini terbuka untuk umum.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 10,
    title: 'Pameran Seni Whisper From The Past SMA Labschool Jakarta',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Yuk, datang dan saksikan langsung Pameran Seni Rupa "Whisper From the Past" dari SMA Labschool Jakarta di Museum Kebangkitan Nasional! Dari 15 hingga 19 Juli 2025, kamu akan diajak menyelami "A Glimpse into Indonesia’s Gentle Past" melalui karya-karya lukisan, fashion, dan instalasi 3D kreatif yang menyuarakan keindahan budaya Indonesia. Ini adalah kesempatan langka untuk mengapresiasi seni tradisional secara autentik di tengah era digital.  Jangan lewatkan pengalaman inspiratif ini di tempat bersejarah yang relevan dengan kebangkitan nasional kita!`,
    image_url: '/src/assets/events/Poster SMA Labschool Jakarta.jpeg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 11,
    title: 'Pameran Lukisan Dua Negeri Harmoni Budaya Indonesia–Jepang di Museum Kebangkitan Nasional oleh Lions Club',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Lions Club Jakarta adalah bagian dari Lions Clubs International, organisasi pelayanan sosial global. Lions Club Jakarta memiliki beberapa cabang atau klub yang aktif di berbagai wilayah Jakarta, seperti Lions Club Jakarta Nusantara, Lions Club Jakarta Selatan Metteyya, dan lainnya. Lions Club Jakarta melalui Lions Club Distrik Lions Club 307a1 mempersembahkan Pameran Lukisan 2 Negeri Indonesia & Jepang yang diadakan pada 26 - 30 April 2025. Lions Club 307a1 menghadirkan pelukis dari Indonesia dan Jepang serta mengadakan kegiatan lainnya dalam pameran tersebut seperti: cara melukis kaligrafi Jepang, fashion show kimono dan kebaya, workshop melukis ala Jepang untuk siswa SD, serta workshop Furoshiki (seni membungkus dengan kain).`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 12,
    title: 'Kelas Tari Bersama Belantara Budaya Indonesia',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Kelas Tari Bersama Belantara Budaya Indonesia adalah program pelatihan tari tradisional gratis yang diselenggarakan oleh Yayasan Belantara Budaya Indonesia (BBI). BBI bertujuan untuk mengembangkan karakter anak-anak dan remaja melalui pendidikan, kesenian, dan kebudayaan. Program ini menyediakan sekolah tari dan musik tradisional serta literasi bahasa asing gratis`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 13,
    title: 'Kelas Teater  Bersama Komunitas Teras',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Teater Anak Nusantara atau biasa disingkat Teras adalah sanggar teater anak yang berbasis di Jakarta. Teater ini merupakan wadah bagi siapapun yang tertarik belajar akting dan seni teater, khususnya untuk pemula. Komunitas ini bertujuan untuk memperkenalkan dan melestarikan cerita rakyat Indonesia melalui pementasan teater, serta membantu anggotanya mengembangkan potensi diri. Kelas ini terbuka untuk berbagai kalangan, mulai dari siswa SD hingga mahasiswa. `,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 14,
    title: 'Pameran Seni oleh komunitas Outsider Art Jakarta (Harkitnas)',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kebangkitan Nasional',
    address: 'Jalan Abdul Rachman Saleh No.26, Senen, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410',
    participants: 50,
    description: `Outsider Art Jakarta adalah komunitas seni yang didirikan oleh Kak Toto (Timotius Toto Suwarsito) dengan tujuan untuk memberikan ruang bagi seniman dari berbagai latar belakang, termasuk untuk anak-anak berkebutuhan khusus, individu neurodiverse, penyandang disabilitas fisik, serta anak-anak non-ABK. Dalam rangka memperingati Hari Kebangkitan Nasional, Outsider Art Jakarta akan menghadirkan pameran lukisan “Bangkit dan Berdaya” di Museum Kebangkitan Nasional selama dua minggu. 
Pameran ini bukan sekadar ajang seni, tetapi sebuah gerakan yang menegaskan bahwa keberagaman adalah kekuatan, inklusivitas adalah jalan, dan seni adalah medium untuk merayakan kebangkitan sebuah bangsa. Kegiatan yang akan diadakan bukan hanya pamera, Outsider Art Jakarta juga akan menghadirkan workshop dan webinar serta melukis bersama.
`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62851-5617-2853 (chat only)',
      email: '-',
      website: 'www.museumkebangkitannasional.com',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 15,
    title: 'Walking Tour Kebangsaan Edisi Perjuangan dan Teladan Sang Bapak Pembangunan',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan. 

Pada 28 Juni 2025 telah dilaksanakan Walking Tour Kebangsaan dengan tema "Perjuangan dan Teladan Sang Bapak Pembangunan". Dengan ada program tur sejarah ini diharapkan peserta mendapat informasi terkait rekam jejak karir Presiden Soeharto hingga sisi humanisme ketika berada di dalam rumah tercinta.  Destinasi pertama dalam kegiatan ini adalah mengunjungi Markas Kostrad untuk mengulik kisah dan kiprah militer Presiden Soeharto. Selanjutnya dilanjutkan dengan mengunjungi Galeri Nasional untuk mengulik kisah seputar pandangan kebudayaan Presiden Soeharto. Destinasi terakhir adalah mengunjungi kediaman Presiden Soeharto di Jalan Cendana sekaligus bertemu dengan keluarga Presiden Soeharto.

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat. `,
    image_url: '/src/assets/events/WTK 28 Juni 2025_1R2.png',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 16,
    title: 'Buitenzorg Dalam Sekeping Kartu Pos',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Kegiatan Direktorat Sejarah dan Permuseuman dengan Perkumpulan Filatelis Indonesia (PFI):
a. Pameran Kartupos Bergambar Buitenzorg. Pameran menampilkan
lebih dari 300 kartupos bergambar dari masa Hindia Belanda yang
menyajikan visual kota Bogor atau Buitenzorg. Pameran akan
dilangsung selama seminggu (Enam hari) dan terbuka untuk umum.
b. Seremonial Peluncuran Buku berjudul Kartupos Bergambar dari
Buitenzorg (Bogor) karya Fadli Zon dan Mahpudi (2024) yang ditandai
dengan penyerahan buku dimaksud kepada tokoh-tokoh penting.
c. Diskusi Buku Kartupos Bergambar dari Buitenzorg (Bogor) yang
menampilkan penulis dan pembahas dengan latar belakang filatelis
dan sejarah.
d. Workshop`,
    image_url: '/src/assets/events/E-FLYER PAMERAN FILATELI-IG FEED.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 17,
    title: 'Walking Tour Kebangsaan Buitenzorg En Omstreken',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan. 

Pada 16 Maret 2025 telah dilaksanakan Walking Tour Kebangsaan dengan tema "Buitenzorg En Omstreken".  Destinasi pertama dalam kegiatan ini adalah mengunjungi Stasiun Bogor untuk mengulik kisah sejarah transportasi di Bogor (Buitenzorg). Perjalanan dilanjutkan dengan mengunjungi kediaman arsitek F. Silaban dan bertemu dengan keluarga besar F. Silaban. Tidak berhenti sampai disitu, perjalanan berlanjut ke Hotel Salak untuk mengilik kisah bangunan bersejarah era kolonial sekaligus kisah Konferensi Bogor. Destinasi terakhir adalah mengunjungi Museum Kepresidenan RI Balai Kirti sekaligus buka bersama dengan menu kesukaan para presiden dan wakil presiden Republik Indonesia.

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat. `,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 18,
    title: 'Walking Tour Kebangsaan Cita Rasa Pemimpin Bangsa',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan.

Pada tanggal 8 Februari telah dilaksanakan kegiatan Walking Tour Kebangsaan yang mengusung tema "Cita Rasa Pemimpin Bangsa". Destinasi pertama dalam kegiatan ini adalah pabrik roti Tan Ek Tjoan (salah satu roti kesukaan Wakil Presiden Moh. Hatta). Destinasi berikutnya adalah Vihara Dhanagun untuk mengulik kisah kuliner tradisional masyarakat Tionghoa. Perjalanan dilanjutkan dengan mengunjungi gedung Algemene Secretarie. Kunjungan ditutup di Museum Kepresidenan RI Balai Kirti dengan talkshow tentang kuliner kesukaan presiden sekaligus mencicipi sejumlah kudapan kesukaan para presiden dan wakil presiden Republik Indonesia. 

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 19,
    title: 'Walking Tour Kebangsaan Dari Gubernur Jenderal Ke Presiden',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan.

Pada tanggal 8 Desember 2025 telah dilaksanakan kegiatan Walking Tour Kebangsaan yang mengusung tema "Dari Gubernur Jenderal ke Presiden". Destinasi pertama dalam kegiatan ini adalah Lapangan Sempur untuk mengulik kisah Bogor era kolonial dan kisah seputar Karsten Plan. Destinasi berikutnya adalah Markas Denpom Kota Bogor yang berkisah tentang militer era kolonial. Perjalanan dilanjutkan dengan mengunjungi gedung Bakorwil Bogor yang dahulu merupakan kantor asisten residen era kolonial. Kunjungan ditutup di Museum Kepresidenan RI Balai Kirti. 

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 20,
    title: 'Museum Keliling Koleksi Kepresidenan - Pakkamase',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: ``,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 21,
    title: 'Balai Kirti Menyapa Taman Ekspresi Sempur',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: ``,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 22,
    title: 'Walking Tour Edisi Taman Ekspresi Sempur - Menelusuri Bagunan Bersejarah Di Kota Bogor',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan.

Pada tanggal 14 September 2024 telah dilaksanakan kegiatan Walking Tour Kebangsaan sebagai rangkaian kegiatan Balai Kirti Menyapa. Destinasi pertama dalam kegiatan ini adalah Museum Kepresidenan RI Balai Kirti. Perjalanan berlanjut ke Kantor Balaikota Bogor. Destinasi berikutnya adalah  gedung Bakorwil Bogor yang dahulu merupakan kantor asisten residen era kolonial. Tidak berhenti sampai disitu, perjalanan berlanjut ke salah satu sekolah berejarah di Kota Bogor yakni Regina Pacis. Kunjungan ditutup di Lapangan Sempur. 

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat."`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 23,
    title: 'Marhaban Yaa Ramadan Marhaban Yaa Museum Kepresidenan - Kisah Keberagaman Di Kota Bogor',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan.

Pada tanggal 15 Maret 2024 telah dilaksanakan kegiatan Walking Tour Kebangsaan yang mengusung tema "Kisah Keberagaman di Kota Bogor". Destinasi pertama dalam kegiatan ini adalah Vihara Dhanagun untuk mengulik kisah area pemukiman etnis Tionghoa di Bogor era kolonial. Perjalanan berlanjut ke Kantor Pos Bogor yang dulunya merupakan bangunan gereja tertua di Kota Bogor. Destinasi berikutnya adalah  Gereja Zebaouth yang telah berdiri sejak tahun 1920. Kunjungan ditutup di Museum Kepresidenan RI Balai Kirti sekaligus buka bersama menikmati kuliner kesukaan para presiden dan wakil presiden Republik Indonesia. 

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 24,
    title: 'Walking Tour Kebangsaan "Bogor Bergerak"',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Walking Tour Kebangsaan merupakan salah satu kegiatan rutin Museum Kepresidenan RI Balai Kirti.  Kegiatan ini merupakan jelajah sejarah kepresidenan dengan berjalan kaki mengunjungi sambil mengunjungi destinasi-destinasi bersejarah. Kegiatan ini terdiri dari beberapa rute tematik seputar kepresidenan.

Pada tanggal 25 Agustus 2024 telah dilaksanakan kegiatan Walking Tour Kebangsaan yang mengusung tema "Bogor Bergerak" sekaligus memperingati bulan kemerdekaan. Destinasi pertama dalam kegiatan ini adalah Stasiun Bogor untuk mengulik kisah perjuangan Margonda. Perjalanan berlanjut ke gedung Balaikota Bogor. Destinasi berikutnya adalah  gedung Bakorwil yang dulunya merupakan kantor asisten residen era kolonial sekligus tempat pengibaran bendera merah putih pertama di Kota Bogor. Kunjungan ditutup di Museum Kepresidenan RI Balai Kirti. 

Program ini juga diharapkan dapat meningkatkan minat masyarakat untuk mengenal pemimpinnya. Selain itu juga dengan adanya program ini, dapat meningkatkan kerjasama antara museum dengan instansi lain dalam rangka layanan edukasi museum ke masyarakat.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 25,
    title: 'Petualangan di Balai Kirti Episode Kecil-Kecil Jadi Presiden',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Kepresidenan Republik Indonesia Balai Kirti',
    address: 'Jalan Ir. H. Juanda No.1, RT.04/RW.01, Paledang, Kec. Bogor Tengah, Kota Bogor, Jawa Barat 16122',
    participants: 50,
    description: `Petualangan di Balai Kirti merupakan salah satu program publik Museum Kepresidenan RI Balai Kirti dengan sasaran anak-anak usia 5-10 tahun. Tujuan utama dari kegiatan ini adalah untuk mengenalkan figur presiden kepada anak-anak kecil melalui sejumlah kegiatan dan permainan seru didalamnya. Kegiatan permainan mencakup imajinasi, eksplorasi, sensori, dan kolaborasi. 

Pada tanggal 26 Juli 2025 dilaksanakan Petualangan di Balai Kirti dengan sejumlah permainan seru didalamnya. Kegiatan dimulai dengan Kecil Bergerak yang mengajak peserta untuk menanam bibit strawberry sekaligus mengajarkan dasar-dasar berkebun untuk peserta. Kegiatan dilanjutkan dengan melukis kue sesuai dengan imajinasi dan kreativitas peserta. Kegiatan terakhir adalah Kecil-Kecil Jadi Presiden. Aksi kecil-kecil jadi presiden memberikan ruang bagi si kecil untuk terlibat dalam pesta demokrasi mini. Si Kecil akan memilih calon presiden (yang terdiri dari semua peserta kegiatan) melalui mekanisme pemilihan presiden di Indonesia. Tersedia juga kotak suara, bilik suara, dan surat suara. Setelah itu, Presiden Kecil akan membentuk kabinetnya sendiri. Para peserta yang tidak menjadi presiden akan mengisi kuisioner untuk posisi menteri kabinet kecil. Kegiatan diakhiri dengan pelantikan presiden kecil.`,
    image_url: '',

    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62812-1151-1722',
      email: '-',
      website: 'www.museumkepresidenan.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 26,
    title: 'Night at the Museum (Jelajah Malam Sangiran)',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Manusia Purba Sangiran',
    address: 'Jalan Sangiran No.Km. 4, Kebayanan II, Krikilan, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    participants: 50,
    description: `Kegiatan "Night at the Museum/Jelajah Malam Sangiran" merupakan sebuah inisiatif yang bertujuan untuk memberikan pengalaman edukasi yang berbeda kepada masyarakat, khususnya generasi muda, tentang kekayaan sejarah dan prasejarah di Situs Sangiran.

Melalui kegiatan malam hari, peserta diharapkan dapat merasakan atmosfer museum yang unik dan mendapatkan pemahaman lebih mendalam mengenai koleksi serta penelitian yang dilakukan di Sangiran, dengan cara yang lebih seru dan menarik.`,
    image_url: '',

    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '-',
      email: '-',
      website: '-'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 27,
    title: 'Sangiran International Youth Forum',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Manusia Purba Sangiran',
    address: 'Jalan Sangiran No.Km. 4, Kebayanan II, Krikilan, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    participants: 50,
    description: `Forum ini bertujuan untuk membangun jejaring global dan mendorong pelestarian serta pengembangan kawasan Sangiran sebagai situs warisan dunia. Peserta forum, yang terdiri dari pemuda dari berbagai negara, terlibat dalam berbagai kegiatan, termasuk proyek kolaboratif dan diskusi tentang pelestarian warisan budaya`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '-',
      email: '-',
      website: '-'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 28,
    title: '130 Years after Pithecanthropus erectus - Kolaborasi dengan Museum Nasional Indonesia',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Manusia Purba Sangiran',
    address: 'Jalan Sangiran No.Km. 4, Kebayanan II, Krikilan, Kec. Kalijambe, Kabupaten Sragen, Jawa Tengah 57275',
    participants: 50,
    description: ``,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '-',
      email: '-',
      website: '-'
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 29,
    title: 'Pameran 75 Tahun Perancis Indonesia - Black Room: The Soul Gallery',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: `Hitam - rona yang intens, sebuah suara formalitas, kemewahan, dan keanggunan, sekaligus menyiratkan misteri dan kontemplasi. The Black Room mencurahkan seluruh lapisan makna ini ke dalam The Soul Gallery, sebuah ruang renungan dimana abstraksi, memori, dan kontras berpadu, ketika artefak dari berbagai penjuru Indonesia berdialog dengan karya seni kontemporer. Tekstur dan simbolisme keduanya mengingatkan kita pada sulaman kain dan hiasan upacara ritual leluhur, menciptakan gesekan sunyi antar zaman yang memadukan minimalisme modern dengan akar tradisi yang dalam. Dalam ruang gelap dan intim ini, bayangan dan bentuk menjadi narator, mengizinkan budaya, kriya, dan emosi hadir berdampingan.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 30,
    title: 'Pameran 75 Tahun Perancis Indonesia - Pink Room:  Tenun Rosé Lounge',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: `Tenun Rosé Lounge terinspirasi oleh keindahan warisan budaya Indonesia yang tertenun dalam setiap helai kain songket - simbol kesabaran, cinta, dan kerja keras yang diwariskan turun-temurun. Di balik benang emas yang ditenun dengan tangan penuh ketelatenan, tersimpan kisah harapan dan kebahagiaan keluarga, menjadikan songket bukan sekadar kain, melainkan ungkapan rasa syukur dan sukacita yang tulus. Warna merah muda dipilih untuk melambangkan bonheur (kebahagiaan), yang mewakili kelembutan, kasih sayang, dan semangat hidup yang cerah. Melalui perpaduan nuansa merah muda dan makna mendalam di balik proses menenun songket, lounge ini menjadi ruang yang merayakan kekayaan tradisi dan kebahagiaan hidup dallam suasana modern yang penuh cinta.`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 31,
    title: 'Sekolah Tari Tradisional Gratis Museum Nasional Indonesia',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: `Program ini merupakan bentuk kerja sama Museum dan Cagar Budaya (MCB) Unit Museum Nasional Indonesia bersama Yayasan Belantara Budaya Indonesia dalam mempromosikan & melestarikan budaya Indonesia melalui program Museum & Publik.`,
    image_url: '/src/assets/events/Sekolah Tari Tradisional Indonesia_YBBI.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 32,
    title: 'WISATA EDUKASI LORONG SEJARAH KEMHAN RI',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: `WISATA EDUKASI LORONG SEJARAH KEMHAN RI
🛡️ Menyusuri Jejak Perjuangan, Memahami Arti Pertahanan

✨ Kemhan Demi Bangsa ✨
Ayo ikuti kunjungan edukatif ke Lorong Sejarah Kementerian Pertahanan RI dan temukan kisah perjuangan para pahlawan dalam menjaga kedaulatan negara!

📍 Kementerian Pertahanan RI
🎫 Khusus bagi pengunjung yang telah membeli tiket Museum Nasional`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 33,
    title: 'Nglaras Gamelan',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: ` “Nglaras Gamelan” bersama Laras Kanita setiap Sabtu terakhir tiap bulan.
Kamu bisa mendengarkan Laras Kanita berlatih lagu-lagu klasik gamelan Jawa dan mencoba memainkan gamelan. ✨`,
    image_url: '/src/assets/events/nglaras gamelan.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 34,
    title: 'Rakopi: Rasa dan Kisah Kopi',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Nasional Indonesia',
    address: 'Jalan Medan Merdeka Barat No.12, Gambir, Jakarta Pusat, DKI Jakarta 10110',
    participants: 50,
    description: `Belajar cara meracik kopi & tur seru keliling Museum Nasional Indonesia`,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-3868172',
      email: '-',
      website: 'www.www.museumnasional.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 35,
    title: 'Tapak Tilas Proklamasi',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Perumusan Naskah Proklamasi',
    address: 'Jalan Imam Bonjol No.1, RT.9/RW.4, Menteng, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10310',
    participants: 50,
    description: ``,
    image_url: '',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+6221-31447439',
      email: '-',
      website: 'www.munasprok.or.id',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 36,
    title: 'Soft Launching Museum Song Terus 2022',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan "Soft Launching Museum Song Terus" dilakukan pada tanggal 12 Oktober 2022 dengan turut mengundang dari pihak pemerintah kabupaten pacitan dan stakeholder terkait seperti bpkw XI dan komunitas`,
    image_url: '/src/assets/events/soft launching song terus.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 37,
    title: 'Kegiatan Jelajah Terus 2023',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan jelajah situs yang berada di kawasan museum song terus dengan peserta dari tingkat smp/mts kecamatan punung, donorojo dan pringkuku.`,
    image_url: '/src/assets/events/Jelajah Terus 2023.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 38,
    title: 'Temu Publik 2023',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan yang dilakukan museum song terus dengan mempertemukan pihak museum song terus dengan para pelaku wisata di kabupaten pacitan`,
    image_url: '/src/assets/events/Temu Public Song Terus.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 39,
    title: 'Vredeburg Fair 9',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Pameran temporer yang dilakukan di museum benteng vredeburg dalam rangka kegiatan vredeburg fair #9`,
    image_url: '/src/assets/events/vredeburg Fair 9.jpg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 40,
    title: 'Workshop replika alat batu',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Workshop pembuatan replika alat batu yang dilakukan di museum song terus, dengan mengundang narasumber peneliti dan dari bpkw XI untuk menjelaskan tentang proses pembuatan replika dan praktek pembuatan replika alat batu`,
    image_url: '/src/assets/events/Workshop Replika Alat Batu.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 41,
    title: 'Song Terus Expo',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: ``,
    image_url: '/src/assets/events/Song Terus Expo.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 42,
    title: 'Temu publik vol 2',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan yang mempertemukan pihak museum song terus dengan pihak sekolah dari SD/MI, SMP/MTS, dan SMA/SMK/STM di kabupaten pacitan`,
    image_url: '/src/assets/events/Temu Publik Vol2.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 43,
    title: 'Temu publik vol 3',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan yang dilakukan museum song terus dengan mempertemukan pihak museum song terus dengan para pelaku wisata di kabupaten pacitan, kabupaten wonogiri dan propinsi daerah istimewa yogyakarta`,
    image_url: '/src/assets/events/Temu Publik Vol3.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 44,
    title: 'Jelajah Terus 2024',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan jelajah situs dengan melakukan penjelajahan situs sekitar museum song terus yang dilombakan di tingkat SMA/SMK`,
    image_url: '/src/assets/events/Jelajah Terus 2024.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 45,
    title: 'Ruang daya',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan menyaring aspirasi penggiat budaya di kabupaten pacitan dengan tema kegiatan seminar pemajuan kebudayaan pacitan`,
    image_url: '/src/assets/events/Ruang Daya Desember.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 46,
    title: 'Pameran Malang',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Pameran yang dilakukan di gedung kppn malang, dalam rangka harmusindo`,
    image_url: '/src/assets/events/Pameran Malang Oktober.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 47,
    title: 'Pameran Tulungagung',
    category: 'pameranTemporer',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Pameran yang dilakukan di museum daerah tulungagung`,
    image_url: '/src/assets/events/Pameran Tulungagung Oktober.jpeg',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 48,
    title: 'Workshop LKTI',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan lokakarya Lomba Karya Tulis Ilmiah dilakukan di museum song terus dengan mengundang peserta se karesidenan madiun`,
    image_url: '/src/assets/events/Workshop LKTI 2024.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 49,
    title: 'Layar Purba',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan kolaborasi dengan pihak ruang film pacitan dengan menggelar kegiatan nonton film bersama di amphiteater museum song terus`,
    image_url: '/src/assets/events/Layanan Purba April 2025.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 50,
    title: 'Rona Budaya',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Kegiatan kolaborasi dengan pihak rumah wayang beber tawangalun donorojo dengan mengadakan lomba mewarnai tingkat SD/MI`,
    image_url: '/src/assets/events/Rona Budaya.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
  {
    id: 51,
    title: 'Festival kuliner',
    category: 'event',
    date: '1 Maret - 30 Juni 2024',
    time: 'Sedang Berlangsung',
    location: 'Museum Song Terus',
    address: 'Jalan Gua Song Terus RT 1 RW 6, Dusun Weru, Desa Wareng, Kec. Punung, Kab. Pacitan, Jawa Timur 63553',
    participants: 50,
    description: `Pameran museum song terus yang dilakukan di pantai pancer door di kabupaten pacitan dalam rangka festival kuliner`,
    image_url: '/src/assets/events/Festival Kuliner Juli 2025.JPG',
    status: 'akan datang',
    highlights: [
      'Prasasti Kudadu asli dari tahun 1294',
      'Koleksi keramik Ming dari periode perdagangan',
      'Replika mahkota Raja Hayam Wuruk',
      'Diorama Trowulan - ibu kota Majapahit',
      'Film dokumenter "Jejak Majapahit"'
    ],
    schedule: [
      { time: '09:00-10:00', activity: 'Pembukaan dan sambutan' },
      { time: '10:00-12:00', activity: 'Tur terpandu koleksi utama' },
      { time: '12:00-13:00', activity: 'Istirahat dan makan siang' },
      { time: '13:00-15:00', activity: 'Workshop kaligrafi Jawa kuno' },
      { time: '15:00-17:00', activity: 'Diskusi panel dan tanya jawab' }
    ],
    contact: {
      phone: '+62821-4052-3401',
      email: '-',
      website: '-',
    },
    requirements: [
      'Pendaftaran online melalui website museum',
      'Membawa identitas diri (KTP/SIM/Paspor)',
      'Mengikuti protokol kesehatan',
      'Usia minimal 12 tahun untuk workshop'
    ]
  },
];
export const publications = [
  {
    title: '[Siaran Pers] Kemarin Pameran Fosil Manusia Purba Tarik Hampir 10000 Pengunjung di Museum Nasional Indonesia',
    description: 'Laporan lengkap kegiatan dan pencapaian Direktorat Museum dan Cagar Budaya tahun 2023',
    type: 'Laporan Tahunan',
    category: 'berita',
    year: '2023',
    size: '12.5 MB',
    pages: 156,
    downloadCount: 2543,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/[Siaran Pers] Kemarin Pameran Fosil Manusia Purba Tarik Hampir 10000 Pengunjung di Museum Nasional Indonesia.pdf'
  },
  {
    title: '[Siaran Pers] Museum Nasional Indonesia Rayakan Hari Disabilitas Internasional melalui Kampanye Pekan Inklusivitas',
    description: 'Panduan teknis konservasi dan perawatan koleksi museum',
    type: 'Panduan Teknis',
    category: 'berita',
    year: '2023',
    size: '8.2 MB',
    pages: 89,
    downloadCount: 1876,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/[Siaran Pers] Museum Nasional Indonesia Rayakan Hari Disabilitas Internasional melalui Kampanye Pekan Inklusivitas.pdf'
  },
  {
    title: '[Sipres] Resmikan Pameran Kompetisi BAAA #5, Menteri Kebudayaan Berharap Ruang Ini Menjadi Ajang Pembelajaran Budaya yang Inklusif, Interaktif, dan Relevan Bagi Generasi Muda',
    description: 'Katalog lengkap koleksi Museum Nasional Indonesia',
    type: 'Katalog',
    category: 'berita',
    year: '2023',
    size: '45.7 MB',
    pages: 324,
    downloadCount: 3421,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/[Sipres] Resmikan Pameran Kompetisi BAAA 5.pdf'
  },
  {
    title: 'BERITA MEMPERINGATI HARI FILM NASIONAL',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/BERITA MEMPERINGATI HARI FILM NASIONAL.pdf'
  },
  {
    title: 'INFORMASI KEGIATAN -  Pameran Misykat (1)',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/INFORMASI KEGIATAN -  Pameran Misykat (1).pdf'
  },
  {
    title: 'Informasi Kegiatan Pameran SUNTING',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Informasi Kegiatan Pameran SUNTING.pdf'
  },
  {
    title: 'MCB Tandatangani Perjanjian Strategis dengan Mitra Prancis',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/MCB Tandatangani Perjanjian Strategis dengan Mitra Prancis.pdf'
  },
  {
    title: 'Menteri Kebudayaan Ajak Para Pakar Kolaborasi Berdiskusi dan Berbagi Pengetahuan Untuk Kemajuan Kebudayaan',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Menteri_Kebudayaan_Ajak_Para_Pakar_Kolaborasi_Berdiskusi_dan_Berbagi_Pengetahuan_Untuk_Kemajuan_Kebudayaan.pdf'
  },
  {
    title: 'Siaran Berita-Resmikan Pameran Jejak Perlawanan “Sang Presiden 2001” Tribut untuk Hardi (1951-2023), Menteri Fadli Zon Kenang Hardi Sosok Yang Kreatif dan Kritis',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'berita',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Siaran Berita-Resmikan Pameran Jejak Perlawanan “Sang Presiden 2001” Tribut untuk Hardi (1951-2023).pdf'
  },
  {
    title: 'SIARAN PERS - Pameran Fosil Manusia Purba di Museum Nasional Tarik Lebih dari 12000 Pengunjung dalam Dua Hari Terakhir',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'pengumuman',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/SIARAN PERS - Pameran Fosil Manusia Purba di Museum Nasional Tarik Lebih dari 12000 Pengunjung dalam Dua Hari Terakhir.pdf'
  },
  {
    title: 'Sipres - Angkat Hasjim Djojohadikusumo Sebagai Ketua Dewan Penyantun, Menteri Kebudayaan Harapkan Dukungan Seluruh Stakeholder Dalam Memajukan Museum dan Cagar Budaya',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'pengumuman',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Sipres - Angkat Hasjim Djojohadikusumo Sebagai Ketua Dewan Penyantun.pdf'
  },
  {
    title: 'Sipres - Menteri Kebudayaan Nilai Semesta Arkiv Sebagai Spirit Baru Kreativitas Tanpa Batas',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'artikel',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Sipres - Menteri Kebudayaan Nilai Semesta Arkiv Sebagai Spirit Baru Kreativitas Tanpa Batas.pdf'
  },
  {
    title: 'Sipres - Menteri Kebudayaan Sambut Baik Pameran Kongsi Sebagai Media Pemersatu Bangsa',
    description: 'Standar operasional pengelolaan museum di Indonesia',
    type: 'Standar',
    category: 'kemitraan',
    year: '2022',
    size: '5.4 MB',
    pages: 67,
    downloadCount: 987,
    published_at: '2023-01-01',
    url: '/src/assets/Berita/Sipres - Menteri Kebudayaan Sambut Baik Pameran Kongsi Sebagai Media Pemersatu Bangsa (1).pdf'
  },
];
export const news = [
  {
    id: 1,
    title: 'Peluncuran Program Digitalisasi Koleksi Museum Nasional',
    excerpt: 'Program ambisius untuk mendigitalkan seluruh koleksi museum nasional dimulai tahun ini.',
    content: 'Jakarta - Direktorat Museum dan Cagar Budaya meluncurkan program digitalisasi koleksi museum nasional yang akan berlangsung selama tiga tahun ke depan. Program ini bertujuan untuk melestarikan warisan budaya Indonesia melalui teknologi digital. Direktur Museum dan Cagar Budaya, Dr. Ahmad Mahendra, menjelaskan bahwa program ini akan mencakup digitalisasi lebih dari 500.000 artefak dan koleksi museum yang tersebar di seluruh Indonesia. "Ini adalah langkah strategis untuk memastikan warisan budaya kita dapat diakses oleh generasi mendatang," ujarnya. Program digitalisasi akan dilaksanakan dalam tiga tahap: Tahap 1: Digitalisasi koleksi museum nasional utama (2024), Tahap 2: Digitalisasi museum regional (2025), Tahap 3: Integrasi platform digital nasional (2026). Setiap artefak akan difoto dengan teknologi resolusi tinggi dan dilengkapi dengan metadata lengkap termasuk sejarah, asal daerah, dan nilai kulturalnya. Manfaat untuk Masyarakat Platform digital ini akan memungkinkan masyarakat untuk: Mengakses koleksi museum secara virtual, Melakukan penelitian budaya dan sejarah, Mendukung pendidikan dan pembelajaran, Mempromosikan pariwisata budaya. Program ini juga akan didukung oleh teknologi Virtual Reality (VR) dan Augmented Reality (AR) untuk memberikan pengalaman yang lebih imersif bagi pengunjung virtual.',
    image: '/src/assets/museum-interior.jpg',
    date: '2024-01-15',
    author: 'Tim Redaksi',
    category: 'Berita'
  },
  {
    id: 2,
    title: 'Kerjasama Internasional Pelestarian Cagar Budaya',
    excerpt: 'Indonesia menandatangani MoU dengan UNESCO untuk program pelestarian.',
    content: 'Paris - Indonesia resmi menandatangani Memorandum of Understanding (MoU) dengan UNESCO untuk memperkuat program pelestarian cagar budaya. Penandatanganan dilakukan oleh Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia bersama Direktur Jenderal UNESCO. Kerjasama ini mencakup berbagai aspek pelestarian warisan budaya, termasuk peningkatan kapasitas sumber daya manusia, transfer teknologi konservasi, dan pengembangan standar internasional pelestarian cagar budaya. Fokus Kerjasama. Program kerjasama akan berfokus pada: Pelatihan konservasionis Indonesia di pusat-pusat UNESCO, Pertukaran teknologi konservasi modern, Penelitian bersama tentang teknik pelestarian, Pengembangan standar dokumentasi cagar budaya. Kerjasama ini akan memperkuat kapabilitas Indonesia dalam melindungi warisan budaya yang sangat kaya dan beragam," kata Direktur Jenderal UNESCO dalam sambutannya. Target dan Rencana Dalam lima tahun ke depan, program ini menargetkan: Pelatihan 500 tenaga ahli konservasi, Restorasi 50 situs cagar budaya prioritas, Pengembangan 10 pusat konservasi regional, Publikasi pedoman teknis pelestarian',
    image: '/src/assets/heritage-sites.jpg',
    date: '2024-01-12',
    author: 'Tim Redaksi',
    category: 'Kemitraan'
  },
  {
    id: 3,
    title: 'Workshop Konservasi Artefak untuk Kurator Museum',
    excerpt: 'Pelatihan teknik konservasi modern untuk meningkatkan kualitas perawatan koleksi.',
    content: 'Yogyakarta - Direktorat Museum dan Cagar Budaya menyelenggarakan workshop konservasi artefak yang diikuti oleh 100 kurator museum dari seluruh Indonesia. Workshop ini bertujuan untuk meningkatkan kompetensi dalam perawatan dan pelestarian koleksi museum. Workshop selama tiga hari ini menghadirkan narasumber ahli konservasi dari dalam dan luar negeri, termasuk spesialis dari Museum Nasional Thailand dan Museum Victoria & Albert London. Materi Workshop. Peserta mendapatkan pelatihan komprehensif tentang: Teknik konservasi preventif dan kuratif, Analisis kondisi artefak, Penggunaan peralatan konservasi modern, Dokumentasi proses konservasi, Penanganan koleksi sensitif. Dr. Sarah Williams dari Museum Victoria & Albert menyampaikan, "Konservasi bukan hanya tentang memperbaiki yang rusak, tetapi lebih kepada mencegah kerusakan sejak dini.". Praktik Lapangan. Selain teori, peserta juga melakukan praktik langsung konservasi berbagai jenis artefak: Tekstil tradisional, Keramik dan tembikar, Logam dan perhiasan, Naskah dan dokumen bersejarah, Lukisan dan karya seni. Workshop ini merupakan bagian dari program pengembangan kapasitas museum yang akan berlanjut dengan sertifikasi kompetensi konservasi tingkat nasional.',
    image: '/src/assets/hero-borobudur.jpg',
    date: '2024-01-10',
    author: 'Tim Redaksi',
    category: 'Artikel'
  }
];
export const defaultMemories = [
  {
    id: 1,
    title: 'Peresmian Candi Borobudur',
    subtitle: 'Peresmian selesainya pemugaran Candi Borobudur oleh Presiden Soeharto, 28 Februari 1983',
    image_url: '/src/assets/collections/6235.jpg',
  },
  {
    id: 2,
    title: 'Peresmian Candi Borobudur',
    subtitle: 'Peresmian dimulainya pemugaran Candi Borobudur oleh Presiden Soeharto, 10 Agustus 1973',
    image_url: '/src/assets/collections/20063.jpg',
  },
]