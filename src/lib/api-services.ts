import { apiClient } from './api-client';
import { logWarn } from '@/utils/logger';

export const authService = {
  changePassword: (data: { new_password: string; confirm_password: string }) =>
    apiClient.changePassword(data),
};

// Hero Slides
export const heroSlideService = {
  getAll: () => apiClient.getAll('hero_slides'),
  getById: (id: string) => apiClient.getById('hero_slides', id),
  create: (data: any) => apiClient.create('hero_slides', data),
  update: (id: string, data: any) => apiClient.update('hero_slides', id, data),
  delete: (id: string) => apiClient.delete('hero_slides', id),
}
// Hero Videos
export const heroVideoService = {
  getAll: () => apiClient.getAll('hero_videos'),
  getById: (id: string) => apiClient.getById('hero_videos', id),
  create: (data: any) => apiClient.create('hero_videos', data),
  update: (id: string, data: any) => apiClient.update('hero_videos', id, data),
  delete: (id: string) => apiClient.delete('hero_videos', id),
}
// Collections
export const collectionService = {
  getAll: () => apiClient.getAll('collections'),
  getById: (id: string) => apiClient.getById('collections', id),
  create: (data: any) => apiClient.create('collections', data),
  update: (id: string, data: any) => apiClient.update('collections', id, data),
  delete: (id: string) => apiClient.delete('collections', id),
}
// Heritage Sites (Cagar Budaya)
export const heritageService = {
  approve: (id: string) => apiClient.approve('tb_sites', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_sites', id, reason),
  // For admin: get all heritage sites without any filtering
  getAll: (params?: any) => apiClient.getAll('tb_sites', params),
  // For public frontend: only get approved heritage sites (filtered by heritage type)
  getPublished: () => apiClient.getAll('tb_sites', { 
    is_approved: 'true', 
    is_active: 'true',
    type: 'cb368bd8-22cb-40f9-ae73-0990cad6e4d0' // Cagar Budaya type ID
  }),
  getById: (id: string) => apiClient.getById('tb_sites', id),
  create: (data: any) => apiClient.create('tb_sites', data),
  update: (id: string, data: any) => apiClient.update('tb_sites', id, data),
  delete: (id: string) => apiClient.delete('tb_sites', id),
}
// News Articles
export const newsService = {
  getAll: () => apiClient.getAll('news_articles', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('news_articles', id),
  create: (data: any) => apiClient.create('news_articles', data),
  update: (id: string, data: any) => apiClient.update('news_articles', id, data),
  delete: (id: string) => apiClient.delete('news_articles', id),
};

// Agenda Items
export const agendaService = {
  getAll: (params?: Record<string, any>) => apiClient.getAll('agenda_items', params),
  getPublished: () => apiClient.getAll('agenda_items', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('agenda_items', id),
  create: (data: any) => apiClient.create('agenda_items', data),
  update: (id: string, data: any) => apiClient.update('agenda_items', id, data),
  delete: (id: string) => apiClient.delete('agenda_items', id),
};

// Museums
export const museumService = {
  approve: (id: string) => apiClient.approve('tb_sites', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_sites', id, reason),
  // For admin: get all museums without any filtering
  getAll: (params?: any) => apiClient.getAll('tb_sites', params),
  // For public frontend: only get approved museums (filtered by museum type)
  getPublished: () => apiClient.getAll('tb_sites', { 
    is_approved: 'true', 
    is_active: 'true',
    type: '12bc00a9-ba1a-4562-940d-4e33bb26acdc' // Museum type ID
  }),
  getById: (id: string) => apiClient.getById('tb_sites', id),
  create: (data: any) => apiClient.create('tb_sites', data),
  update: (id: string, data: any) => apiClient.update('tb_sites', id, data),
  delete: (id: string) => apiClient.delete('tb_sites', id),
};

export const TypesAndCategoriesSites = {
  getAllTypes: () => apiClient.getAll('tb_type_sites'),
  getAllCategories: (id : string) => apiClient.getAll('tb_categories_sites', {type_id: id}),
};

export const TypesAndCategoriesEvent = {
  getAllCategories: () => apiClient.getAll('tb_categories_event'),
};

// Banners
export const bannerService = {
  approve: (id: string) => apiClient.approve('tb_banner', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_banner', id, reason),
  getAll: () => apiClient.getAll('tb_banner'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('tb_banner'),
  getById: (id: string) => apiClient.getById('tb_banner', id),
  create: (data: any) => apiClient.create('tb_banner', data),
  update: (id: string, data: any) => apiClient.update('tb_banner', id, data),
  delete: (id: string) => apiClient.delete('tb_banner', id),
};

export const EventsService = {
  approve: (id: string) => apiClient.approve('tb_events', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_events', id, reason),
  getAll: () => apiClient.getAll('tb_events'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('tb_events'),
  getById: (id: string) => apiClient.getById('tb_events', id),
  create: (data: any) => apiClient.create('tb_events', data),
  update: (id: string, data: any) => apiClient.update('tb_events', id, data),
  delete: (id: string) => apiClient.delete('tb_events', id),
};

// Career Opportunities
export const careerService = {
  getAll: () => apiClient.getAll('career_opportunities'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('career_opportunities'),
  getById: (id: string) => apiClient.getById('career_opportunities', id),
  create: (data: any) => apiClient.create('career_opportunities', data),
  update: (id: string, data: any) => apiClient.update('career_opportunities', id, data),
  delete: (id: string) => apiClient.delete('career_opportunities', id),
  applyToOpportunity: (data: any) => apiClient.create('career_applications/public', data),
};

// Media Items
export const mediaService = {
  getAll: () => apiClient.getAll('tb_media'),
  getById: (id: string) => apiClient.getById('tb_media', id),
  create: (data: any) => apiClient.create('tb_media', data),
  update: (id: string, data: any) => apiClient.update('tb_media', id, data),
  delete: (id: string) => apiClient.delete('tb_media', id),
  approve: (id: string) => apiClient.approve('tb_media', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_media', id, reason),
  upload: (file: File) => apiClient.uploadFile(file, 'media'),
};

// Publications
export const publicationService = {
  getAll: () => apiClient.getAll('tb_publication'),
  getById: (id: string) => apiClient.getById('tb_publication', id),
  create: (data: any) => apiClient.create('tb_publication', data),
  update: (id: string, data: any) => apiClient.update('tb_publication', id, data),
  delete: (id: string) => apiClient.delete('tb_publication', id),
  approve: (id: string) => apiClient.approve('tb_publication', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_publication', id, reason),
};

// Memory of The World
export const memoryWorldService = {
  getAll: () => apiClient.getAll('tb_memoryoftheworld'),
  getById: (id: string) => apiClient.getById('tb_memoryoftheworld', id),
  create: (data: any) => apiClient.create('tb_memoryoftheworld', data),
  update: (id: string, data: any) => apiClient.update('tb_memoryoftheworld', id, data),
  delete: (id: string) => apiClient.delete('tb_memoryoftheworld', id),
  approve: (id: string) => apiClient.approve('tb_memoryoftheworld', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_memoryoftheworld', id, reason),
};

export const pemanfaatanAssetService = {
  approve: (id: string) => apiClient.approve('tb_pemanfaatanasset', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_pemanfaatanasset', id, reason),
  getAll: () => apiClient.getAll('tb_pemanfaatanasset'),
  getById: (id: string) => apiClient.getById('tb_pemanfaatanasset', id),
  create: (data: any) => apiClient.create('tb_pemanfaatanasset', data),
  update: (id: string, data: any) => apiClient.update('tb_pemanfaatanasset', id, data),
  delete: (id: string) => apiClient.delete('tb_pemanfaatanasset', id),
};

export const pemanfaatanAssetCategories = {
  getAreas: () => apiClient.getAll('tb_categories_layananaset_area'),
  getFacilities: () => apiClient.getAll('tb_categories_layananaset_fasilitas'),
};

export const collectionCategoryService = {
  getAll: () => apiClient.getAll('tb_categories_collections'),
};

// FAQs
export const faqService = {
  getAll: () => apiClient.getAll('tb_faqs'),
  getById: (id: string) => apiClient.getById('tb_faqs', id),
  create: (data: any) => apiClient.create('tb_faqs', data),
  update: (id: string, data: any) => apiClient.update('tb_faqs', id, data),
  delete: (id: string) => apiClient.delete('tb_faqs', id),
  approve: (id: string) => apiClient.approve('tb_faqs', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_faqs', id, reason),
};

// Content Sections
export const contentService = {
  getAll: () => apiClient.getAll('tb_company'),
  getById: (id: string) => apiClient.getById('tb_company', id),
  create: (data: any) => apiClient.create('tb_company', data),
  update: (id: string, data: any) => apiClient.update('tb_company', id, data),
  delete: (id: string) => apiClient.delete('tb_company', id),
};

// SOP (Standard Operating Procedures)
export const sopService = {
  approve: (id: string) => apiClient.approve('tb_sop', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_sop', id, reason),
  getAll: () => apiClient.getAll('tb_sop'),
  getById: (id: string) => apiClient.getById('tb_sop', id),
  create: (data: any) => apiClient.create('tb_sop', data),
  update: (id: string, data: any) => apiClient.update('tb_sop', id, data),
  delete: (id: string) => apiClient.delete('tb_sop', id),
};

// Master Collection (tb_master_collection)
export const masterCollectionService = {
  getAll: (params?: Record<string, any>) => apiClient.getAll('tb_master_collection', params),
  getById: (id: string) => apiClient.getById('tb_master_collection', id),
  create: (data: any) => apiClient.create('tb_master_collection', data),
  update: (id: string, data: any) => apiClient.update('tb_master_collection', id, data),
  delete: (id: string) => apiClient.delete('tb_master_collection', id),
  approve: (id: string) => apiClient.approve('tb_master_collection', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_master_collection', id, reason),
};

// Career Management (new postings table separate from career_opportunities)
export const careerMgmtService = {
  approve: (id: string) => apiClient.approve('tb_career_management', id),
  reject: (id: string, reason: string) => apiClient.reject('tb_career_management', id, reason),
  getAll: () => apiClient.getAll('tb_career_management'),
  getById: (id: string) => apiClient.getById('tb_career_management', id),
  create: (data: any) => apiClient.create('tb_career_management', data),
  update: (id: string, data: any) => apiClient.update('tb_career_management', id, data),
  delete: (id: string) => apiClient.delete('tb_career_management', id),
};

// Career Submission Management (submissions linked to career postings)
export const careerSubmissionService = {
  getAll: () => apiClient.getAll('tb_career_submission_management'),
  getById: (id: string) => apiClient.getById('tb_career_submission_management', id),
  create: (data: any) => apiClient.create('tb_career_submission_management', data),
  update: (id: string, data: any) => apiClient.update('tb_career_submission_management', id, data),
  delete: (id: string) => apiClient.delete('tb_career_submission_management', id),
};

// File Upload
export const uploadService = {
  uploadFile: (file: File, bucket: string) => apiClient.uploadFile(file, bucket),
};

// Career Applications
export const careerApplicationService = {
  getAll: () => apiClient.getAll('career_applications'),
  getById: (id: string) => apiClient.getById('career_applications', id),
  update: (id: string, data: any) => apiClient.update('career_applications', id, data),
  delete: (id: string) => apiClient.delete('career_applications', id),
};

// User Management
export const userService = {
  getAll: () => apiClient.getAll('users'),
  getById: (id: string) => apiClient.getById('users', id),
  create: (data: { email: string; password: string; display_name?: string }) =>
    apiClient.create('users', data),
  delete: (id: string) => apiClient.delete('users', id),
  update: (id: string, data: { email?: string; display_name?: string }) => apiClient.update('users', id, data),
  setActive: (id: string, active: boolean) => apiClient.create(`users/${id}/active`, { active }),
  updateRole: async (userId: string, role: string) => {
    // First delete existing roles for this user
    try {
      const existingRoles = await apiClient.getAll(`user_roles?user_id=${userId}`);
      if (existingRoles.data && Array.isArray(existingRoles.data) && existingRoles.data.length > 0) {
        for (const userRole of existingRoles.data) {
          if (userRole && typeof userRole === 'object' && 'id' in userRole) {
            await apiClient.delete('user_roles', userRole.id as string);
          }
        }
      }
    } catch (error) {
      logWarn('No existing roles to delete:', error);
    }
    // Then create new role
    return apiClient.create('user_roles', { user_id: userId, role });
  },
  getProfiles: () => apiClient.getAllProfile(),
};

export const categoriesCollection = {
  getAllCategories: () => apiClient.getAll('tb_categories_collections'),
};

export const categoriesMOW = {
  getAllCategories: () => apiClient.getAll('tb_categories_collections'),
};

export const memoryOfWorldGalleryService = {
  getAll: () => apiClient.getAll('tb_memoryoftheworld_gallery'),
};

export const categoriesLayananAsetArea = {
  getAllCategories: () => apiClient.getAll('tb_categories_layananaset_area'),
}

export const categoriesLayananAsetFasilitas = {
  getAllCategories: () => apiClient.getAll('tb_categories_layananaset_fasilitas'),
}

// export const pemanfaatanAssetService = {
//   getAll: () => apiClient.getAll('tb_pemanfaatanasset')
// }

// Merchandise Categories
export const merchandiseCategoryService = {
  getAll: () => apiClient.getAll('merchandise_categories'),
  getById: (id: string) => apiClient.getById('merchandise_categories', id),
  create: (data: any) => apiClient.create('merchandise_categories', data),
  update: (id: string, data: any) => apiClient.update('merchandise_categories', id, data),
  delete: (id: string) => apiClient.delete('merchandise_categories', id),
};

// Merchandise Products
export const merchandiseProductService = {
  getAll: (params?: Record<string, any>) => apiClient.getAll('merchandise_products', params),
  getPublished: () => apiClient.getAll('merchandise_products', { is_published: 'true', is_approved: 'true' }),
  getById: (id: string) => apiClient.getById('merchandise_products', id),
  create: (data: any) => apiClient.create('merchandise_products', data),
  update: (id: string, data: any) => apiClient.update('merchandise_products', id, data),
  delete: (id: string) => apiClient.delete('merchandise_products', id),
  approve: (id: string) => apiClient.approve('merchandise_products', id),
  reject: (id: string, reason: string) => apiClient.reject('merchandise_products', id, reason),
};

// Laboratorium Konservasi
export const conservationService = {
  getAll: () => apiClient.getAll('tb_laboratorium_konservasi'),
  getById: (id: string) => apiClient.getById('tb_laboratorium_konservasi', id),
  create: (data: any) => apiClient.create('tb_laboratorium_konservasi', data),
  update: (id: string, data: any) => apiClient.update('tb_laboratorium_konservasi', id, data),
  delete: (id: string) => apiClient.delete('tb_laboratorium_konservasi', id),
};
