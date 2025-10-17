import { Router } from 'express';
import { insertActivityLog, getActivityLogs, countActivityLogs } from '../controllers/activityLogController';
import { authenticateToken, requireAdminOrEditor } from '../middleware/auth';
import rateLimit from 'express-rate-limit';
import { Parser as Json2csvParser } from 'json2csv';
import ExcelJS from 'exceljs';

const router = Router();

// Rate limiter for log endpoints
const logLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max 30 requests per minute per IP
  message: 'Too many requests, please try again later.',
});

// POST /api/activity-log: Record activity
router.post(
  '/',
  logLimiter,
  async (req, res) => {
    try {
      // Validate input
      const {
        user_type,
        user_id,
        session_id,
        ip_address,
        activity_type,
        target_type,
        target_id,
        details,
        success,
      } = req.body;

      if (!user_type || !activity_type || typeof details !== 'object') {
        return res.status(400).json({ error: 'Missing required fields or invalid details' });
      }

      // Sanitize input (basic)
      const log = {
        user_type: String(user_type),
        user_id: user_id ? Number(user_id) : null,
        session_id: session_id ? String(session_id) : null,
        ip_address: ip_address ? String(ip_address) : null,
        activity_type: String(activity_type),
        target_type: target_type ? String(target_type) : null,
        target_id: target_id ? String(target_id) : null,
        details,
        success: typeof success === 'boolean' ? success : null,
      };

      const result = await insertActivityLog(log);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to record activity' });
    }
  }
);

// GET /api/activity-log: Retrieve logs with filters, pagination, sorting
router.get(
  '/',
  authenticateToken,
  requireAdminOrEditor,
  logLimiter,
  async (req, res) => {
    try {
      const {
        user_type,
        user_id,
        session_id,
        activity_type,
        target_type,
        target_id,
        success,
        start_date,
        end_date,
        page = 1,
        pageSize = 20,
        sort = 'timestamp',
        order = 'desc',
      } = req.query;

      // Sanitize and parse query params
      const filters = {
        user_type: user_type ? String(user_type) : undefined,
        user_id: user_id ? Number(user_id) : undefined,
        session_id: session_id ? String(session_id) : undefined,
        activity_type: activity_type ? String(activity_type) : undefined,
        target_type: target_type ? String(target_type) : undefined,
        target_id: target_id ? String(target_id) : undefined,
        success: typeof success !== 'undefined' ? success === 'true' : undefined,
        start_date: start_date ? String(start_date) : undefined,
        end_date: end_date ? String(end_date) : undefined,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 20,
        sort: String(sort),
        order: String(order),
      };

      const logs = await getActivityLogs(filters);
      const total = await countActivityLogs(filters);

      res.json({
        data: logs,
        total,
        page: filters.page,
        pageSize: filters.pageSize,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve activity logs' });
    }
  }
);

// GET /api/activity-log/export/csv: Export filtered logs as CSV
router.get(
  '/export/csv',
  authenticateToken,
  requireAdminOrEditor,
  logLimiter,
  async (req, res) => {
    try {
      const filters = {
        user_type: req.query.user_type ? String(req.query.user_type) : undefined,
        user_id: req.query.user_id ? Number(req.query.user_id) : undefined,
        session_id: req.query.session_id ? String(req.query.session_id) : undefined,
        activity_type: req.query.activity_type ? String(req.query.activity_type) : undefined,
        target_type: req.query.target_type ? String(req.query.target_type) : undefined,
        target_id: req.query.target_id ? String(req.query.target_id) : undefined,
        success: typeof req.query.success !== 'undefined' ? req.query.success === 'true' : undefined,
        start_date: req.query.start_date ? String(req.query.start_date) : undefined,
        end_date: req.query.end_date ? String(req.query.end_date) : undefined,
        page: 1,
        pageSize: 10000, // Export up to 10k rows
        sort: 'timestamp',
        order: 'desc',
      };
      const logs = await getActivityLogs(filters);

      const fields = [
        'id', 'timestamp', 'user_type', 'user_id', 'session_id', 'ip_address',
        'activity_type', 'target_type', 'target_id', 'details', 'success'
      ];
      const parser = new Json2csvParser({ fields });
      const csv = parser.parse(logs);

      res.header('Content-Type', 'text/csv');
      res.attachment('activity_logs.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  }
);

// GET /api/activity-log/export/xlsx: Export filtered logs as Excel
router.get(
  '/export/xlsx',
  authenticateToken,
  requireAdminOrEditor,
  logLimiter,
  async (req, res) => {
    try {
      const filters = {
        user_type: req.query.user_type ? String(req.query.user_type) : undefined,
        user_id: req.query.user_id ? Number(req.query.user_id) : undefined,
        session_id: req.query.session_id ? String(req.query.session_id) : undefined,
        activity_type: req.query.activity_type ? String(req.query.activity_type) : undefined,
        target_type: req.query.target_type ? String(req.query.target_type) : undefined,
        target_id: req.query.target_id ? String(req.query.target_id) : undefined,
        success: typeof req.query.success !== 'undefined' ? req.query.success === 'true' : undefined,
        start_date: req.query.start_date ? String(req.query.start_date) : undefined,
        end_date: req.query.end_date ? String(req.query.end_date) : undefined,
        page: 1,
        pageSize: 10000,
        sort: 'timestamp',
        order: 'desc',
      };
      const logs = await getActivityLogs(filters);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Activity Logs');
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'Timestamp', key: 'timestamp', width: 24 },
        { header: 'User Type', key: 'user_type', width: 12 },
        { header: 'User ID', key: 'user_id', width: 10 },
        { header: 'Session ID', key: 'session_id', width: 20 },
        { header: 'IP Address', key: 'ip_address', width: 16 },
        { header: 'Activity Type', key: 'activity_type', width: 20 },
        { header: 'Target Type', key: 'target_type', width: 16 },
        { header: 'Target ID', key: 'target_id', width: 16 },
        { header: 'Details', key: 'details', width: 32 },
        { header: 'Success', key: 'success', width: 8 },
      ];
      logs.forEach(log => {
        worksheet.addRow({
          ...log,
          details: JSON.stringify(log.details),
        });
      });

      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.attachment('activity_logs.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      res.status(500).json({ error: 'Failed to export XLSX' });
    }
  }
);

export default router;