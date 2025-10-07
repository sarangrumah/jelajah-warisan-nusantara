import { query } from '../config/database';
import { Request, Response } from 'express';

// Types
export interface ActivityLog {
  id?: number;
  timestamp?: string;
  user_type: string;
  user_id?: number | null;
  session_id?: string | null;
  ip_address?: string | null;
  activity_type: string;
  target_type?: string | null;
  target_id?: string | null;
  details: any;
  success?: boolean | null;
}

// Insert activity log
export async function insertActivityLog(log: ActivityLog) {
  const result = await query(
    `INSERT INTO activity_log
      (user_type, user_id, session_id, ip_address, activity_type, target_type, target_id, details, success)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      log.user_type,
      log.user_id ?? null,
      log.session_id ?? null,
      log.ip_address ?? null,
      log.activity_type,
      log.target_type ?? null,
      log.target_id ?? null,
      JSON.stringify(log.details),
      log.success ?? null,
    ]
  );
  return result.rows[0];
}

// Query activity logs with filters, pagination, sorting
export async function getActivityLogs({
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
  order = 'desc'
}: any) {
  const filters = [];
  const params: any[] = [];
  let idx = 1;

  if (user_type) { filters.push(`user_type = $${idx++}`); params.push(user_type); }
  if (user_id) { filters.push(`user_id = $${idx++}`); params.push(user_id); }
  if (session_id) { filters.push(`session_id = $${idx++}`); params.push(session_id); }
  if (activity_type) { filters.push(`activity_type = $${idx++}`); params.push(activity_type); }
  if (target_type) { filters.push(`target_type = $${idx++}`); params.push(target_type); }
  if (target_id) { filters.push(`target_id = $${idx++}`); params.push(target_id); }
  if (success !== undefined) { filters.push(`success = $${idx++}`); params.push(success); }
  if (start_date) { filters.push(`timestamp >= $${idx++}`); params.push(start_date); }
  if (end_date) { filters.push(`timestamp <= $${idx++}`); params.push(end_date); }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT * FROM activity_log
    ${where}
    ORDER BY ${sort} ${order === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  params.push(pageSize, offset);

  const result = await query(sql, params);
  return result.rows;
}

// Count logs for pagination
export async function countActivityLogs(filters: any) {
  // Similar to getActivityLogs, but returns count(*)
  const filterClauses = [];
  const params: any[] = [];
  let idx = 1;

  if (filters.user_type) { filterClauses.push(`user_type = $${idx++}`); params.push(filters.user_type); }
  if (filters.user_id) { filterClauses.push(`user_id = $${idx++}`); params.push(filters.user_id); }
  if (filters.session_id) { filterClauses.push(`session_id = $${idx++}`); params.push(filters.session_id); }
  if (filters.activity_type) { filterClauses.push(`activity_type = $${idx++}`); params.push(filters.activity_type); }
  if (filters.target_type) { filterClauses.push(`target_type = $${idx++}`); params.push(filters.target_type); }
  if (filters.target_id) { filterClauses.push(`target_id = $${idx++}`); params.push(filters.target_id); }
  if (filters.success !== undefined) { filterClauses.push(`success = $${idx++}`); params.push(filters.success); }
  if (filters.start_date) { filterClauses.push(`timestamp >= $${idx++}`); params.push(filters.start_date); }
  if (filters.end_date) { filterClauses.push(`timestamp <= $${idx++}`); params.push(filters.end_date); }

  const where = filterClauses.length ? `WHERE ${filterClauses.join(' AND ')}` : '';
  const sql = `SELECT COUNT(*) FROM activity_log ${where}`;
  const result = await query(sql, params);
  return parseInt(result.rows[0].count, 10);
}