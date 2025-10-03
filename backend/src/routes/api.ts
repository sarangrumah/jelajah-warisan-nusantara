import { Router } from 'express';
import { authenticateToken, requireAdminOrEditor } from '../middleware/auth';
import { createCrudController } from '../controllers/crudController';
import { tableConfigs, tableRelationships, autoJoinRelations } from '../config/tableConfigs';

const router = Router();
// Language list endpoint for frontend language switcher
router.get('/translations/languages', (req, res) => {
  res.json([
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]);
});

// Table configurations


// Create CRUD routes for each table
Object.entries(tableConfigs).forEach(([tableName, fields]) => {


  const controller = createCrudController(tableName, fields);


  
  // Public read routes
  router.get(`/${tableName}`, controller.getAll);
  router.get(`/${tableName}/:id`, controller.getById);
  
  // Admin/Editor only routes for write operations
  router.post(`/${tableName}/:id/approve`, authenticateToken, requireAdminOrEditor, controller.approve);
  router.post(`/${tableName}/:id/reject`, authenticateToken, requireAdminOrEditor, controller.reject);
  router.post(`/${tableName}`, authenticateToken, requireAdminOrEditor, controller.create);
  router.put(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.update);
  router.delete(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.delete);
});

// Special route for career applications (public create)
const careerApplicationsController = createCrudController('career_applications', tableConfigs.career_applications);
router.post('/career_applications/public', careerApplicationsController.create);

export default router;
