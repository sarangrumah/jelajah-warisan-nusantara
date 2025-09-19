import { Response } from 'express';
import { query, getClient } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { tableConfigs, tableRelationships, autoJoinRelations, approvalConfig } from '../config/tableConfigs';

// Define relation config shape
interface JoinConfig {
  table: string;
  localKey: string;
  foreignKey: string;
  type: 'left' | 'inner' | 'has_many';
  fields?: string[];
}

// Generic CRUD controller factory
export const createCrudController = (tableName: string, fields: string[]) => {
 // Get auto-join relations (for belongs-to, not has-many)
  const relations = tableRelationships[tableName as keyof typeof tableRelationships] || {};
  const flatJoins: { name: string; config: JoinConfig }[] = [];
  const hasManyRelations: { name: string; config: JoinConfig }[] = [];

  Object.entries(relations).forEach(([relKey, relConfig]) => {
    if (relConfig && typeof relConfig === 'object' && 'type' in relConfig && typeof relConfig.type === 'string') {
      const typedRelConfig = relConfig as JoinConfig;
      if (typedRelConfig.type === 'has_many') {
        hasManyRelations.push({ name: relKey, config: typedRelConfig });
      } else {
        flatJoins.push({ name: relKey, config: typedRelConfig });
      }
    }
  });

  // Helper: Build SELECT clause for flat join
  // const buildFlatJoinSelect = (relName: string, relConfig: JoinConfig): string => {
  //   if (!relConfig) return '';

  //   const allFields = tableConfigs[relConfig.table];
  //   if (!allFields) {
  //     throw new Error(`No field config for table: ${relConfig.table}`);
  //   }

  //   const selectedFields = relConfig.fields ? relConfig.fields : allFields;

  //   return selectedFields
  //     .map(field => {
  //       const alias = field === 'id'
  //         ? `${relName}_id`
  //         : `${relName}_${field}`;
  //       return `${relConfig.table}.${field} AS ${alias}`;
  //     })
  //     .join(', ');
  // };

  const buildBelongsToSelect = (relName: string, relConfig: JoinConfig): string => {
    const { table: childTable, fields } = relConfig;
    const allFields = fields || tableConfigs[childTable as keyof typeof tableConfigs] || [];

    const jsonFields = allFields
      .map((f: string) => `'${f}', ${childTable}.${f}`)
      .join(', ');

    return `json_build_object(${jsonFields}) AS ${relName}`;
  };

  return {
    // === GET ALL ===
    getAll: async (req: AuthRequest, res: Response) => {
      try {
        const { limit = 50, offset = 0, ...filters } = req.query;

        // Start with base fields
        let selectFields = `${tableName}.*`;

        // Add flat joins (belongs-to)
        const joins: string[] = [];
        for (const { name: relName, config: rel } of flatJoins) {
          if (rel.type === 'left' || rel.type === 'inner') {
            const joinSelect = buildBelongsToSelect(relName, rel);
            selectFields += `, ${joinSelect}`;

            const joinType = rel.type === 'left' ? 'LEFT JOIN' : 'INNER JOIN';
            joins.push(
              `${joinType} ${rel.table} ON ${tableName}.${rel.localKey} = ${rel.table}.${rel.foreignKey}`
            );
          }
        }

        // Add has-many subqueries (e.g., company_leadership[])
        const relations = tableRelationships[tableName as keyof typeof tableRelationships];
        if (relations) {
          for (const [relKey, relConfig] of Object.entries(relations)) {
            if (relConfig && typeof relConfig === 'object' && 'type' in relConfig && relConfig.type === 'has_many') {
              const { table: childTable, localKey, fields: relFields } = relConfig as JoinConfig;
              const childFields = relFields || tableConfigs[childTable as keyof typeof tableConfigs] || [];

              const jsonFields = childFields
                .filter((f: string) => f !== localKey) // exclude foreignKey
                .map((f: string) => `'${f}', ${childTable}.${f}`)
                .join(', ');

              selectFields += `,
                (SELECT json_agg(json_build_object(${jsonFields}))
                FROM ${childTable}
                WHERE ${childTable}.${localKey} = ${tableName}.id
                ) AS ${relKey}`;
            }
          }
        }

        // Build WHERE
        const whereConditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

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
            if (conditions.length > 0) {
              whereConditions.push(`(${conditions.join(' OR ')})`);
            }
          } else if (fields.includes(key)) {
            whereConditions.push(`${tableName}.${key} = $${paramIndex}`);
            params.push(value);
            paramIndex++;
          }
        }

        const whereClause = whereConditions.length > 0
          ? `WHERE ${whereConditions.join(' AND ')}`
          : '';

        const fromClause = [tableName, ...joins].join(' ');

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

        // Base query
        const baseResult = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        if (baseResult.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        let record = baseResult.rows[0];

        // Add flat joins (belongs-to)
        for (const { name: relName, config: rel } of flatJoins) {
          const joinSelect = buildBelongsToSelect(relName, rel);
          if (joinSelect) {
            const joinResult = await query(
              `SELECT ${joinSelect}
               FROM ${rel.table}
               WHERE ${rel.table}.${rel.foreignKey} = $1`,
              [id]
            );
            if (joinResult.rows[0]) {
              Object.assign(record, joinResult.rows[0]);
            }
          }
        }

        // Add has-many relations (e.g., company_leadership[])
        const relations = tableRelationships[tableName as keyof typeof tableRelationships];
        if (relations) {
          for (const [relKey, relConfig] of Object.entries(relations)) {
            // Only "has many" (child has foreignKey to parent's id)
            if (relConfig && typeof relConfig === 'object' && 'foreignKey' in relConfig) {
              if ((relConfig as JoinConfig).foreignKey === 'id') {
                const { table: childTable, localKey, fields: relFields } = relConfig as JoinConfig;
                const childFields = relFields || Object.keys(tableConfigs[childTable as keyof typeof tableConfigs] || {});

                const jsonFields = childFields
                  .filter((f: string) => f !== localKey)
                  .map((f: string) => `'${f}', ${childTable}.${f}`)
                  .join(', ');

                const result = await query(
                  `SELECT json_agg(json_build_object(${jsonFields})) AS data
                   FROM ${childTable}
                   WHERE ${childTable}.${localKey} = $1`,
                  [id]
                );

                record[relKey] = result.rows[0].data || [];
              }
            }
          }
        }
        res.json(record);
      } catch (error) {
        console.error(`Get ${tableName} by ID error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    // === CREATE === (unchanged, but works)
    create: async (req: AuthRequest, res: Response) => {
      const client = await getClient();
      try {
        const data = req.body;
        const id = uuidv4();

        let insertData = { ...data };
        let images: any[] = [];
        let companyLeadership: any[] = [];
        let companyVisitor: any[] = [];
        let gallery: any[] = [];

        if (tableName === 'tb_sites') {
          ({ images = [], ...insertData } = data);
        }

        if (tableName === 'tb_company') {
          ({ companyLeadership = [], companyVisitor = [], ...insertData } = data);
        }

        if (tableName === 'tb_memoryoftheworld') {
          ({ gallery = [], ...insertData } = data);
        }

        if (tableName === 'tb_sites' && typeof insertData.opening_hours === 'string' ) {
          try {
            insertData.opening_hours = JSON.parse(insertData.opening_hours);
          } catch (e) {
            return res.status(400).json({
              error: 'Invalid JSON in opening_hours'
            });
          }
        } else if (tableName === 'tb_sites' && typeof insertData.facilities === 'string') {
          try {
            insertData.facilities = JSON.parse(insertData.facilities);
          } catch (e) {
            return res.status(400).json({
              error: 'Invalid JSON in opening_hours'
            });
          }
        }

        // Normalize foreign keys: convert empty string to NULL for *_id fields (e.g., sites_id)
        Object.keys(insertData).forEach((key) => {
          if (key.endsWith('_id') && insertData[key] === '') {
            insertData[key] = null;
          }
        });

        insertData.id = id;
        insertData.created_at = new Date();
        insertData.updated_at = new Date();

        if (fields.includes('created_by') && req.user) {
          insertData.created_by = req.user.id;
        }


        const excludedOnCreate = ['updated_by', 'updated_at'];
        const validFields = fields
          .filter(f => 
            insertData[f] !== undefined && 
            !excludedOnCreate.includes(f)
          );

        // Handle JSON/JSONB fields by stringifying values and casting placeholders
        const JSON_FIELDS: Record<string, string[]> = {
          tb_sites: ['opening_hours'],
        };
        const jsonFieldsForTable = JSON_FIELDS[tableName] || [];

        const values = validFields.map((f) => {
          const v = insertData[f];
          if (jsonFieldsForTable.includes(f) && typeof v !== 'string') {
            return JSON.stringify(v);
          }
          return v;
        });

        const placeholders = validFields
          .map((f, i) => (jsonFieldsForTable.includes(f) ? `$${i + 1}::jsonb` : `$${i + 1}`))
          .join(', ');

        await client.query('BEGIN');


        await client.query(
          `INSERT INTO ${tableName} (${validFields.join(', ')}) VALUES (${placeholders})`,
          values
        );

        // console.log(`INSERT INTO ${tableName} (${validFields.join(', ')}) VALUES (${placeholders})`)
        

        // Insert nested (unchanged)
        if (tableName === 'tb_company' && companyLeadership.length > 0) {
          const createdBy = insertData.created_by || 'system';
          for (const item of companyLeadership) {
            await client.query(
              `INSERT INTO tb_company_leadership (id, name, position, is_active, company_id, created_by, updated_by, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)`,
              [uuidv4(), item.name, item.position, item.is_active ?? true, id, createdBy, new Date()]
            );
          }
        }

        if (tableName === 'tb_company' && companyVisitor.length > 0) {
          const createdBy = insertData.created_by || 'system';
          for (const item of companyVisitor) {
            await client.query(
              `INSERT INTO tb_company_visitor (id, visitor_count, year, is_active, company_id, created_by, updated_by, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)`,
              [uuidv4(), item.visitor_count || 0, item.year || new Date().getFullYear(), item.is_active ?? true, id, createdBy, new Date()]
            );
          }
        }

        if (tableName === 'tb_sites' && images.length > 0) {
          const createdBy = insertData.created_by || 'system';
          for (const img of images) {
            await client.query(
              `INSERT INTO tb_images (id, path, sites_id, created_by, updated_by, created_at)
               VALUES ($1, $2, $3, $4, $4, $5)`,
              [uuidv4(), img.path, id, createdBy, new Date()]
            );
          }
        }

        // Insert gallery for tb_memoryoftheworld before commit
        if (tableName === 'tb_memoryoftheworld' && gallery.length > 0) {
          const createdBy = insertData.created_by || 'system';
          for (const item of gallery) {
            const filePath = (item && (item.path || item.upload_file)) || item;
            if (!filePath) continue;
            await client.query(
              `INSERT INTO tb_memoryoftheworld_gallery (id, id_memoryoftheworld, upload_file, created_by, updated_by, created_at)
               VALUES ($1, $2, $3, $4, $4, $5)`,
              [uuidv4(), id, filePath, createdBy, new Date()]
            );
          }
        }

        await client.query('COMMIT');

        // Return enriched
        if (tableName === 'tb_company') {
          const result = await client.query(
            `SELECT c.*,
                (SELECT json_agg(json_build_object('id', cl.id, 'name', cl.name, 'position', cl.position)) FROM tb_company_leadership cl WHERE cl.company_id = c.id) AS company_leadership,
                (SELECT json_agg(json_build_object('id', cv.id, 'visitor_count', cv.visitor_count, 'year', cv.year)) FROM tb_company_visitor cv WHERE cv.company_id = c.id) AS company_visitor
             FROM tb_company c WHERE c.id = $1`,
            [id]
          );
          return res.status(201).json(result.rows[0]);
        }

        // Return enriched record for tb_memoryoftheworld with galleries
        if (tableName === 'tb_memoryoftheworld') {
          const result = await query(
            `SELECT m.*,
              (SELECT json_agg(json_build_object('id', g.id, 'id_memoryoftheworld', g.id_memoryoftheworld, 'upload_file', g.upload_file))
               FROM tb_memoryoftheworld_gallery g WHERE g.id_memoryoftheworld = m.id) AS galleries
             FROM tb_memoryoftheworld m WHERE m.id = $1`,
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

    // === UPDATE === (unchanged)
    update: async (req: AuthRequest, res: Response) => {
      const client = await getClient();
      try {
        const { id } = req.params;
        const input = { ...req.body }; // Safe copy

        // 🔹 Extract nested arrays — single destructuring, no reassignment
        const {
          images = [],
          gallery = [],
          company_leadership: companyLeadership = [],
          company_visitor: companyVisitor = [],
          ...mainData // All top-level fields
        } = input;

        // Add metadata
        const data = {
          ...mainData,
          updated_at: new Date()
        };

        // Normalize foreign keys on update: empty string -> NULL for *_id columns
        Object.keys(data).forEach((key) => {
          if (key.endsWith('_id') && (data as any)[key] === '') {
            (data as any)[key] = null;
          }
        });

        if (fields.includes('updated_by') && req.user) {
          data.updated_by = req.user.id;
        }

        // Approval logic: only approver/admin (and super-admin) may change is_approved
        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (approvalSettings?.requiresApproval) {
          const userRoles = req.user?.roles || [];
          const canChangeApproval = userRoles.includes('approver') || userRoles.includes('admin') || userRoles.includes('super-admin');
          if (!canChangeApproval && Object.prototype.hasOwnProperty.call(data, 'is_approved')) {
            // Strip attempted changes from non-approver/admin edits so regular updates don't fail
            delete (data as any).is_approved;
          }
        }

        // Validate there's something to update
        const validFields = fields.filter(
          f => data[f] !== undefined && f !== 'id' && f !== 'created_at'
        );

        // Check if only nested data is being updated
        const hasMainUpdates = validFields.length > 0;
        const hasNestedUpdates =
          (tableName === 'tb_company' && (companyLeadership.length > 0 || companyVisitor.length > 0)) ||
          (tableName === 'tb_sites' && images.length > 0) ||
          (tableName === 'tb_memoryoftheworld' && gallery.length > 0);

        if (!hasMainUpdates && !hasNestedUpdates) {
          return res.status(400).json({ error: 'No data to update' });
        }

        // Start transaction
        await client.query('BEGIN');

        // 🔹 1. Update main record (if there are fields)
        if (hasMainUpdates) {
          const JSON_FIELDS: Record<string, string[]> = {
            tb_sites: ['opening_hours'],
          };
          const jsonFieldsForTable = JSON_FIELDS[tableName] || [];

          const setClause = validFields
            .map((f, i) => `${f} = $${i + 2}${jsonFieldsForTable.includes(f) ? '::jsonb' : ''}`)
            .join(', ');

          const values = [
            id,
            ...validFields.map((f) =>
              jsonFieldsForTable.includes(f) && typeof data[f] !== 'string'
                ? JSON.stringify(data[f])
                : data[f]
            ),
          ];

          const result = await client.query(
            `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING id`,
            values
          );

          if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Record not found' });
          }
        }

        const updatedBy = data.updated_by || 'system';

        // 🔹 2. Handle companyLeadership (Update, Insert)
        if (tableName === 'tb_company') {
          for (const item of companyLeadership) {
           
            if (item.is_deleted && item.id) {
              // 🚫 DELETE
              await client.query(
                `DELETE FROM tb_company_leadership WHERE id = $1 AND company_id = $2`,
                [item.id, id]
              );
            } else if (item.id) {
              // ✏️ UPDATE existing
              await client.query(
                `UPDATE tb_company_leadership
                SET name = $1, position = $2, is_active = $3, updated_by = $4, updated_at = $5
                WHERE id = $6 AND company_id = $7`,
                [
                  item.name,
                  item.position,
                  item.is_active ?? true,
                  updatedBy,
                  new Date(),
                  item.id,
                  id
                ]
              );
            } else {
              // ➕ INSERT new
               console.log(item, id)
              await client.query(
                `INSERT INTO tb_company_leadership (
                  id, name, position, is_active, company_id, created_by, updated_by, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)`,
                [
                  uuidv4(),
                  item.name,
                  item.position,
                  item.is_active ?? true,
                  id,
                  updatedBy,
                  new Date()
                ]
              );
            }
          }

          // 🔹 Handle companyVisitor
          for (const item of companyVisitor) {
            if (item.is_deleted && item.id) {
              // 🚫 DELETE
              await client.query(
                `DELETE FROM tb_company_visitor WHERE id = $1 AND company_id = $2`,
                [item.id, id]
              );
            } else if (item.id) {
              // ✏️ UPDATE
              await client.query(
                `UPDATE tb_company_visitor
                SET visitor_count = $1, year = $2, is_active = $3, updated_by = $4, updated_at = $5
                WHERE id = $6 AND company_id = $7`,
                [
                  item.visitor_count || 0,
                  item.year || new Date().getFullYear(),
                  item.is_active ?? true,
                  updatedBy,
                  new Date(),
                  item.id,
                  id
                ]
              );
            } else {
              // ➕ INSERT
               console.log(item, id)
              await client.query(
                `INSERT INTO tb_company_visitor (
                  id, visitor_count, year, is_active, company_id, created_by, updated_by, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $7)`,
                [
                  uuidv4(),
                  item.visitor_count || 0,
                  item.year || new Date().getFullYear(),
                  item.is_active ?? true,
                  id,
                  updatedBy,
                  new Date()
                ]
              );
            }
          }
        }

        // 🔹 3. Handle images for tb_sites
        if (tableName === 'tb_sites') {
          for (const img of images) {
            if (img.is_deleted && img.id) {
              // 🚫 DELETE
              await client.query(
                `DELETE FROM tb_images WHERE id = $1 AND sites_id = $2`,
                [img.id, id]
              );
            } else if (img.id) {
              // ✏️ UPDATE
              await client.query(
                `UPDATE tb_images
                SET path = $1, updated_by = $2, updated_at = $3
                WHERE id = $4 AND sites_id = $5`,
                [img.path, updatedBy, new Date(), img.id, id]
              );
            } else {
              // ➕ INSERT
              await client.query(
                `INSERT INTO tb_images (id, path, sites_id, created_by, updated_by, created_at)
                VALUES ($1, $2, $3, $4, $4, $5)`,
                [uuidv4(), img.path, id, updatedBy, new Date()]
              );
            }
          }
        }

        // 🔹 4. Handle gallery for tb_memoryoftheworld
        if (tableName === 'tb_memoryoftheworld') {
          for (const item of gallery as any[]) {
            const filePath = item.path || item.upload_file;
            if (item?.is_deleted && item.id) {
              await client.query(
                `DELETE FROM tb_memoryoftheworld_gallery WHERE id = $1 AND id_memoryoftheworld = $2`,
                [item.id, id]
              );
            } else if (item.id) {
              await client.query(
                `UPDATE tb_memoryoftheworld_gallery
                 SET upload_file = $1, updated_by = $2, updated_at = $3
                 WHERE id = $4 AND id_memoryoftheworld = $5`,
                [filePath, updatedBy, new Date(), item.id, id]
              );
            } else if (filePath) {
              await client.query(
                `INSERT INTO tb_memoryoftheworld_gallery (id, id_memoryoftheworld, upload_file, created_by, updated_by, created_at)
                 VALUES ($1, $2, $3, $4, $4, $5)`,
                [uuidv4(), id, filePath, updatedBy, new Date()]
              );
            }
          }
        }

        // ✅ Commit transaction
        await client.query('COMMIT');

        // 🔹 Return full updated object with relations
        if (tableName === 'tb_company') {
          const result = await client.query(
            `SELECT c.*,
                (SELECT json_agg(json_build_object(
                  'id', cl.id,
                  'name', cl.name,
                  'position', cl.position,
                  'is_active', cl.is_active,
                  'created_by', cl.created_by,
                  'updated_by', cl.updated_by
                )) FROM tb_company_leadership cl WHERE cl.company_id = c.id
                ) AS companyLeadership,

                (SELECT json_agg(json_build_object(
                  'id', cv.id,
                  'visitor_count', cv.visitor_count,
                  'year', cv.year,
                  'is_active', cv.is_active,
                  'created_by', cv.created_by,
                  'updated_by', cv.updated_by
                )) FROM tb_company_visitor cv WHERE cv.company_id = c.id
                ) AS companyVisitor

            FROM tb_company c WHERE c.id = $1`,
            [id]
          );

          if (result.rows.length > 0) {
            return res.json(result.rows[0]);
          }
        }

        // Fallback
        res.json({ id, ...data });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Update ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to update record' });
      } finally {
        client.release();
      }
    },

    // === DELETE ===
    delete: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
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
        const idUser = req.user?.id

        // Check if table requires approval
        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (!approvalSettings?.requiresApproval) {
          return res.status(400).json({ error: `Approval not supported for table: ${tableName}` });
        }

        // Ensure user has role 'approver' or 'admin'
        const userRoles = req.user?.roles || [];
        if (!userRoles.includes('approver') && !userRoles.includes('super-admin')) {
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
          [id, autoActivate, idUser, now]
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