import { get } from 'http';
import { apiClient } from './api-client';

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
// Heitages
export const heritageService = {
  getAll: () => apiClient.getAll('heritages'),
  getById: (id: string) => apiClient.getById('heritages', id),
  create: (data: any) => apiClient.create('heritages', data),
  update: (id: string, data: any) => apiClient.update('heritages', id, data),
  delete: (id: string) => apiClient.delete('heritages', id),
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
  getAll: () => apiClient.getAll('agenda_items'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('agenda_items', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('agenda_items', id),
  create: (data: any) => apiClient.create('agenda_items', data),
  update: (id: string, data: any) => apiClient.update('agenda_items', id, data),
  delete: (id: string) => apiClient.delete('agenda_items', id),
};

// Museums
export const museumService = {
    approve: (id: string) => apiClient.approve('tb_sites', id),
  getAll: () => apiClient.getAll('tb_sites', { is_published: 'true' }),
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
  getAllTypes: () => apiClient.getAll('tb_sites'),
  getAllCategories: () => apiClient.getAll('tb_categories_event'),
};

// Banners
export const bannerService = {
  approve: (id: string) => apiClient.approve('tb_banner', id),
  getAll: () => apiClient.getAll('tb_banner'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('tb_banner', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('tb_banner', id),
  create: (data: any) => apiClient.create('tb_banner', data),
  update: (id: string, data: any) => apiClient.update('tb_banner', id, data),
  delete: (id: string) => apiClient.delete('tb_banner', id),
};

export const EventsService = {
  approve: (id: string) => apiClient.approve('tb_events', id),
  getAll: () => apiClient.getAll('tb_events'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('tb_events', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('tb_events', id),
  create: (data: any) => apiClient.create('tb_events', data),
  update: (id: string, data: any) => apiClient.update('tb_events', id, data),
  delete: (id: string) => apiClient.delete('tb_events', id),
};

// Career Opportunities
export const careerService = {
  getAll: () => apiClient.getAll('career_opportunities'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('career_opportunities', { is_published: 'true' }),
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
  approve: (id: string) => apiClient.approve('tb_events', id),
};

// FAQs
export const faqService = {
  getAll: () => apiClient.getAll('tb_faqs'),
  getById: (id: string) => apiClient.getById('tb_faqs', id),
  create: (data: any) => apiClient.create('tb_faqs', data),
  update: (id: string, data: any) => apiClient.update('tb_faqs', id, data),
  delete: (id: string) => apiClient.delete('tb_faqs', id),
  approve: (id: string) => apiClient.approve('tb_faqs', id),
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
  getAll: () => apiClient.getAll('tb_sop'),
  getById: (id: string) => apiClient.getById('tb_sop', id),
  create: (data: any) => apiClient.create('tb_sop', data),
  update: (id: string, data: any) => apiClient.update('tb_sop', id, data),
  delete: (id: string) => apiClient.delete('tb_sop', id),
};

// Career Management (new postings table separate from career_opportunities)
export const careerMgmtService = {
  approve: (id: string) => apiClient.approve('tb_career_management', id),
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
      console.warn('No existing roles to delete:', error);
    }
    // Then create new role
    return apiClient.create('user_roles', { user_id: userId, role });
  },
  getProfiles: () => apiClient.getAllProfile(),
};
