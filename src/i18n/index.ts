import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
export const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        beranda: "Home",
        destinasi: "Destination",
        museum: "Museum",
        heritage: "Heritage",
        collection: "Collection",
        koleksi: "MCB Collection",
        mow: "Memory Of the World",
        agenda: "Agenda",
        tentangKami: "About Us",
        strukturOrganisasi: "Organizational structure",
        layananKonservasi: "Conservation Laboratory",
        mediaPublikasi: "Media & Publications",
        hubungiKami: "Contact Us",
        career: "Career",
        ppid: "PPID",
        sop: "Standard Operating Procedures",
        pemanfaatanAset: "Asset Utilization",
        // peraturan: "Arrangement",
        admin: "Admin",
        merchandise: "Merchandise"
      },
      // Hero Section
      hero: {
        museum: {
          title: "Preserving Indonesia's Cultural Heritage",
          subtitle: "Directorate of Museums and Cultural Heritage - Managing and preserving national heritage for future generations",
          cta: "Explore Museums"
        },
        collection: {
          title: "Archipelago Historical Collections",
          subtitle: "Storing and exhibiting valuable artifacts from all over Indonesia",
          cta: "View Collections"
        },
        heritage: {
          title: "Indonesian Cultural Heritage",
          subtitle: "Protecting historical sites that are the pride of the nation",
          cta: "Discover Sites"
        },
        watchVideo: "Watch Video",
      },
      // Profile Section
      profile: {
        title: "About Us",
        description: "The Directorate of Museums and Cultural Heritage is responsible for the preservation, management, and development of Indonesia's cultural heritage for education, research, and cultural tourism purposes.",
        vision: "Vision",
        visionText: "To become a leading institution in the preservation and management of world-class and sustainable Indonesian cultural heritage.",
        mission: "Mission",
        missionItems: [
          "Manage and preserve national museum collections",
          "Protect and maintain cultural heritage sites",
          "Develop education and research programs",
          "Promote sustainable cultural tourism"
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
        mainServices: "Main Services",
        museum: {
          title: "Museum",
          description: "Management of collections, exhibitions, and educational programs in museums throughout Indonesia",
          feature1: "Digital collection system",
          feature2: "Regular exhibition programs",
          feature3: "Public education services",
          feature4: "Research and documentation",
          stats: {
            museums: "Museums",
            visitors: "Visitors",
            programs: "Programs"
          }
        },
        heritage: {
          title: "Cultural Heritage",
          description: "Preservation and protection of historical sites and national cultural heritage",
          feature1: "Historical site conservation",
          feature2: "Condition monitoring",
          feature3: "Restoration programs",
          feature4: "Archaeological research",
          stats: {
            sites: "Sites",
            provinces: "Provinces",
            projects: "Projects"
          }
        },
        manage: "Manage",
        viewAgenda: "View Agenda"
      },
      // Distribution Section
      distribution: {
        title: "Distribution of Museums and Cultural Heritage",
        subtitle: "Distribution of museums and cultural heritage sites throughout Indonesia managed by the Directorate of Museums and Cultural Heritage.",
        regions: {
          sumatera: "Sumatra",
          jawa: "Java",
          kalimantan: "Kalimantan",
          sulawesi: "Sulawesi",
          papua: "Papua",
          malukuNusaTenggara: "Maluku & Nusa Tenggara"
        },
        labels: {
          museum: "Museum",
          heritage: "Cultural Heritage"
        },
        legend: {
          title: "Legend",
          museum: "Museum",
          heritage: "Heritage"
        }
      },
      // Agenda Section
      agenda: {
        title: "Agenda & Events",
        subtitle: "Follow exciting activities from museums and cultural heritage sites throughout Indonesia",
        loading: "Loading events...",
        status: {
          upcoming: "Upcoming",
          ongoing: "Ongoing",
          registration: "Registration",
          finished: "Finished"
        },
        button: {
          detail: "Event Detail"
        },
        categories: {
          all: "All Events"
        }
      },
      // Footer translations
      footer: {
        orgName: "Museum and Cultural Heritage",
        ministry: "Ministry of Culture",
        contactUs: "Contact Us",
        address: "Jl. Jenderal Sudirman, Senayan Jakarta Pusat 10270",
        phone: "",
        email: "info@kebudayaan.kemdikbud.go.id",
        quickLinks: "Quick Links",
        socialMedia: "Social Media",
        copyright: "© 2025 Museum and Cultural Heritage. All Rights Reserved.",
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
          title: "Regulations",
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
        description: "The existence of the Information and Documentation Management Officer (PPID) of the Museum and Cultural Heritage is part of the implementation of the mandate of Law Number 14 of 2008 concerning Public Information Disclosure (UU KIP). This unit functions as an extension of the PPID of the Ministry of Culture in providing public information services to the community.",
        exampleInfo: "Example Information:",
        requestCriteria: {
          title: "Public Information Request Criteria"
        },
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
          hoursText: "Mon - Fri: 08:00 - 16:00 WIB"
        },
        commitment: {
          title: "Service Commitment",
          description: "We are committed to providing fast, accurate, and transparent public information services to all Indonesian citizens in accordance with the principles of public information disclosure.",
          stats: {
            response: "Initial Response",
            responseValue: "24 Hours",
            service: "Maximum Service",
            serviceValue: "13 Days",
            transparency: "Transparent",
            transparencyValue: "100%"
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
        freeConsultation: "Free Consultation",
        visitWebsite: "Visit Website",
        buyTicket: "Buy Ticket",
      },
      // Publication Section
      publication: {
        title: "Publication Documents",
        subtitle: "Access official documents, reports, and scientific publications about museum management and cultural heritage preservation.",
        pages: "Pages",
        size: "Size",
        downloadCount: "Downloads",
        downloadButton: "Download Document",
        readMore: "Read More",
        description: "Description"
      },
      // Collection Section
      collection: {
        title: "Masterpiece Collections",
        subtitle: "Discover Indonesia's most precious cultural artifacts",
      },
      // Heritage Section
      heritage: {
        title: "Heritage Sites",
        subtitle: "Discover Indonesia's precious cultural heritage sites",
      },
      // Museum Detail
      museumDetail: {
        about: "About",
        aboutHeritage: "About Heritage",
        facilities: "Facilities",
        galleryCollection: "Gallery Collection",
        visitInformation: "Visit Information",
        location: "Location",
        openingHours: "Opening Hours",
        contact: "Contact",
        ticketPrice: "Ticket Price",
        museum: "Museum",
        heritage: "Heritage Site",
        website: "Website",
      },
      // Filter
      filter: {
        museum: {
          search: "Search museums and heritage sites...",
          categoryAll: "All",
          categoryMuseum: "Museums",
          categoryHeritage: "Heritage Sites",
        },
        pemanfaatanAset: {
          search: "Search asset utilization...",
        },
        collection: {
          search: "Search collections...",
          categoryAll: "All Categories",
          categoryCeramic: "Ceramics",
          categoryEtnograhpy: "Ethnography",
          categoryArcheology: "Archeology",
          categoryHistory: "History",
          categoryNumismatic: "Numismatic & Heraldic",
          categoryPreHistorical: "PreHistorical",
          categoryGeographic: "Geographic",
        },
        heritage: {
          search: "Search heritage sites...",
          categoryAll: "All Types",
          categoryTemple: "Temples",
          categoryArcheological: "Archeological Sites",
          categoryFortress: "Fortresses",
        },
        mow: {
          search: "Search memory of the world...",
          categoryAll: "All Categories",
          categoryCeramic: "Ceramics",
          categoryEtnograhpy: "Ethnography",
          categoryArcheology: "Archeology",
          categoryHistory: "History",
          categoryNumismatic: "Numismatic & Heraldic",
          categoryPreHistorical: "PreHistorical",
          categoryGeographic: "Geographic",
        },
      },
      mow: {
        title: "Memory of the World",
        subtitle: "Uncovering the Memory of the World",
        description: "Journey through the most precious documents and archives that form the collective memory of humanity. Each item offers a window into the pivotal moments and lasting legacies of our past."
      },
      // Map Section
      map: {
        interactiveMap: "Interactive Map",
        clickMarker: "Click a marker for more details",
        addressLabel: "Address:",
        seeDetails: "See Details",
        seeList: "See List"
      },
      // News Section
      news: {
        title: "News & Articles",
        subtitle: "Follow the latest developments about museums, cultural heritage, and cultural heritage preservation activities in Indonesia",
        loading: "Loading news...",
        button: {
          readMore: "Read More",
          viewAll: "View All News"
        }
      },
      // Contact Section
      contact: {
        title: "Contact Us",
        subtitle: "Get in touch with us for any inquiries or assistance",
        infoTitle: "Contact Information",
        socialMedia: "Social Media",
        office: {
          title: "Office Address",
          address1: "Jalan Medan Merdeka Barat No. 12",
          address2: "Jakarta Pusat 10110",
          address3: "Indonesia"
        },
        whatsapp: "WhatsApp",
        email: "Email",
        hours: {
          title: "Working Hours",
          monThu: "Monday - Thursday: 08:00 - 16:00 WIB",
          fri: "Friday: 08:00 - 16:30 WIB",
          weekend: "Saturday - Sunday: Closed"
        },
        form: {
          title: "Send Us a Message",
          subtitle: "We'll get back to you as soon as possible",
          name: "Full Name",
          namePlaceholder: "Enter your full name",
          email: "Email Address",
          emailPlaceholder: "Enter your email address",
          subject: "Subject",
          subjectPlaceholder: "Enter the subject",
          message: "Message",
          messagePlaceholder: "Enter your message",
          submit: "Send Message"
        },
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers to common questions"
        },
        error: {
          title: "Error",
          message: "An error occurred while sending your message. Please try again."
        },
        validation: {
          required: "All fields are required"
        },
        success: {
          title: "Success",
          message: "Your message has been sent successfully. We will get back to you soon."
        }
      },
      // Pemanfaatan Aset Section
      pemanfaatanAset: {
        title: "Asset Utilization",
        subtitle: "Explore available assets for utilization",
        noData: "No asset utilization data found.",
        location: "Location",
        category: "Category",
        area: "Area",
        facilities: "Facilities",
        detail: {
          eventDetail: "Event Detail",
          generalTerms: "General Terms",
          noGeneralTerms: "No general terms",
          rate: "Rate",
          overtimeCost: "Overtime Cost",
          facilities: "Facilities",
          additionalFacilities: "Additional Facilities",
          detail: "Detail",
          capacity: "Capacity",
          size: "Size",
          price: "Price",
          booking: "Booking"
        }
      },
      common: {
        notFound: "Data not found.",
        requestNotFound: "Requested data not found."
      },
      // Merchandise Section
      merchandise: {
        title: "Merchandise Collection",
        subtitle: "Discover various interesting merchandise from our museum. Every purchase supports cultural heritage preservation.",
        searchPlaceholder: "Search products...",
        allCategories: "All Categories",
        sortBy: "Sort By",
        sortByName: "Name A-Z",
        sortByPriceLow: "Price Low to High",
        sortByPriceHigh: "Price High to Low",
        noResults: "No products match your filter.",
        noProducts: "No merchandise products available yet.",
        resetFilter: "Reset Filter",
        viewDetails: "View Details",
        buy: "Buy",
        buyNow: "Buy Now",
        backToMerchandise: "Back to Merchandise",
        productNotFound: "Product Not Found",
        productNotFoundMessage: "The product you are looking for was not found or is unavailable.",
        productInfo: "Product Information",
        description: "Description",
        category: "Category",
        status: "Status",
        available: "Available",
        awaitingApproval: "Awaiting Approval",
        contactSeller: "Contact Seller",
        contactSellerMessage: "For more information or questions about this product, please contact via WhatsApp at {{number}}",
        purchaseInfo: "Purchase Information",
        purchaseInfoItem1: "This product can be purchased directly via WhatsApp",
        purchaseInfoItem2: "Make sure to ask for stock availability before ordering",
        purchaseInfoItem3: "Shipping and payment information will be discussed directly with the seller",
        purchaseInfoItem4: "Original and quality products from our museum",
        showingResults: "Showing {{count}} of {{total}} products",
        noCategory: "No category"
      },
      // Organizational Structure
      organizationalStructure: {
        title: "Organizational Structure",
        description: "Get to know the team behind the Museum and Cultural Heritage.",
        viewProfile: "View Profile",
        employeeDetail: "Employee Detail",
        born: "Born",
        education: "Education History",
        career: "Career History",
        degree: "Degree",
        institution: "Institution",
        year: "Year",
        role: "Role",
        company: "Company",
        duration: "Duration",
        addEmployee: "Add Employee",
        editEmployee: "Edit Employee",
        name: "Name",
        level: "Level",
        order: "Order",
        birthDate: "Date of Birth",
        photo: "Photo",
        fetchError: "Failed to fetch employees",
        createSuccess: "Employee created successfully",
        updateSuccess: "Employee updated successfully",
        saveError: "Failed to save employee",
        deleteSuccess: "Employee deleted successfully",
        deleteError: "Failed to delete employee"
      },
      // Internship Section
      internship: {
        title: "Internship Program",
        description: "Join our internship program and gain valuable experience in the field of Indonesian cultural heritage preservation.",
        benefitsTitle: "Internship Program Benefits",
        benefit1: "Official certificate from the Ministry of Education and Culture",
        benefit2: "Work experience in a government institution",
        benefit3: "Mentoring from experienced experts",
        benefit4: "Networking with professionals in the cultural heritage field",
        benefit5: "Access to museum collections and facilities",
        benefit6: "Possibility of research publication",
        processTitle: "Registration Process",
        processSubtitle: "Follow these steps to register",
        step1Title: "Document Preparation",
        step1Desc: "CV, transcripts, cover letter, and proposal (if any)",
        step2Title: "Online Submission",
        step2Desc: "Submit application via online form or email",
        step3Title: "Administrative Selection",
        step3Desc: "Document review and requirement verification",
        step4Title: "Interview",
        step4Desc: "Interview with the team and program mentor",
        step5Title: "Result Announcement",
        step5Desc: "Acceptance notification and program orientation",
        startRegistration: "Start Registration",
        formTitle: "Internship Registration Form",
        nameLabel: "Full Name *",
        namePlaceholder: "Enter full name",
        emailLabel: "Email *",
        phoneLabel: "Phone Number *",
        universityLabel: "School / University *",
        universityPlaceholder: "School / University Name",
        majorLabel: "Study Program *",
        majorPlaceholder: "Major",
        semesterLabel: "Semester *",
        gpaLabel: "GPA",
        programLabel: "Internship Program *",
        selectProgram: "Select internship program",
        motivationLabel: "Motivation & Goals *",
        motivationPlaceholder: "Explain your motivation and goals for joining this internship program...",
        docsTitle: "Required Documents",
        cvLabel: "CV/Resume *",
        cvDesc: "Upload CV in PDF format (max 10MB)",
        transcriptLabel: "Academic Transcript *",
        transcriptDesc: "Upload transcript in PDF format (max 10MB)",
        coverLetterLabel: "Cover Letter (Optional)",
        coverLetterDesc: "Upload cover letter in PDF format (max 10MB)",
        cancel: "Cancel",
        submit: "Submit Application",
        successTitle: "Registration Successful!",
        successDesc: "Your internship application has been sent. Our team will contact you within 1-2 weeks.",
        errorTitle: "Error",
        errorDesc: "Failed to send application. Please try again.",
        invalidProgram: "Invalid internship program.",
        invalidUrl: "Invalid or unsafe document URL.",
        uploadErrorCV: "Failed to upload CV",
        uploadErrorTranscript: "Failed to upload transcript",
        uploadErrorCoverLetter: "Failed to upload cover letter",
        positions: "positions",
        period: "Period",
        requirements: "Requirements",
        benefits: "Benefits",
        responsibilities: "Responsibilities",
        supervisor: "Supervisor",
        deadline: "Deadline",
        apply: "Apply",
        questionsTitle: "Have Questions?",
        questionsDesc: "Our HR team is ready to help you with more information about the internship program and registration process.",
        officeLocation: "Office Location",
        contactHR: "Contact HR",
        validation: {
          nameMin: "Full name must be at least 2 characters",
          nameMax: "Full name must be at most 100 characters",
          nameInvalid: "Name cannot contain dangerous characters",
          emailInvalid: "Invalid email",
          emailMax: "Email must be at most 150 characters",
          phoneMin: "Phone number must be at least 10 digits",
          phoneMax: "Phone number must be at most 20 digits",
          phoneInvalid: "Phone number can only contain numbers, +, -, and spaces",
          universityMin: "School / University name is required",
          universityMax: "University name must be at most 200 characters",
          universityInvalid: "Invalid university name",
          majorMin: "Study program is required",
          majorMax: "Study program must be at most 100 characters",
          majorInvalid: "Invalid study program",
          semesterMin: "Semester is required",
          semesterMax: "Semester must be at most 2 digits",
          semesterInvalid: "Semester must be a number",
          gpaInvalid: "GPA must be a number or decimal",
          gpaRange: "GPA must be between 0 and 4.0",
          programRequired: "Internship program must be selected",
          programInvalid: "Invalid internship program ID",
          motivationMin: "Motivation must be at least 50 characters",
          motivationMax: "Motivation must be at most 2000 characters",
          motivationInvalid: "Motivation contains dangerous content",
          cvUrl: "Invalid CV URL",
          cvRequired: "CV must be uploaded",
          cvPdf: "CV file must be a valid PDF",
          transcriptUrl: "Invalid transcript URL",
          transcriptRequired: "Transcript must be uploaded",
          transcriptPdf: "Transcript file must be a valid PDF",
          coverLetterPdf: "Cover letter file must be a valid PDF"
        }
      }
    }
  },
  id: {
    translation: {
      // Navigation
      nav: {
        beranda: "Beranda",
        destinasi: "Destinasi",
        museum: "Museum",
        heritage: "Cagar Budaya",
        collection: "Koleksi",
        koleksi: "Koleksi MCB",
        mow: "Memori Dunia",
        agenda: "Agenda", 
        tentangKami: "Tentang Kami",
        strukturOrganisasi: "Struktur Organisasi",
        layananKonservasi: "Laboratorium Konservasi",
        mediaPublikasi: "Berita & Publikasi",
        hubungiKami: "Hubungi Kami",
        career: "Karir",
        ppid: "PPID",
        sop: "Prosedur Operasional Standar",
        pemanfaatanAset: "Pemanfaatan Aset",
        // peraturan: "Peraturan",
        admin: "Admin",
        merchandise: "Merchandise"
      },
      // Pemanfaatan Aset Section
      pemanfaatanAset: {
        title: "Pemanfaatan Aset",
        subtitle: "Jelajahi aset yang tersedia untuk dimanfaatkan",
        noData: "Data pemanfaatan aset untuk disewakan tidak ditemukan.",
        location: "Lokasi",
        category: "Kategori",
        area: "Area",
        facilities: "Fasilitas",
        detail: {
          eventDetail: "Detail Acara",
          generalTerms: "Ketentuan Umum",
          noGeneralTerms: "Tidak ada ketentuan umum",
          rate: "Tarif",
          overtimeCost: "Biaya Overtime",
          facilities: "Fasilitas",
          additionalFacilities: "Fasilitas Tambahan",
          detail: "Detail",
          capacity: "Kapasitas",
          size: "Ukuran",
          price: "Harga",
          booking: "Booking"
        }
      },
      // Hero Section
      hero: {
        museum: {
          title: "Melestarikan Warisan Budaya Indonesia",
          subtitle: "Direktorat Museum dan Cagar Budaya - Mengelola dan melestarikan warisan nasional untuk generasi mendatang",
          cta: "Jelajahi Museum"
        },
        collection: {
          title: 'Koleksi Bersejarah Nusantara',
          subtitle: 'Menyimpan dan memamerkan artifak berharga dari seluruh Indonesia',
          cta: 'Lihat Koleksi',
        },
        heritage: {
          title: 'Cagar Budaya Indonesia',
          subtitle: 'Melindungi situs-situs bersejarah yang menjadi kebanggaan bangsa',
          cta: 'Temukan Situs',
        },
        watchVideo: "Tonton Video",
      },
      // Profile Section
      profile: {
        title: "Tentang Kami",
        description: "Museum dan Cagar Budaya merupakan Badan Layanan Umum (BLU) di bawah naungan Kementerian Kebudayaan Republik Indonesia yang saat ini bertanggung jawab atas pengelolaan 19 museum dan galeri serta 34 situs cagar budaya nasional di Indonesia. Terbentuk pada tahun 2022 dan diresmikan menjadi BLU per tanggal 1 September 2023. Museum dan Cagar Budaya memiliki visi untuk menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.",
        vision: "Visi",
        visionText: "“Menjadi ruang jelajah warisan budaya dan sejarah yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan karakter yang berbudaya.”",
        mission: "Misi",
        missionItems: [
          "Mewujudkan pengelolaan koleksi, cagar budaya, dan bangunan bersejarah yang berkelanjutan.",
          "Melaksanakan upaya pelayanan dan pelibatan masyarakat secara terpadu.", 
          "Mengedepankan transformasi pengembangan wawasan melalui praktik edukasi yang inovatif dan pembangunan komunitas.",
          "Menjalin kepercayaan kuat antara para pemangku kepentingan yang berbasis kemitraan.",
          "Mewujudkan ruang ekspresi dan interaksi budaya yang inklusif dan mudah diakses.",
          "Mewujudkan tata kelola kelembagaan dan pengelolaan sumber daya manusia yang tangkas dan berorientasi kepada dampak yang berkelanjutan."
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
        mainServices: "Layanan Utama",
        museum: {
          title: "Museum",
          description: "Pengelolaan koleksi, pameran, dan program edukasi di seluruh museum Indonesia",
          feature1: "Sistem koleksi digital",
          feature2: "Program pameran berkala",
          feature3: "Layanan edukasi publik",
          feature4: "Penelitian dan dokumentasi",
          stats: {
            museums: "Museum",
            visitors: "Pengunjung",
            programs: "Program"
          }
        },
        heritage: {
          title: "Cagar Budaya",
          description: "Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional",
          feature1: "Konservasi situs bersejarah",
          feature2: "Monitoring kondisi",
          feature3: "Program restorasi",
          feature4: "Penelitian arkeologi",
          stats: {
            sites: "Situs",
            provinces: "Provinsi",
            projects: "Proyek"
          }
        },
        manage: "Kelola",
        viewAgenda: "Lihat Agenda"
      },
      // Distribution Section
      distribution: {
        title: "Sebaran Museum dan Cagar Budaya",
        subtitle: "Distribusi museum dan situs cagar budaya di seluruh Indonesia yang dikelola oleh Direktorat Museum dan Cagar Budaya.",
        regions: {
          sumatera: "Sumatera",
          jawa: "Jawa",
          kalimantan: "Kalimantan",
          sulawesi: "Sulawesi",
          papua: "Papua",
          malukuNusaTenggara: "Maluku & Nusa Tenggara"
        },
        labels: {
          museum: "Museum",
          heritage: "Cagar Budaya"
        },
        legend: {
          title: "Legenda",
          museum: "Museum",
          heritage: "Cagar Budaya"
        }
      },
      // Agenda Section
      agenda: {
        title: "Agenda",
        subtitle: "Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia",
        loading: "Memuat acara...",
        status: {
          upcoming: "Akan Datang",
          ongoing: "Berlangsung",
          registration: "Pendaftaran",
          finished: "Selesai"
        },
        button: {
          detail: "Detail Acara"
        },
        categories: {
          all: "Semua Acara"
        }
      },
      // Footer translations
      footer: {
        orgName: "Museum dan Cagar Budaya",
        ministry: "Kementerian Kebudayaan",
        contactUs: "Hubungi Kami",
        address: "Jalan Medan Merdeka Barat No. 12 Jakarta Pusat 10110",
        phone: "",
        email: "museumcb@kemenbud.go.id ",
        quickLinks: "Tautan Cepat",
        socialMedia: "Media Sosial",
        copyright: "© 2025 Museum dan Cagar Budaya. Hak Cipta Dilindungi.",
        privacy: "Kebijakan Privasi",
        terms: "Syarat & Ketentuan",
        sitemap: "Peta Situs"
      },
      // About Us sections
      about: {
        companyProfile: {
          title: "Museum dan Cagar Budaya",
          subtitle: "Merupakan unit eselon II di bawah Direktorat Jenderal Kebudayaan, Kementerian Kebudayaan Republik Indonesia.",
          historyTitle: "Sejarah & Perkembangan",
          historyText1: "Didirikan dengan tujuan untuk mengelola, melestarikan, dan mengembangkan museum serta situs cagar budaya di seluruh Indonesia. Sejak berdiri, kami telah berperan aktif dalam pelestarian warisan budaya bangsa.",
          historyText2: "Terbentuk pada tahun 2022 berdasarkan Permendikbudristek Nomor 28 Tahun 2022 tentang OTK Museum dan Cagar Budaya, dan diresmikan menjadi badan layanan umum per 1 September 2023, Museum dan Cagar Budaya mempunyai visi menjadi institusi yang bersifat kolaboratif dan mendorong daya cipta, perubahan sosial, serta pembangunan masyarakat yang berbudaya.",
          commitmentTitle: "Komitmen Kami",
          commitmentText: "Museum dan Cagar Budaya mengedepankan peningkatan pelayanan yang berbasis perlindungan sebagai prioritas utama. Dengan merangkul kreativitas dan mengusung semangat kolaborasi yang inklusif. Museum dan Cagar Budaya secara kolektif berkontribusi untuk membuka wawasan apresiasi mendalam terhadap warisan budaya Indonesia yang beragam.",
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
            title: "Pengelolaan Museum dan Cagar Budaya",
            description: "Pengelolaan komprehensif koleksi Museum dan Cagar Budaya, operasional, dan layanan publik",
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
          title: "Regulasi",
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
        title: "PPID Museum dan Cagar Budaya - Pejabat Pengelola Informasi dan Dokumentasi",
        subtitle: "Pelayanan informasi publik yang transparan dan akuntabel sesuai dengan Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
        description: "Keberadaan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Museum dan Cagar Budaya merupakan bagian dari pelaksanaan amanat Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik (UU KIP). Unit ini berfungsi sebagai perpanjangan tangan PPID Kementerian Kebudayaan dalam memberikan layanan informasi publik kepada masyarakat.",
        exampleInfo: "Contoh Informasi:",
        requestCriteria: {
          title: "Ketentuan Permohonan Layanan Informasi Publik"
        },
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
            responseValue: "24 Jam",
            service: "Maksimal Layanan",
            serviceValue: "13 Hari",
            transparency: "Transparan",
            transparencyValue: "100%"
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
        freeConsultation: "Konsultasi Gratis",
        visitWebsite: "Kunjungi Situs",
        buyTicket: "Beli Tiket",
      },
      // Publication Section
      publication: {
        title: "Dokumen Publikasi",
        subtitle: "Akses dokumen resmi, laporan, dan publikasi ilmiah tentang pengelolaan museum dan pelestarian cagar budaya.",
        pages: "Halaman",
        size: "Ukuran",
        downloadCount: "Download",
        downloadButton: "Unduh Dokumen",
        readMore: "Baca Selengkapnya",
        description: "Deskripsi"
      },
      // Collection Section
      collection: {
        title: "Koleksi Mahakarya",
        subtitle: "Temukan artefak budaya Indonesia yang paling berharga",
      },
      // Heritage Section
      heritage: {
        title: "Cagar Budaya",
        subtitle: "Temukan situs warisan budaya Indonesia yang berharga",
      },
      // Museum Detail
      museumDetail: {
        about: "Tentang Museum",
        aboutHeritage: "Tentang Cagar Budaya",
        facilities: "Fasilitas",
        galleryCollection: "Koleksi Galeri",
        visitInformation: "Informasi Kunjungan",
        location: "Lokasi",
        openingHours: "Jam Buka",
        contact: "Kontak",
        ticketPrice: "Harga Tiket",
        museum: "Museum",
        heritage: "Cagar Budaya",
        website: "Situs Web",
      },
      // Filter
      filter: {
        museum: {
          search: "Cari Museum dan Cagar Budaya...",
          categoryAll: "Semua",
          categoryMuseum: "Museum",
          categoryHeritage: "Cagar Budaya",
        },
        pemanfaatanAset: {
          search: "Cari pemanfaatan aset...",
        },
        collection: {
          search: "Cari Koleksi...",
          categoryAll: "Semua Kategori",
          categoryCeramic: "Keramik",
          categoryEtnograhpy: "Etnografi",
          categoryArcheology: "Arkeologi",
          categoryHistory: "Sejarah",
          categoryNumismatic: "Numismatik & Heraldik",
          categoryPreHistorical: "PraSejarah",
          categoryGeographic: "Geographic",
        },
        heritage: {
          search: "Cari Situs Warisan...",
          categoryAll: "Semua Tipe",
          categoryTemple: "Candi",
          categoryArcheological: "Situs Arkeologi",
          categoryFortress: "Benteng"
        },
        mow: {
          search: "Cari memori dunia...",
          categoryAll: "Semua Kategori",
          categoryCeramic: "Keramik",
          categoryEtnograhpy: "Etnografi",
          categoryArcheology: "Arkeologi",
          categoryHistory: "Sejarah",
          categoryNumismatic: "Numismatik & Heraldik",
          categoryPreHistorical: "PraSejarah",
          categoryGeographic: "Geographic",
        },
      },
      mow: {
        title: "Memori Dunia",
        subtitle: "Mengungkap Memori Dunia",
        description: "Telusuri dokumen dan arsip paling berharga yang membentuk memori kolektif umat manusia. Setiap item menawarkan jendela ke momen-momen penting dan warisan abadi masa lalu kita."
      },
      // Map Section
      map: {
        interactiveMap: "Peta Interaktif",
        clickMarker: "Klik penanda untuk detail lebih lanjut",
        addressLabel: "Alamat:",
        seeDetails: "Lihat Detail",
        seeList: "Lihat Daftar"
      },
      // News Section
      news: {
        title: "Berita & Artikel",
        subtitle: "Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian warisan budaya Indonesia",
        loading: "Memuat berita...",
        button: {
          readMore: "Baca Selengkapnya",
          viewAll: "Lihat Semua Berita"
        }
      },
      // Contact Section
      contact: {
        title: "Hubungi Kami",
        subtitle: "Hubungi kami untuk pertanyaan atau bantuan apapun",
        infoTitle: "Informasi Kontak",
        socialMedia: "Media Sosial",
        office: {
          title: "Alamat Kantor",
          address1: "Jalan Medan Merdeka Barat No. 12",
          address2: "Jakarta Pusat 10110",
          address3: "Indonesia"
        },
        whatsapp: "WhatsApp",
        email: "Email",
        hours: {
          title: "Jam Kerja",
          monThu: "Senin - Kamis: 08:00 - 16:00 WIB",
          fri: "Jumat: 08:00 - 16:30 WIB",
          weekend: "Sabtu - Minggu: Tutup"
        },
        form: {
          title: "Kirim Pesan",
          subtitle: "Kami akan membalas pesan Anda secepatnya",
          name: "Nama Lengkap",
          namePlaceholder: "Masukkan nama lengkap Anda",
          email: "Alamat Email",
          emailPlaceholder: "Masukkan alamat email Anda",
          subject: "Subjek",
          subjectPlaceholder: "Masukkan subjek pesan",
          message: "Pesan",
          messagePlaceholder: "Masukkan pesan Anda",
          submit: "Kirim Pesan"
        },
        faq: {
          title: "Pertanyaan yang Sering Diajukan",
          subtitle: "Temukan jawaban untuk pertanyaan umum"
        },
        error: {
          title: "Kesalahan",
          message: "Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi."
        },
        validation: {
          required: "Semua bidang wajib diisi"
        },
        success: {
          title: "Berhasil",
          message: "Pesan Anda telah berhasil dikirim. Kami akan membalas segera."
        }
      },
      // Merchandise Section
      merchandise: {
        title: "Koleksi Merchandise",
        subtitle: "Temukan berbagai merchandise menarik dari museum kami. Setiap pembelian mendukung pelestarian warisan budaya.",
        searchPlaceholder: "Cari produk...",
        allCategories: "Semua Kategori",
        sortBy: "Urutkan",
        sortByName: "Nama A-Z",
        sortByPriceLow: "Harga Terendah",
        sortByPriceHigh: "Harga Tertinggi",
        noResults: "Tidak ada produk yang sesuai dengan filter Anda.",
        noProducts: "Belum ada produk merchandise yang tersedia.",
        resetFilter: "Reset Filter",
        viewDetails: "Lihat Detail",
        buy: "Beli",
        buyNow: "Beli Sekarang",
        backToMerchandise: "Kembali ke Merchandise",
        productNotFound: "Produk Tidak Ditemukan",
        productNotFoundMessage: "Produk yang Anda cari tidak ditemukan atau tidak tersedia.",
        productInfo: "Informasi Produk",
        description: "Deskripsi",
        category: "Kategori",
        status: "Status",
        available: "Tersedia",
        awaitingApproval: "Menunggu Persetujuan",
        contactSeller: "Hubungi Penjual",
        contactSellerMessage: "Untuk informasi lebih lanjut atau pertanyaan tentang produk ini, silakan hubungi melalui WhatsApp di nomor {{number}}",
        purchaseInfo: "Informasi Pembelian",
        purchaseInfoItem1: "Produk ini dapat dibeli langsung melalui WhatsApp",
        purchaseInfoItem2: "Pastikan untuk menanyakan ketersediaan stok sebelum memesan",
        purchaseInfoItem3: "Informasi pengiriman dan pembayaran akan dibahas langsung dengan penjual",
        purchaseInfoItem4: "Produk asli dan berkualitas dari museum kami",
        showingResults: "Menampilkan {{count}} dari {{total}} produk",
        noCategory: "Tidak ada kategori"
      },
      // Organizational Structure
      organizationalStructure: {
        title: "Struktur Organisasi",
        description: "Kenali tim di balik Museum dan Cagar Budaya.",
        viewProfile: "Lihat Profil",
        employeeDetail: "Detail Pegawai",
        born: "Lahir",
        education: "Riwayat Pendidikan",
        career: "Riwayat Karir",
        degree: "Gelar",
        institution: "Institusi",
        year: "Tahun",
        role: "Peran",
        company: "Perusahaan",
        duration: "Durasi",
        addEmployee: "Tambah Pegawai",
        editEmployee: "Edit Pegawai",
        name: "Nama",
        level: "Level",
        order: "Urutan",
        birthDate: "Tanggal Lahir",
        photo: "Foto",
        fetchError: "Gagal mengambil data pegawai",
        createSuccess: "Pegawai berhasil dibuat",
        updateSuccess: "Pegawai berhasil diperbarui",
        saveError: "Gagal menyimpan pegawai",
        deleteSuccess: "Pegawai berhasil dihapus",
        deleteError: "Gagal menghapus pegawai"
      },
      // Internship Section
      internship: {
        title: "Program Magang",
        description: "Bergabunglah dengan program magang kami dan dapatkan pengalaman berharga dalam bidang pelestarian warisan budaya Indonesia.",
        benefitsTitle: "Manfaat Program Magang",
        benefit1: "Sertifikat resmi dari Kementerian Pendidikan dan Kebudayaan",
        benefit2: "Pengalaman kerja di lembaga pemerintah",
        benefit3: "Mentoring dari ahli berpengalaman",
        benefit4: "Networking dengan profesional di bidang warisan budaya",
        benefit5: "Akses ke koleksi dan fasilitas museum",
        benefit6: "Kemungkinan publikasi hasil penelitian",
        processTitle: "Proses Pendaftaran",
        processSubtitle: "Ikuti langkah-langkah berikut untuk mendaftar",
        step1Title: "Persiapan Dokumen",
        step1Desc: "CV, transkrip nilai, surat pengantar, dan proposal (jika ada)",
        step2Title: "Pengajuan Online",
        step2Desc: "Submit aplikasi melalui form online atau email",
        step3Title: "Seleksi Administrasi",
        step3Desc: "Review dokumen dan verifikasi persyaratan",
        step4Title: "Wawancara",
        step4Desc: "Interview dengan tim dan mentor program",
        step5Title: "Pengumuman Hasil",
        step5Desc: "Notifikasi penerimaan dan orientasi program",
        startRegistration: "Mulai Pendaftaran",
        formTitle: "Formulir Pendaftaran Magang",
        nameLabel: "Nama Lengkap *",
        namePlaceholder: "Masukkan nama lengkap",
        emailLabel: "Email *",
        phoneLabel: "Nomor Telepon *",
        universityLabel: "Sekolah / Universitas *",
        universityPlaceholder: "Nama Sekolah / Universitas",
        majorLabel: "Program Studi *",
        majorPlaceholder: "Jurusan",
        semesterLabel: "Semester *",
        gpaLabel: "IPK",
        programLabel: "Program Magang *",
        selectProgram: "Pilih program magang",
        motivationLabel: "Motivasi & Tujuan *",
        motivationPlaceholder: "Jelaskan motivasi dan tujuan Anda mengikuti program magang ini...",
        docsTitle: "Dokumen yang Diperlukan",
        cvLabel: "CV/Resume *",
        cvDesc: "Upload CV dalam format PDF (maksimal 10MB)",
        transcriptLabel: "Transkrip Nilai *",
        transcriptDesc: "Upload transkrip dalam format PDF (maksimal 10MB)",
        coverLetterLabel: "Surat Pengantar (Opsional)",
        coverLetterDesc: "Upload surat pengantar dalam format PDF (maksimal 10MB)",
        cancel: "Batal",
        submit: "Kirim Aplikasi",
        successTitle: "Pendaftaran Berhasil!",
        successDesc: "Aplikasi magang Anda telah dikirim. Tim kami akan menghubungi Anda dalam 1-2 minggu.",
        errorTitle: "Error",
        errorDesc: "Gagal mengirim aplikasi. Silakan coba lagi.",
        invalidProgram: "Program magang tidak valid.",
        invalidUrl: "URL dokumen tidak valid atau tidak aman.",
        uploadErrorCV: "Gagal upload CV",
        uploadErrorTranscript: "Gagal upload transkrip",
        uploadErrorCoverLetter: "Gagal upload surat pengantar",
        positions: "posisi",
        period: "Periode",
        requirements: "Persyaratan",
        benefits: "Benefit",
        responsibilities: "Tanggung Jawab",
        supervisor: "Supervisor",
        deadline: "Deadline",
        apply: "Daftar",
        questionsTitle: "Ada Pertanyaan?",
        questionsDesc: "Tim HR kami siap membantu Anda dengan informasi lebih lanjut tentang program magang dan proses pendaftaran.",
        officeLocation: "Lokasi Kantor",
        contactHR: "Hubungi HR",
        validation: {
          nameMin: "Nama lengkap minimal 2 karakter",
          nameMax: "Nama lengkap maksimal 100 karakter",
          nameInvalid: "Nama tidak boleh mengandung karakter berbahaya",
          emailInvalid: "Email tidak valid",
          emailMax: "Email maksimal 150 karakter",
          phoneMin: "Nomor telepon minimal 10 digit",
          phoneMax: "Nomor telepon maksimal 20 digit",
          phoneInvalid: "Nomor telepon hanya boleh berisi angka, +, -, dan spasi",
          universityMin: "Nama Sekolah / Universitas harus diisi",
          universityMax: "Nama universitas maksimal 200 karakter",
          universityInvalid: "Nama universitas tidak valid",
          majorMin: "Program studi harus diisi",
          majorMax: "Program studi maksimal 100 karakter",
          majorInvalid: "Program studi tidak valid",
          semesterMin: "Semester harus diisi",
          semesterMax: "Semester maksimal 2 digit",
          semesterInvalid: "Semester harus berupa angka",
          gpaInvalid: "IPK harus berupa angka atau desimal",
          gpaRange: "IPK harus antara 0 dan 4.0",
          programRequired: "Program magang harus dipilih",
          programInvalid: "ID program magang tidak valid",
          motivationMin: "Motivasi minimal 50 karakter",
          motivationMax: "Motivasi maksimal 2000 karakter",
          motivationInvalid: "Motivasi mengandung konten berbahaya",
          cvUrl: "URL CV tidak valid",
          cvRequired: "CV harus diupload",
          cvPdf: "File CV harus berupa PDF yang valid",
          transcriptUrl: "URL transkrip tidak valid",
          transcriptRequired: "Transkrip harus diupload",
          transcriptPdf: "File transkrip harus berupa PDF yang valid",
          coverLetterPdf: "File surat pengantar harus berupa PDF yang valid"
        }
      }
    }
  },
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
