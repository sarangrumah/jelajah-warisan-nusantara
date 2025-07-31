import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        beranda: "Home",
        agenda: "Agenda",
        tentangKami: "About Us",
        mediaPublikasi: "Media & Publications",
        hubungiKami: "Contact Us",
        career: "Career",
        ppid: "PPID",
        admin: "Admin"
      },
      // Hero Section
      hero: {
        title: "Preserving Indonesia's Cultural Heritage",
        subtitle: "Directorate of Museums and Cultural Heritage - Managing and preserving national heritage for future generations",
        watchVideo: "Watch Video",
        exploreMuseums: "Explore Museums"
      },
      // Profile Section
      profile: {
        title: "About Us",
        description: "The Directorate of Museums and Cultural Heritage is responsible for the preservation, management, and development of Indonesia's cultural heritage for education, research, and cultural tourism purposes.",
        vision: "Vision",
        visionText: "To become a leading institution in the preservation and management of world-class and sustainable Indonesian cultural heritage.",
        mission: "Mission",
        missionItems: [
          "• Manage and preserve national museum collections",
          "• Protect and maintain cultural heritage sites",
          "• Develop education and research programs",
          "• Promote sustainable cultural tourism"
        ],
        callToAction: "Let's Preserve Indonesian Culture Together",
        callToActionText: "Join us in preserving the cultural richness of the archipelago for future generations.",
        learnMore: "Learn More",
        stats: {
          museums: "Registered Museums",
          heritage: "Cultural Heritage",
          provinces: "Provinces",
          experience: "Years of Experience"
        }
      },
      // Management Section
      management: {
        title: "Integrated National Management",
        description: "Professional management of museums and cultural heritage sites throughout Indonesia with modern and integrated systems.",
        museum: {
          title: "Museum Management",
          description: "Comprehensive management of museum collections, operations, and public services",
          features: [
            "Collection Management",
            "Exhibition Programs",
            "Educational Services",
            "Digital Archives"
          ],
          stats: {
            museums: "Active Museums",
            collections: "Collection Items",
            visitors: "Annual Visitors"
          }
        },
        heritage: {
          title: "Cultural Heritage Management",
          description: "Conservation and protection of cultural heritage sites and historical artifacts",
          features: [
            "Site Conservation",
            "Archaeological Research",
            "Heritage Documentation",
            "Community Programs"
          ],
          stats: {
            sites: "Heritage Sites",
            artifacts: "Protected Artifacts",
            programs: "Active Programs"
          }
        },
        manage: "Manage",
        viewAgenda: "View Agenda"
      },
      // Agenda Section
      agenda: {
        title: "Agenda & Events",
        subtitle: "Follow exciting activities from museums and cultural heritage sites throughout Indonesia"
      },
      // Footer translations
      footer: {
        orgName: "Museum and Cultural Heritage",
        address: "Jl. Jenderal Sudirman No. 123, Jakarta",
        phone: "+62 21 1234 5678",
        email: "info@museumbudaya.go.id",
        quickLinks: "Quick Links",
        socialMedia: "Social Media",
        copyright: "© 2024 Museum and Cultural Heritage. All Rights Reserved.",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
        sitemap: "Sitemap"
      },
      // About Us sections
      about: {
        companyProfile: {
          title: "Institution Profile",
          subtitle: "The Directorate of Museums and Cultural Heritage is a second-level echelon unit under the Directorate General of Culture, Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia.",
          historyTitle: "History & Development",
          historyText1: "Established with the aim of managing, preserving, and developing museums and cultural heritage sites throughout Indonesia. Since its founding, we have played an active role in preserving the nation's cultural heritage.",
          historyText2: "With more than 50 years of experience, we continue to innovate in facing modern challenges while maintaining traditional values in cultural preservation.",
          commitmentTitle: "Our Commitment",
          commitmentText: "Safeguarding and preserving Indonesia's cultural wealth through professional museum management, preservation of historical sites, and development of sustainable educational programs.",
          highlights: {
            institution: {
              title: "Trusted Institution",
              description: "Official government agency managing Indonesia's cultural heritage"
            },
            team: {
              title: "Professional Team",
              description: "Supported by expert conservators, curators, and experienced researchers"
            },
            mission: {
              title: "Preservation Mission",
              description: "Committed to preserving cultural heritage for future generations"
            },
            recognition: {
              title: "International Recognition",
              description: "Various awards in the field of cultural preservation"
            }
          }
        },
        services: {
          title: "Our Services",
          subtitle: "We provide various professional services in the field of preservation and management of Indonesian cultural heritage.",
          heritage: {
            title: "Cultural Heritage Preservation",
            description: "Conservation and restoration of historical sites and cultural artifacts",
            features: ["Preventive conservation", "Structural restoration", "Condition monitoring", "Digital documentation"]
          },
          museum: {
            title: "Museum Management",
            description: "Comprehensive management of museum collections, operations, and public services",
            features: ["Collection curation", "Storage management", "Exhibition programs", "Visitor services"]
          },
          research: {
            title: "Research & Development",
            description: "Scientific research for developing modern preservation methods",
            features: ["Archaeological research", "Conservation studies", "Technology innovation", "Scientific publications"]
          },
          international: {
            title: "International Cooperation",
            description: "Collaboration with international institutions in cultural preservation",
            features: ["Exchange programs", "International standards", "Capacity building", "Best practices"]
          },
          digitization: {
            title: "Heritage Digitization",
            description: "Digital transformation of collections for preservation and public access",
            features: ["3D scanning", "Virtual reality", "Digital database", "Online platform"]
          },
          education: {
            title: "Education & Outreach",
            description: "Educational programs and socialization to the community",
            features: ["Community workshops", "School programs", "HR training", "Awareness campaigns"]
          },
          consultationTitle: "Need Special Services?",
          consultationText: "Our expert team is ready to help you with specific needs in cultural heritage preservation and management.",
          consultationButton: "Free Consultation"
        },
        rules: {
          title: "Regulations & Operational Standards",
          subtitle: "Legal basis and standard procedures governing museum management and cultural heritage preservation in Indonesia.",
          regulationsTitle: "Regulations & Laws",
          sopTitle: "Standard Operating Procedures (SOP)",
          needHelpTitle: "Need Help with Regulations?",
          needHelpText: "Our legal team is ready to help you understand and apply applicable regulations in cultural heritage management.",
          needHelpButton: "Legal Consultation",
          regulations: [
            {
              title: "Law No. 11 of 2010",
              description: "Law on Cultural Heritage",
              type: "Law"
            },
            {
              title: "Government Regulation No. 66 of 2015",
              description: "Government Regulation on Museums",
              type: "Government Regulation"
            },
            {
              title: "Minister of Education Regulation No. 52 of 2021",
              description: "Preservation and Utilization of Cultural Heritage",
              type: "Ministerial Regulation"
            },
            {
              title: "Minister of Education Regulation No. 19 of 2017",
              description: "Government Museum Management",
              type: "Ministerial Regulation"
            }
          ],
          procedures: [
            {
              title: "Cultural Heritage Registration SOP",
              description: "Procedures for registration and determination of cultural heritage status"
            },
            {
              title: "Research Permit SOP",
              description: "Procedures for applying for research permits at museums and sites"
            },
            {
              title: "Collection Conservation SOP",
              description: "Standard procedures for conservation and maintenance of museum collections"
            },
            {
              title: "Temporary Exhibition SOP",
              description: "Procedures for organizing temporary exhibitions"
            }
          ]
        }
      },
      // PPID Section
      ppid: {
        title: "PPID - Information and Documentation Management Officer",
        subtitle: "Transparent and accountable public information services in accordance with Law No. 14 of 2008 on Public Information Disclosure.",
        informationTypes: {
          periodic: {
            title: "Periodic Information",
            description: "Information that must be provided and announced periodically",
            timeline: "Published every 6 months",
            examples: ["Annual financial reports", "Performance reports", "Institutional profile", "Organizational structure"]
          },
          immediate: {
            title: "Immediate Information",
            description: "Information that can threaten the livelihood of many people and public order",
            timeline: "Published immediately",
            examples: ["Emergency information", "Sudden policies", "Important announcements", "Service status"]
          },
          anytime: {
            title: "Anytime Information",
            description: "Information that must be provided and announced at any time",
            timeline: "Available anytime",
            examples: ["Public information list", "Decision results", "Policies and regulations", "Service SOPs"]
          }
        },
        requestProcedure: {
          title: "Information Request Procedure",
          subtitle: "Steps to submit a public information request",
          totalTime: "💡 Maximum total service time is 13 working days according to KIP Law regulations",
          steps: [
            {
              title: "Application Submission",
              description: "Submit information request through form or official letter",
              duration: "1 day"
            },
            {
              title: "Registration & Verification",
              description: "PPID officer performs registration and completeness verification",
              duration: "2 days"
            },
            {
              title: "Information Search",
              description: "Team conducts search and classification of requested information",
              duration: "7 days"
            },
            {
              title: "Decision & Delivery",
              description: "Decision is delivered along with information or reasons for rejection",
              duration: "3 days"
            }
          ]
        },
        documents: {
          title: "Documents & Forms",
          subtitle: "Download documents required for information requests",
          items: [
            { title: "Information Request Form", type: "PDF", size: "245 KB" },
            { title: "PPID Service Standards", type: "PDF", size: "1.2 MB" },
            { title: "List of Excluded Information", type: "PDF", size: "780 KB" },
            { title: "PPID Service Charter", type: "PDF", size: "540 KB" }
          ],
          submitButton: "Submit Information Request"
        },
        contact: {
          title: "PPID Contact",
          phone: "Phone",
          email: "Email",
          hours: "Service Hours",
          hoursText: "Monday - Friday: 08:00 - 16:00 WIB"
        },
        commitment: {
          title: "Service Commitment",
          description: "We are committed to providing fast, accurate, and transparent public information services to all Indonesian citizens in accordance with the principles of public information disclosure.",
          stats: {
            response: "Initial Response",
            service: "Maximum Service",
            transparency: "Transparent"
          }
        }
      },
      // Career Section
      career: {
        title: "Internship Programs",
        subtitle: "Join us in preserving Indonesia's cultural heritage through our comprehensive internship programs.",
        programs: {
          title: "Available Programs",
          items: [
            {
              title: "Museum Curation Internship",
              department: "Collections & Exhibitions",
              duration: "3-6 months",
              description: "Learn about collection management, exhibition planning, and museum operations."
            },
            {
              title: "Heritage Conservation Internship",
              department: "Conservation",
              duration: "4-6 months",
              description: "Hands-on experience in artifact restoration and site preservation techniques."
            },
            {
              title: "Digital Archives Internship",
              department: "Technology",
              duration: "3-4 months",
              description: "Work on digitization projects and database management systems."
            },
            {
              title: "Education Program Internship",
              department: "Public Programs",
              duration: "3-5 months",
              description: "Develop and implement educational programs for various audiences."
            },
            {
              title: "Research Internship",
              department: "Research & Development",
              duration: "4-6 months",
              description: "Participate in archaeological and historical research projects."
            }
          ]
        },
        benefits: {
          title: "Program Benefits",
          items: [
            "Professional mentorship from experienced staff",
            "Hands-on experience with cultural heritage",
            "Certificate of completion",
            "Networking opportunities",
            "Monthly allowance",
            "Professional development workshops"
          ]
        },
        process: {
          title: "Application Process",
          steps: [
            {
              title: "Online Application",
              description: "Submit your application through our online portal with required documents."
            },
            {
              title: "Document Review",
              description: "Our team will review your application and academic qualifications."
            },
            {
              title: "Interview",
              description: "Selected candidates will be invited for an interview session."
            },
            {
              title: "Program Assignment",
              description: "Successful applicants will be assigned to their preferred department."
            }
          ]
        },
        contact: {
          title: "Questions?",
          description: "Contact our internship coordinator for more information about available positions and application requirements.",
          button: "Contact Coordinator"
        }
      },
      // Buttons
      buttons: {
        readMore: "Read More",
        viewAll: "View All",
        download: "Download",
        contact: "Contact",
        apply: "Apply",
        submit: "Submit",
        downloadDocument: "Download Document",
        viewDetails: "View Details",
        freeConsultation: "Free Consultation"
      }
    }
  },
  id: {
    translation: {
      // Navigation
      nav: {
        beranda: "Beranda",
        agenda: "Agenda", 
        tentangKami: "Tentang Kami",
        mediaPublikasi: "Media & Publikasi",
        hubungiKami: "Hubungi Kami",
        career: "Career",
        ppid: "PPID",
        admin: "Admin"
      },
      // Hero Section
      hero: {
        title: "Melestarikan Warisan Budaya Indonesia",
        subtitle: "Direktorat Museum dan Cagar Budaya - Mengelola dan melestarikan warisan nasional untuk generasi mendatang",
        watchVideo: "Tonton Video",
        exploreMuseums: "Jelajahi Museum"
      },
      // Profile Section
      profile: {
        title: "Tentang Kami",
        description: "Direktorat Museum dan Cagar Budaya bertanggung jawab dalam pelestarian, pengelolaan, dan pengembangan warisan budaya Indonesia untuk kepentingan pendidikan, penelitian, dan pariwisata budaya.",
        vision: "Visi",
        visionText: "Menjadi institusi terdepan dalam pelestarian dan pengelolaan warisan budaya Indonesia yang berkualitas dunia dan berkelanjutan.",
        mission: "Misi",
        missionItems: [
          "• Mengelola dan melestarikan koleksi museum nasional",
          "• Melindungi dan memelihara situs cagar budaya", 
          "• Mengembangkan program edukasi dan penelitian",
          "• Mempromosikan pariwisata budaya berkelanjutan"
        ],
        callToAction: "Mari Bersama Lestarikan Budaya Indonesia",
        callToActionText: "Bergabunglah dengan kami dalam upaya melestarikan kekayaan budaya nusantara untuk generasi mendatang.",
        learnMore: "Pelajari Lebih Lanjut",
        stats: {
          museums: "Museum Terdaftar",
          heritage: "Cagar Budaya", 
          provinces: "Provinsi",
          experience: "Tahun Pengalaman"
        }
      },
      // Management Section
      management: {
        title: "Sistem Terintegrasi Nasional",
        description: "Pengelolaan profesional museum dan situs cagar budaya di seluruh Indonesia dengan sistem modern dan terintegrasi.",
        museum: {
          title: "Pengelolaan Museum",
          description: "Pengelolaan komprehensif koleksi museum, operasional, dan layanan publik",
          features: [
            "Manajemen Koleksi",
            "Program Pameran",
            "Layanan Edukasi",
            "Arsip Digital"
          ],
          stats: {
            museums: "Museum Aktif",
            collections: "Item Koleksi", 
            visitors: "Pengunjung per Tahun"
          }
        },
        heritage: {
          title: "Pengelolaan Cagar Budaya",
          description: "Konservasi dan perlindungan situs cagar budaya serta artefak bersejarah",
          features: [
            "Konservasi Situs",
            "Penelitian Arkeologi",
            "Dokumentasi Warisan",
            "Program Komunitas"
          ],
          stats: {
            sites: "Situs Cagar Budaya",
            artifacts: "Artefak Terlindungi",
            programs: "Program Aktif"
          }
        },
        manage: "Kelola",
        viewAgenda: "Lihat Agenda"
      },
      // Agenda Section
      agenda: {
        title: "Agenda & Event",
        subtitle: "Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia"
      },
      // Footer translations
      footer: {
        orgName: "Museum dan Cagar Budaya",
        address: "Jl. Jenderal Sudirman No. 123, Jakarta",
        phone: "+62 21 1234 5678",
        email: "info@museumbudaya.go.id",
        quickLinks: "Tautan Cepat",
        socialMedia: "Media Sosial",
        copyright: "© 2024 Museum dan Cagar Budaya. Hak Cipta Dilindungi.",
        privacy: "Kebijakan Privasi",
        terms: "Syarat & Ketentuan",
        sitemap: "Peta Situs"
      },
      // About Us sections
      about: {
        companyProfile: {
          title: "Profil Institusi",
          subtitle: "Direktorat Museum dan Cagar Budaya merupakan unit eselon II di bawah Direktorat Jenderal Kebudayaan, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia.",
          historyTitle: "Sejarah & Perkembangan",
          historyText1: "Didirikan dengan tujuan untuk mengelola, melestarikan, dan mengembangkan museum serta situs cagar budaya di seluruh Indonesia. Sejak berdiri, kami telah berperan aktif dalam pelestarian warisan budaya bangsa.",
          historyText2: "Dengan pengalaman lebih dari 50 tahun, kami terus berinovasi dalam menghadapi tantangan modern sambil mempertahankan nilai-nilai tradisional dalam pelestarian budaya.",
          commitmentTitle: "Komitmen Kami",
          commitmentText: "Menjaga dan melestarikan kekayaan budaya Indonesia melalui pengelolaan museum yang profesional, pelestarian situs bersejarah, dan pengembangan program edukasi yang berkelanjutan.",
          highlights: {
            institution: {
              title: "Institusi Terpercaya",
              description: "Lembaga resmi pemerintah yang mengelola warisan budaya Indonesia"
            },
            team: {
              title: "Tim Profesional", 
              description: "Didukung oleh para ahli konservasi, kurator, dan peneliti berpengalaman"
            },
            mission: {
              title: "Misi Pelestarian",
              description: "Berkomitmen melestarikan warisan budaya untuk generasi mendatang"
            },
            recognition: {
              title: "Pengakuan Internasional",
              description: "Berbagai penghargaan dalam bidang pelestarian budaya"
            }
          }
        },
        services: {
          title: "Layanan Kami",
          subtitle: "Kami menyediakan berbagai layanan profesional dalam bidang pelestarian dan pengelolaan warisan budaya Indonesia.",
          heritage: {
            title: "Pelestarian Cagar Budaya",
            description: "Konservasi dan restorasi situs bersejarah serta artefak budaya",
            features: ["Konservasi preventif", "Restorasi struktural", "Monitoring kondisi", "Dokumentasi digital"]
          },
          museum: {
            title: "Pengelolaan Museum",
            description: "Pengelolaan komprehensif koleksi museum, operasional, dan layanan publik",
            features: ["Kurasi koleksi", "Manajemen penyimpanan", "Program pameran", "Layanan pengunjung"]
          },
          research: {
            title: "Penelitian & Pengembangan",
            description: "Riset ilmiah untuk pengembangan metode pelestarian modern",
            features: ["Penelitian arkeologi", "Studi konservasi", "Inovasi teknologi", "Publikasi ilmiah"]
          },
          international: {
            title: "Kerjasama Internasional",
            description: "Kolaborasi dengan lembaga internasional dalam pelestarian budaya",
            features: ["Program pertukaran", "Standar internasional", "Capacity building", "Best practices"]
          },
          digitization: {
            title: "Digitalisasi Warisan",
            description: "Transformasi digital koleksi untuk preservasi dan akses publik",
            features: ["3D scanning", "Virtual reality", "Database digital", "Platform online"]
          },
          education: {
            title: "Edukasi & Outreach",
            description: "Program pendidikan dan sosialisasi kepada masyarakat",
            features: ["Workshop komunitas", "Program sekolah", "Pelatihan SDM", "Kampanye awareness"]
          },
          consultationTitle: "Butuh Layanan Khusus?",
          consultationText: "Tim ahli kami siap membantu Anda dengan kebutuhan khusus dalam pelestarian dan pengelolaan warisan budaya.",
          consultationButton: "Konsultasi Gratis"
        },
        rules: {
          title: "Regulasi & Standar Operasional",
          subtitle: "Dasar hukum dan prosedur standar yang mengatur pengelolaan museum dan pelestarian cagar budaya di Indonesia.",
          regulationsTitle: "Regulasi & Peraturan",
          sopTitle: "Standar Operasional Prosedur (SOP)",
          needHelpTitle: "Perlu Bantuan dengan Regulasi?",
          needHelpText: "Tim legal kami siap membantu Anda memahami dan menerapkan regulasi yang berlaku dalam pengelolaan warisan budaya.",
          needHelpButton: "Konsultasi Legal",
          regulations: [
            {
              title: "UU No. 11 Tahun 2010",
              description: "Undang-Undang tentang Cagar Budaya",
              type: "Undang-Undang"
            },
            {
              title: "PP No. 66 Tahun 2015",
              description: "Peraturan Pemerintah tentang Museum",
              type: "Peraturan Pemerintah"
            },
            {
              title: "Permendikbud No. 52 Tahun 2021",
              description: "Pelestarian dan Pemanfaatan Cagar Budaya",
              type: "Peraturan Menteri"
            },
            {
              title: "Permendikbud No. 19 Tahun 2017",
              description: "Pengelolaan Museum Pemerintah",
              type: "Peraturan Menteri"
            }
          ],
          procedures: [
            {
              title: "SOP Registrasi Cagar Budaya",
              description: "Prosedur pendaftaran dan penetapan status cagar budaya"
            },
            {
              title: "SOP Izin Penelitian",
              description: "Tata cara permohonan izin penelitian di museum dan situs"
            },
            {
              title: "SOP Konservasi Koleksi",
              description: "Standar prosedur konservasi dan perawatan koleksi museum"
            },
            {
              title: "SOP Pameran Temporer",
              description: "Prosedur penyelenggaraan pameran sementara"
            }
          ]
        }
      },
      // PPID Section
      ppid: {
        title: "PPID - Pejabat Pengelola Informasi dan Dokumentasi",
        subtitle: "Pelayanan informasi publik yang transparan dan akuntabel sesuai dengan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
        informationTypes: {
          periodic: {
            title: "Informasi Berkala",
            description: "Informasi yang wajib disediakan dan diumumkan secara berkala",
            timeline: "Dipublikasi setiap 6 bulan",
            examples: ["Laporan keuangan tahunan", "Laporan kinerja", "Profil institusi", "Struktur organisasi"]
          },
          immediate: {
            title: "Informasi Serta Merta",
            description: "Informasi yang dapat mengancam hajat hidup orang banyak dan ketertiban umum",
            timeline: "Dipublikasi segera",
            examples: ["Informasi darurat", "Kebijakan mendadak", "Pengumuman penting", "Status layanan"]
          },
          anytime: {
            title: "Informasi Setiap Saat",
            description: "Informasi yang wajib disediakan dan diumumkan setiap saat",
            timeline: "Tersedia setiap saat",
            examples: ["Daftar informasi publik", "Hasil keputusan", "Kebijakan dan regulasi", "SOP layanan"]
          }
        },
        requestProcedure: {
          title: "Prosedur Permohonan Informasi",
          subtitle: "Langkah-langkah untuk mengajukan permohonan informasi publik",
          totalTime: "💡 Total waktu layanan maksimal 13 hari kerja sesuai regulasi UU KIP",
          steps: [
            {
              title: "Pengajuan Permohonan",
              description: "Ajukan permohonan informasi melalui formulir atau surat resmi",
              duration: "1 hari"
            },
            {
              title: "Registrasi & Verifikasi",
              description: "Petugas PPID melakukan registrasi dan verifikasi kelengkapan",
              duration: "2 hari"
            },
            {
              title: "Penelusuran Informasi",
              description: "Tim melakukan penelusuran dan klasifikasi informasi yang diminta",
              duration: "7 hari"
            },
            {
              title: "Keputusan & Penyampaian",
              description: "Keputusan disampaikan beserta informasi atau alasan penolakan",
              duration: "3 hari"
            }
          ]
        },
        documents: {
          title: "Dokumen & Formulir",
          subtitle: "Unduh dokumen yang diperlukan untuk permohonan informasi",
          items: [
            { title: "Formulir Permohonan Informasi", type: "PDF", size: "245 KB" },
            { title: "Standar Layanan PPID", type: "PDF", size: "1.2 MB" },
            { title: "Daftar Informasi yang Dikecualikan", type: "PDF", size: "780 KB" },
            { title: "Maklumat Pelayanan PPID", type: "PDF", size: "540 KB" }
          ],
          submitButton: "Ajukan Permohonan Informasi"
        },
        contact: {
          title: "Kontak PPID",
          phone: "Telepon",
          email: "Email",
          hours: "Jam Layanan",
          hoursText: "Senin - Jumat: 08:00 - 16:00 WIB"
        },
        commitment: {
          title: "Komitmen Pelayanan",
          description: "Kami berkomitmen untuk memberikan pelayanan informasi publik yang cepat, akurat, dan transparan kepada seluruh masyarakat Indonesia sesuai dengan prinsip keterbukaan informasi publik.",
          stats: {
            response: "Respon Awal",
            service: "Maksimal Layanan",
            transparency: "Transparan"
          }
        }
      },
      // Career Section
      career: {
        title: "Program Magang",
        subtitle: "Bergabunglah dengan kami dalam melestarikan warisan budaya Indonesia melalui program magang yang komprehensif.",
        programs: {
          title: "Program yang Tersedia",
          items: [
            {
              title: "Magang Kurasi Museum",
              department: "Koleksi & Pameran",
              duration: "3-6 bulan",
              description: "Pelajari manajemen koleksi, perencanaan pameran, dan operasional museum."
            },
            {
              title: "Magang Konservasi Warisan",
              department: "Konservasi",
              duration: "4-6 bulan",
              description: "Pengalaman langsung dalam restorasi artefak dan teknik pelestarian situs."
            },
            {
              title: "Magang Arsip Digital",
              department: "Teknologi",
              duration: "3-4 bulan",
              description: "Bekerja pada proyek digitalisasi dan sistem manajemen database."
            },
            {
              title: "Magang Program Edukasi",
              department: "Program Publik",
              duration: "3-5 bulan",
              description: "Mengembangkan dan melaksanakan program edukasi untuk berbagai audiens."
            },
            {
              title: "Magang Penelitian",
              department: "Penelitian & Pengembangan",
              duration: "4-6 bulan",
              description: "Berpartisipasi dalam proyek penelitian arkeologi dan sejarah."
            }
          ]
        },
        benefits: {
          title: "Manfaat Program",
          items: [
            "Bimbingan profesional dari staf berpengalaman",
            "Pengalaman langsung dengan warisan budaya",
            "Sertifikat penyelesaian",
            "Kesempatan networking",
            "Tunjangan bulanan",
            "Workshop pengembangan profesional"
          ]
        },
        process: {
          title: "Proses Pendaftaran",
          steps: [
            {
              title: "Pendaftaran Online",
              description: "Kirim aplikasi Anda melalui portal online dengan dokumen yang diperlukan."
            },
            {
              title: "Review Dokumen",
              description: "Tim kami akan meninjau aplikasi dan kualifikasi akademik Anda."
            },
            {
              title: "Wawancara",
              description: "Kandidat terpilih akan diundang untuk sesi wawancara."
            },
            {
              title: "Penempatan Program",
              description: "Pelamar yang berhasil akan ditempatkan di departemen yang diinginkan."
            }
          ]
        },
        contact: {
          title: "Ada Pertanyaan?",
          description: "Hubungi koordinator magang kami untuk informasi lebih lanjut tentang posisi yang tersedia dan persyaratan pendaftaran.",
          button: "Hubungi Koordinator"
        }
      },
      // Buttons
      buttons: {
        readMore: "Baca Selengkapnya",
        viewAll: "Lihat Semua",
        download: "Unduh",
        contact: "Hubungi",
        apply: "Daftar",
        submit: "Kirim",
        downloadDocument: "Unduh Dokumen",
        viewDetails: "Lihat Detail SOP",
        freeConsultation: "Konsultasi Gratis"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    lng: 'id', // default language
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;