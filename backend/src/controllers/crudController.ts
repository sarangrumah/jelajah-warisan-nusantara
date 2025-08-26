import { Response } from 'express';
import { query, getClient } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { tableConfigs ,tableRelationships, autoJoinRelations, approvalConfig } from '../config/tableConfigs';

// Generic CRUD controller factory
export const createCrudController = (tableName: string, fields: string[]) => {
  const relationName = autoJoinRelations[tableName];
  const relation = relationName ? tableRelationships[tableName]?.[relationName] : null;

  // Helper: Build SELECT clause for joined table
  const buildJoinSelect = (relName: string, relConfig: typeof relation): string => {
    if (!relConfig) return '';

    const allFields = tableConfigs[relConfig.table];
    if (!allFields) throw new Error(`No field config for table: ${relConfig.table}`);

    const selectedFields = relConfig.fields ? relConfig.fields : allFields;

    return selectedFields
      .map(field => {
        const alias = field === 'id' ? `${relName}_id` : `${relName}_${field}`;
        return `${relConfig.table}.${field} AS ${alias}`;
      })
      .join(', ');
  };

  return {
    // === GET ALL ===
    getAll: async (req: AuthRequest, res: Response) => {
      try {
        const { limit = 50, offset = 0, ...filters } = req.query;

        let selectFields = `${tableName}.*`;
        let fromClause = tableName;
        const joins: string[] = [];
        const whereConditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        // 🔹 Auto-join if configured
        if (relation) {
          const { table: joinTable, localKey, foreignKey, type } = relation;
          const joinSelect = buildJoinSelect(relationName, relation);

          selectFields += `, ${joinSelect}`;
          joins.push(
            `${type === 'left' ? 'LEFT' : 'INNER'} JOIN ${joinTable} ON ${tableName}.${localKey} = ${joinTable}.${foreignKey}`
          );
        }

        // Build WHERE from filters
        for (const [key, value] of Object.entries(filters)) {
          if (value === undefined || key === 'include') continue;

          if (key === 'search') {
            const conditions = [];
            if (fields.includes('name')) {
              conditions.push(`${tableName}.name ILIKE $${paramIndex++}`);
              params.push(`%${value}%`);
            }
            if (fields.includes('description')) {
              conditions.push(`${tableName}.description ILIKE $${paramIndex++}`);
              params.push(`%${value}%`);
            }
            if (relation && ['name', 'address'].some(f => tableConfigs[relation.table].includes(f))) {
              conditions.push(`${relation.table}.name ILIKE $${paramIndex++}`);
              params.push(`%${value}%`);
              conditions.push(`${relation.table}.address ILIKE $${paramIndex++}`);
              params.push(`%${value}%`);
            }
            if (conditions.length > 0) {
              whereConditions.push(`(${conditions.join(' OR ')})`);
            }
          } else if (fields.includes(key)) {
            whereConditions.push(`${tableName}.${key} = $${paramIndex}`);
            params.push(value);
            paramIndex++;
          }
        }


        // Final clauses
        const whereClause = whereConditions.length > 0
          ? `WHERE ${whereConditions.join(' AND ')}`
          : '';

        if (joins.length > 0) {
          fromClause = `${tableName} ${joins.join(' ')}`;
        }

        const queryText = `
          SELECT ${selectFields}
          FROM ${fromClause}
          ${whereClause}
          ORDER BY ${tableName}.created_at DESC
          LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        const result = await query(queryText, [...params, limit, offset]);
        res.json(result.rows);
      } catch (error) {
        console.error(`Get all ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // === GET BY ID ===
    getById: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;

        let selectFields = `${tableName}.*`;
        let fromClause = tableName;
        const joins: string[] = [];

        if (relation) {
          const { table: joinTable, localKey, foreignKey, type } = relation;
          const joinSelect = buildJoinSelect(relationName, relation);
          selectFields += `, ${joinSelect}`;
          joins.push(
            `${type === 'left' ? 'LEFT' : 'INNER'} JOIN ${joinTable} ON ${tableName}.${localKey} = ${joinTable}.${foreignKey}`
          );
        }

        if (joins.length > 0) {
          fromClause = `${tableName} ${joins.join(' ')}`;
        }

        const result = await query(
          `SELECT ${selectFields} FROM ${fromClause} WHERE ${tableName}.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Get ${tableName} by ID error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // === CREATE ===
    create: async (req: AuthRequest, res: Response) => {
      const client = await getClient(); // Assumes pool
      try {
        const data = req.body;
        const id = uuidv4();

        let insertData = { ...data };
        let images = [];

        // 🔹 Special handling for tb_sites
        if (tableName === 'tb_sites') {
          ({ images = [], ...insertData } = data);
        }

        // Add metadata
        insertData.id = id;
        insertData.created_at = new Date();
        insertData.updated_at = new Date();
        if (fields.includes('created_by') && req.user) {
          insertData.created_by = req.user.id;
        }

        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (approvalSettings?.requiresApproval) {
          insertData.is_approved = false;
          if (approvalSettings.autoActivateOnApprove) {
            insertData.is_active = false; // will be set on approval
          }
        }

        const validFields = fields.filter(f => f !== 'id' && insertData[f] !== undefined);
        const placeholders = validFields.map((_, i) => `$${i + 1}`).join(', ');
        const values = validFields.map(f => insertData[f]);

        // Start transaction
        await client.query('BEGIN');

        // Insert main record
        await client.query(
          `INSERT INTO ${tableName} (${validFields.join(', ')}) VALUES (${placeholders})`,
          values
        );

        // Insert images if any (only for tb_sites)
        if (tableName === 'tb_sites' && images.length > 0) {
          for (const img of images) {
            await client.query(
              `INSERT INTO tb_images (id, path, id_site, created_at) VALUES ($1, $2, $3, $4)`,
              [uuidv4(), img.path, id, new Date()]
            );
          }
        }

        await client.query('COMMIT');

        // Optional: return full object with images
        if (tableName === 'tb_sites') {
          const result = await client.query(
            `SELECT s.*, 
                (SELECT json_agg(json_build_object('id', i.id, 'path', i.path))
                 FROM tb_images i WHERE i.id_site = s.id) AS images
             FROM tb_sites s WHERE s.id = $1`,
            [id]
          );
          return res.status(201).json(result.rows[0]);
        }

        res.status(201).json({ id, ...insertData });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Create ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to create record' });
      } finally {
        client.release();
      }
    },

    // === UPDATE ===
    update: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const data = req.body;
        data.updated_at = new Date();

        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (approvalSettings?.requiresApproval && data.is_approved !== undefined) {
          const userRoles = req.user?.roles || [];
          if (!userRoles.includes('approver') && !userRoles.includes('admin')) {
            return res.status(403).json({
              error: 'Only approvers or admins can update approval status.'
            });
          }
        }

        const validFields = fields.filter(f =>
          data[f] !== undefined && f !== 'id' && f !== 'created_at'
        );

        if (validFields.length === 0) {
          return res.status(400).json({ error: 'No fields to update' });
        }

        const setClause = validFields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const values = [id, ...validFields.map(f => data[f])];

        const result = await query(
          `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
          values
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Not found' });
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Update ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // === DELETE ===
    delete: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Not found' });
        }

        res.json({ message: 'Deleted successfully', id });
      } catch (error) {
        console.error(`Delete ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // === APPROVE ===
    approve: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const userName = req.user?.email;

        // Check if table requires approval
        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (!approvalSettings?.requiresApproval) {
          return res.status(400).json({ error: `Approval not supported for table: ${tableName}` });
        }

        // Ensure user has role 'approver' or 'admin'
        const userRoles = req.user?.roles || [];
        if (!userRoles.includes('approver') && !userRoles.includes('admin')) {
          return res.status(403).json({ error: 'You do not have permission to approve records.' });
        }

        // Check if record exists and is not already approved
        const checkQuery = await query(
          `SELECT is_approved FROM ${tableName} WHERE id = $1`,
          [id]
        );

        if (checkQuery.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        if (checkQuery.rows[0].is_approved) {
          return res.status(400).json({ error: 'Record is already approved' });
        }

        // Perform approval
        const autoActivate = approvalSettings.autoActivateOnApprove;
        const now = new Date().toISOString();

        const result = await query(
          `
          UPDATE ${tableName}
          SET 
            is_approved = true,

            is_active = CASE WHEN $2 THEN true ELSE is_active END,
            updated_by = $3,
            updated_at = $4
          WHERE id = $1
          RETURNING *
          `,
          [id, autoActivate, userName, now]
        );

        res.json({
          message: 'Record approved successfully',
          data: result.rows[0]
        });
      } catch (error) {
        console.error(`Approve ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to approve record' });
      }
    }
  };
};