import { apiClient } from './api-client';

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
  getAll: () => apiClient.getAll('museums', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('museums', id),
  create: (data: any) => apiClient.create('museums', data),
  update: (id: string, data: any) => apiClient.update('museums', id, data),
  delete: (id: string) => apiClient.delete('museums', id),
};

// Banners
export const bannerService = {
  getAll: () => apiClient.getAll('banners'), // Get all for admin, filtering happens in components
  getPublished: () => apiClient.getAll('banners', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('banners', id),
  create: (data: any) => apiClient.create('banners', data),
  update: (id: string, data: any) => apiClient.update('banners', id, data),
  delete: (id: string) => apiClient.delete('banners', id),
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
  getAll: () => apiClient.getAll('media_items', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('media_items', id),
  create: (data: any) => apiClient.create('media_items', data),
  update: (id: string, data: any) => apiClient.update('media_items', id, data),
  delete: (id: string) => apiClient.delete('media_items', id),
};

// FAQs
export const faqService = {
  getAll: () => apiClient.getAll('faqs', { is_published: 'true' }),
  getById: (id: string) => apiClient.getById('faqs', id),
  create: (data: any) => apiClient.create('faqs', data),
  update: (id: string, data: any) => apiClient.update('faqs', id, data),
  delete: (id: string) => apiClient.delete('faqs', id),
};

// Content Sections
export const contentService = {
  getAll: () => apiClient.getAll('content_sections'),
  getById: (id: string) => apiClient.getById('content_sections', id),
  create: (data: any) => apiClient.create('content_sections', data),
  update: (id: string, data: any) => apiClient.update('content_sections', id, data),
  delete: (id: string) => apiClient.delete('content_sections', id),
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
  getProfiles: () => apiClient.getAll('profiles'),
};