import express from 'express';
import {
  getAllEmployees,
  getAdminEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/organizationalStructureController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public route
router.get('/', getAllEmployees);

// Admin routes
router.get('/admin', authenticateToken, requireRole(['admin', 'super-admin', 'approver']), getAdminEmployees);
router.post('/', authenticateToken, requireRole(['admin', 'super-admin']), createEmployee);
router.put('/:id', authenticateToken, requireRole(['admin', 'super-admin']), updateEmployee);
router.delete('/:id', authenticateToken, requireRole(['admin', 'super-admin']), deleteEmployee);

export default router;