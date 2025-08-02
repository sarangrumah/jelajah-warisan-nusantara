import { Router } from 'express';
import { authenticateToken, requireAdminOrEditor } from '../middleware/auth';
import { createCrudController } from '../controllers/crudController';

const router = Router();

// Table configurations
const tableConfigs = {
  banners: ['id', 'title', 'subtitle', 'description', 'image_url', 'start_date', 'end_date', 'is_published', 'created_by', 'created_at', 'updated_at'],
  news_articles: ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image_url', 'is_published', 'published_at', 'created_by', 'created_at', 'updated_at'],
  agenda_items: ['id', 'title', 'description', 'event_date', 'event_time', 'location', 'image_url', 'is_published', 'created_by', 'created_at', 'updated_at'],
  museums: ['id', 'name', 'type', 'description', 'location', 'address', 'latitude', 'longitude', 'image_url', 'gallery_images', 'opening_hours', 'contact_info', 'is_published', 'created_by', 'created_at', 'updated_at'],
  career_opportunities: ['id', 'title', 'type', 'description', 'requirements', 'benefits', 'location', 'duration', 'application_deadline', 'is_published', 'created_by', 'created_at', 'updated_at'],
  career_applications: ['id', 'opportunity_id', 'full_name', 'email', 'phone', 'university', 'major', 'semester', 'program', 'motivation', 'cv_url', 'transcript_url', 'cover_letter_url', 'status', 'created_at', 'updated_at'],
  media_items: ['id', 'title', 'type', 'category', 'excerpt', 'content', 'image_url', 'file_url', 'tags', 'is_published', 'published_at', 'created_by', 'created_at', 'updated_at'],
  faqs: ['id', 'question', 'answer', 'category', 'order_index', 'is_published', 'created_by', 'created_at', 'updated_at'],
  content_sections: ['id', 'section_key', 'title', 'content', 'is_published', 'created_by', 'created_at', 'updated_at']
};

// Create CRUD routes for each table
Object.entries(tableConfigs).forEach(([tableName, fields]) => {
  const controller = createCrudController(tableName, fields);
  
  // Public read routes
  router.get(`/${tableName}`, controller.getAll);
  router.get(`/${tableName}/:id`, controller.getById);
  
  // Admin/Editor only routes for write operations
  router.post(`/${tableName}`, authenticateToken, requireAdminOrEditor, controller.create);
  router.put(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.update);
  router.delete(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.delete);
});

// Special route for career applications (public create)
const careerApplicationsController = createCrudController('career_applications', tableConfigs.career_applications);
router.post('/career_applications/public', careerApplicationsController.create);

export default router;