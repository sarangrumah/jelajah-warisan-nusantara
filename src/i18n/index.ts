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
      // Buttons
      buttons: {
        readMore: "Read More",
        viewAll: "View All",
        download: "Download",
        contact: "Contact",
        apply: "Apply",
        submit: "Submit"
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
      // Buttons
      buttons: {
        readMore: "Baca Selengkapnya",
        viewAll: "Lihat Semua",
        download: "Unduh",
        contact: "Hubungi",
        apply: "Daftar",
        submit: "Kirim"
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