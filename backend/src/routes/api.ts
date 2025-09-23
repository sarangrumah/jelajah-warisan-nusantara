import { Router } from 'express';
import { authenticateToken, requireAdminOrEditor } from '../middleware/auth';
import { createCrudController } from '../controllers/crudController';
import { tableConfigs } from '../config/tableConfigs';

const router = Router();

// Table configurations


// Create CRUD routes for each table
Object.entries(tableConfigs).forEach(([tableName, fields]) => {


  const controller = createCrudController(tableName, fields);

  // Public read routes
  router.get(`/${tableName}`, controller.getAll);
  router.get(`/${tableName}/:id`, controller.getById);
  
  // Admin/Editor only routes for write operations
  router.post(`/${tableName}/:id/approve`, authenticateToken, requireAdminOrEditor, controller.approve);
  router.post(`/${tableName}`, authenticateToken, requireAdminOrEditor, controller.create);
  router.put(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.update);
  router.delete(`/${tableName}/:id`, authenticateToken, requireAdminOrEditor, controller.delete);
});

// Special route for career applications (public create)
const careerApplicationsController = createCrudController('career_applications', tableConfigs.career_applications);
router.post('/career_applications/public', careerApplicationsController.create);

// Debug endpoint to list all registered table names at runtime
router.get('/debug-tables', (req, res) => {
  res.json({ tables: Object.keys(tableConfigs) });
});
// Debug: Print all registered API routes
router.stack.forEach((layer) => {
  if (layer.route && (layer.route as any).methods) {
    const methods = Object.keys((layer.route as any).methods).join(',').toUpperCase();
    console.log(`[API ROUTE] ${methods} ${(layer.route as any).path}`);
  }
});
export default router;