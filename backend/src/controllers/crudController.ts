import { Response } from 'express';
import { query, getClient } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { tableConfigs, tableRelationships, approvalConfig } from '../config/tableConfigs';
import contentTranslationService from '../services/contentTranslationService';

// Define relation config shape
interface JoinConfig {
  table: string;
  localKey: string;
  foreignKey: string;
  type: 'left' | 'inner' | 'has_many';
  fields?: string[];
  localKeyCast?: string;
  foreignKeyCast?: string;
}

/**
 * Get translatable fields for a table
 * Returns array of field names that should be translated
 */
function getTranslatableFields(tableName: string): string[] {
  // IMPORTANT: human-text fields ONLY. Never include image/url/id/date/numeric
  // fields here — they would be sent to the translator and corrupted (this was
  // the cause of broken event thumbnails when translation ran on banner_img).
  const translatableFieldsMap: Record<string, string[]> = {
    'tb_sites': ['name', 'subtitle', 'description', 'address'],
    'tb_media': ['title', 'subtitle', 'description'],
    'tb_events': ['name', 'subtitle', 'description', 'location', 'address'],
    'tb_master_collection': ['title', 'subtitle', 'description', 'museum_name', 'condition', 'material', 'origin'],
    'tb_faqs': ['question', 'answer'],
    'tb_banner': ['title', 'subtitle'],
    'tb_memoryoftheworld': ['title', 'subtitle', 'description'],
    'tb_company': ['name', 'aboutus', 'vision', 'mission'],
    'tb_pemanfaatanasset': ['title', 'description', 'location'],
    'tb_sop': ['title', 'subtitle', 'description'],
    'tb_publication': ['title', 'description'],
    'tb_career_management': ['title', 'subtitle', 'description', 'requirement', 'responsibility'],
    'tb_laboratorium_konservasi': ['title', 'description', 'banner_title', 'banner_subtitle'],
  };

  return translatableFieldsMap[tableName] || [];
}

// Resolve target language from explicit ?lang= or the Accept-Language header
// (api-client sends Accept-Language on every request). Restricted to the app's
// two supported languages so detail pages (which omit ?lang=) also localize.
function resolveTargetLang(req: AuthRequest): string {
  const q = ((req.query.lang as string) || '').toLowerCase();
  const header = ((req.headers['accept-language'] as string) || '').toLowerCase();
  const raw = (q || header || 'id').slice(0, 2);
  return raw === 'en' ? 'en' : 'id';
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
        console.log(`[getAll] Table: ${tableName}, Query:`, req.query);
        const { limit, offset = 0, lang, ...filters } = req.query;
        
        // For admin requests, use a high limit to get all records (or use provided limit)
        const finalLimit = limit || (req.user ? 10000 : 50); // Admin gets all, others get 50
        
        console.log(`[getAll] User:`, req.user?.email, 'Limit:', finalLimit, 'Offset:', offset);
        const targetLang = resolveTargetLang(req);

        // Start with base fields
        let selectFields = `${tableName}.*`;

        // Add flat joins (belongs-to)
        const joins: string[] = [];
        for (const { name: relName, config: rel } of flatJoins) {
          if (rel.type === 'left' || rel.type === 'inner') {
            const joinSelect = buildBelongsToSelect(relName, rel);
            selectFields += `, ${joinSelect}`;

            const joinType = rel.type === 'left' ? 'LEFT JOIN' : 'INNER JOIN';
            const localKeyExpr = `${tableName}.${rel.localKey}${rel.localKeyCast || ''}`;
            const foreignKeyExpr = `${rel.table}.${rel.foreignKey}${rel.foreignKeyCast || ''}`;
            joins.push(
              `${joinType} ${rel.table} ON ${localKeyExpr} = ${foreignKeyExpr}`
            );
          }
        }

        // Add has-many subqueries (e.g., company_leadership[])
        const relations = tableRelationships[tableName as keyof typeof tableRelationships];
        if (relations) {
          for (const [relKey, relConfig] of Object.entries(relations)) {
            if (relConfig && typeof relConfig === 'object' && 'type' in relConfig && relConfig.type === 'has_many') {
              const { table: childTable, localKey, foreignKey, fields: relFields } = relConfig as JoinConfig;
              const childFields = relFields || tableConfigs[childTable as keyof typeof tableConfigs] || [];

              const jsonFields = childFields
                .filter((f: string) => f !== foreignKey) // exclude foreignKey
                .map((f: string) => `'${f}', ${childTable}.${f}`)
                .join(', ');

              selectFields += `,
                (SELECT json_agg(json_build_object(${jsonFields}))
                FROM ${childTable}
                WHERE ${childTable}.${foreignKey} = ${tableName}.id
                ) AS ${relKey}`;
            }
          }
        }

        // Build WHERE
        const whereConditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(filters)) {
          if (value === undefined || key === 'include') { continue; }

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

        if (tableName === 'tb_pemanfaatanasset') {
          selectFields += `,
            (
              SELECT COALESCE(
                json_agg(json_build_object('id', cat.id::text, 'name', cat.name))
                  FILTER (WHERE cat.id IS NOT NULL),
                '[]'::json
              )
              FROM tb_categories_layananaset_fasilitas cat
              WHERE cat.id::text = ANY (
                string_to_array(
                  NULLIF(
                    regexp_replace(${tableName}.category::text, '\\s+', '', 'g'),
                    ''
                  ),
                  ','
                )
              )
            ) AS category_relation`;
        }

        const whereClause = whereConditions.length > 0
          ? `WHERE ${whereConditions.join(' AND ')}`
          : '';

        const fromClause = [tableName, ...joins].join(' ');

        // Determine ordering based on table type
        let orderByClause;
        if (fields.includes('display_order')) {
          // Tables with manual ordering (tb_sites, tb_banner, tb_menu) honor admin-defined order
          orderByClause = `${tableName}.display_order ASC NULLS LAST, ${tableName}.created_at DESC NULLS LAST`;
        } else if (tableName === 'news_articles' || tableName === 'tb_publication') {
          // For news and publications, order by published_at first, then created_at as fallback
          orderByClause = `${tableName}.published_at DESC NULLS LAST, ${tableName}.created_at DESC NULLS LAST`;
        } else {
          // For other tables, order by created_at
          orderByClause = `${tableName}.created_at DESC NULLS LAST`;
        }

        const queryText = `
          SELECT ${selectFields}
          FROM ${fromClause}
          ${whereClause}
          ORDER BY ${orderByClause}
          LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        console.time(`[PERF] Query for ${tableName}`);
        const result = await query(queryText, [...params, finalLimit, offset]);
        console.timeEnd(`[PERF] Query for ${tableName}`);
        
        console.log(`[getAll] ${tableName}: Returned ${result.rows.length} records (limit: ${finalLimit}, offset: ${offset})`);
        
        // Translate content if language is not Indonesian and feature is enabled
        let rows = result.rows;
        const isTranslationEnabled = process.env.ENABLE_CONTENT_TRANSLATION === 'true';

        if (isTranslationEnabled && targetLang !== 'id') {
          // Define translatable fields per table
          const translatableFields = getTranslatableFields(tableName);
          if (translatableFields.length > 0) {
            rows = await contentTranslationService.translateContentArrayWithOverrides(
              rows,
              tableName,
              translatableFields,
              targetLang,
              'id'
            );
          }
        }
        
        res.json(rows);
      } catch (error) {
        console.error(`Get all ${tableName} error:`, error);
        if (error instanceof Error) {
          console.error(error.stack);
        }
        res.status(500).json({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    },

    // === GET BY ID ===
    getById: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const targetLang = resolveTargetLang(req);

        console.log(`[getById] Fetching ${tableName} with ID: ${id}`);

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          return res.status(400).json({
            error: 'Invalid ID format',
            details: 'ID must be a valid UUID format'
          });
        }

        // Base query
        const baseResult = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        if (baseResult.rows.length === 0) {
          console.log(`[getById] Record not found: ${tableName} ${id}`);
          return res.status(404).json({ error: 'Record not found' });
        }

        let record = baseResult.rows[0];
        console.log(`[getById] Found base record for ${tableName} ${id}`);

        // Add flat joins (belongs-to)
        for (const { name: relName, config: rel } of flatJoins) {
          const joinSelect = buildBelongsToSelect(relName, rel);
          if (joinSelect) {
            const localValue = (record as Record<string, unknown>)[rel.localKey];
            if (localValue === undefined || localValue === null || localValue === '') {
              continue;
            }

            const joinResult = await query(
              `SELECT ${joinSelect}
               FROM ${rel.table}
               WHERE ${rel.table}.${rel.foreignKey}${rel.foreignKeyCast || ''} = $1`,
              [localValue]
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
            // Only "has many" relationships
            if (relConfig && typeof relConfig === 'object' && 'type' in relConfig && (relConfig as JoinConfig).type === 'has_many') {
              const { table: childTable, localKey, foreignKey, fields: relFields } = relConfig as JoinConfig;
              const childFields = relFields || Object.keys(tableConfigs[childTable as keyof typeof tableConfigs] || {});

              const jsonFields = childFields
                .filter((f: string) => f !== foreignKey) // exclude foreignKey column
                .map((f: string) => `'${f}', ${childTable}.${f}`)
                .join(', ');

              try {
                const result = await query(
                  `SELECT json_agg(json_build_object(${jsonFields})) AS data
                   FROM ${childTable}
                   WHERE ${childTable}.${foreignKey} = $1`,
                  [id]
                );

                record[relKey] = result.rows[0].data || [];
              } catch (error) {
                console.error(`Error fetching ${relKey} for ${tableName} ${id}:`, error);
                record[relKey] = [];
              }
            }
          }
        }

        if (tableName === 'tb_pemanfaatanasset') {
          const categoryResult = await query(
            `SELECT COALESCE(
                json_agg(json_build_object('id', cat.id::text, 'name', cat.name))
                  FILTER (WHERE cat.id IS NOT NULL),
                '[]'::json
              ) AS categories
             FROM tb_categories_layananaset_fasilitas cat
             WHERE cat.id::text = ANY (
               string_to_array(
                 NULLIF(
                   regexp_replace($1::text, '\\s+', '', 'g'),
                   ''
                 ),
                 ','
               )
             )`,
            [record.category]
          );

          record.category_relation = categoryResult.rows[0]?.categories ?? [];
        }

        // Translate content if language is not Indonesian
        if (targetLang !== 'id') {
          const translatableFields = getTranslatableFields(tableName);
          if (translatableFields.length > 0) {
            record = await contentTranslationService.translateContentWithOverrides(
              record,
              tableName,
              translatableFields,
              targetLang,
              'id'
            );
          }
        }
        
        res.json(record);
      } catch (error) {
        console.error(`Get ${tableName} by ID error:`, error);
        
        // Handle specific PostgreSQL UUID errors
        if (error instanceof Error) {
          const errorMessage = error.message;
          
          if (errorMessage.includes('invalid input syntax for type uuid')) {
            return res.status(400).json({
              error: 'Invalid ID format',
              details: 'ID must be a valid UUID format'
            });
          }
          
          if (errorMessage.includes('bind message supplies')) {
            return res.status(400).json({
              error: 'Invalid request parameters',
              details: 'The provided parameters do not match the expected format'
            });
          }
        }
        
        res.status(500).json({ 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
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

        if (tableName === 'tb_sites' && typeof insertData.opening_hours === 'string') {
          try {
            insertData.opening_hours = JSON.parse(insertData.opening_hours);
          } catch {
            return res.status(400).json({
              error: 'Invalid JSON in opening_hours'
            });
          }
        } else if (tableName === 'tb_sites' && typeof insertData.facilities === 'string') {
          try {
            insertData.facilities = JSON.parse(insertData.facilities);
          } catch {
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

        if (fields.includes('is_approved') && insertData.is_approved === undefined) {
          insertData.is_approved = false;
        }

        if (fields.includes('is_rejected') && insertData.is_rejected === undefined) {
          insertData.is_rejected = false;
        }

        if (fields.includes('reason_rejected') && insertData.reason_rejected === undefined) {
          insertData.reason_rejected = '';
        }

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
  tb_laboratorium_konservasi: ['gallery_images'],
  // tb_pemanfaatanasset: ['description', 'fasilitas', 'fasilitas_tambahan', 'ketentuan_umum'],
};
        const jsonFieldsForTable = JSON_FIELDS[tableName] || [];

        const values = validFields.map((f) => {
          const v = insertData[f];
          if (jsonFieldsForTable.includes(f)) {
            // If it's already a string, check if it's valid JSON or empty
            if (typeof v === 'string') {
              // If empty string, return empty array JSON
              if (v.trim() === '') return '[]';
              return v;
            }
            // If it's an object/array, stringify it
            if (v !== undefined && v !== null) {
              return JSON.stringify(v);
            }
            // If null, return null (will be cast to jsonb null)
            return null;
          }
          return v;
        });

        const placeholders = validFields
          .map((f, i) => (jsonFieldsForTable.includes(f) ? `$${i + 1}::jsonb` : `$${i + 1}`))
          .join(', ');

        // Store for error logging
        const debugInfo = {
          tableName,
          validFields,
          placeholders,
          values,
          insertDataKeys: Object.keys(insertData)
        };

        await client.query('BEGIN');
        
        // Debug logging
        console.log(`[CREATE] ${tableName} - validFields:`, validFields);
        console.log(`[CREATE] ${tableName} - placeholders:`, placeholders);
        console.log(`[CREATE] ${tableName} - values:`, values);
        console.log(`[CREATE] ${tableName} - insertData keys:`, Object.keys(insertData));
        
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
            const caption = item.caption || '';
            if (!filePath) { continue; }
            await client.query(
              `INSERT INTO tb_memoryoftheworld_gallery (id, id_memoryoftheworld, upload_file, caption, created_by, updated_by, created_at, is_active, is_approved, is_rejected)
               VALUES ($1, $2, $3, $4, $5, $5, $6, true, true, false)`,
              [uuidv4(), id, filePath, caption, createdBy, new Date()]
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
              (SELECT json_agg(json_build_object('id', g.id, 'id_memoryoftheworld', g.id_memoryoftheworld, 'upload_file', g.upload_file, 'caption', g.caption))
               FROM tb_memoryoftheworld_gallery g WHERE g.id_memoryoftheworld = m.id) AS galleries
             FROM tb_memoryoftheworld m WHERE m.id = $1`,
            [id]
          );
          return res.status(201).json(result.rows[0]);
        }

        res.status(201).json({ id, ...insertData });
      } catch (error) {
        await client.query('ROLLBACK');
        const err = error as any;
        console.error(`Create ${tableName} error:`, error);
        console.error(`Error stack:`, err.stack);
        console.error(`Error details:`, {
          message: err.message,
          detail: err.detail,
          hint: err.hint,
          code: err.code,
          tableName: tableName
        });
        res.status(500).json({ 
          error: 'Failed to create record',
          details: err.message || 'Unknown error',
          debug: {
            tableName: tableName,
            message: err.message,
            detail: err.detail,
            code: err.code
          }
        });
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
          images: rawImages,
          gallery: rawGallery,
          company_leadership: rawCompanyLeadership,
          company_visitor: rawCompanyVisitor,
          ...mainData // All top-level fields
        } = input as Record<string, any>;

        const hasImagesField = rawImages !== undefined;
        const hasGalleryField = rawGallery !== undefined;

        const images = Array.isArray(rawImages) ? rawImages : [];
        const gallery = Array.isArray(rawGallery) ? rawGallery : [];
        const companyLeadership = Array.isArray(rawCompanyLeadership) ? rawCompanyLeadership : [];
        const companyVisitor = Array.isArray(rawCompanyVisitor) ? rawCompanyVisitor : [];
        console.log(`[UPDATE] ${tableName} gallery:`, JSON.stringify(gallery, null, 2));
        console.log(`[UPDATE] ${tableName} raw body:`, JSON.stringify(req.body, null, 2));

        // Add metadata
        const data: Record<string, any> = {
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

        if (fields.includes('reason_rejected') && data.reason_rejected === undefined) {
          data.reason_rejected = '';
        }

        // Approval logic: only approver/admin (and super-admin) may change moderation flags
        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (approvalSettings?.requiresApproval) {
          const userRoles = req.user?.roles || [];
          const canModerate = userRoles.includes('approver') || userRoles.includes('admin') || userRoles.includes('super-admin');

          if (!canModerate) {
            if (Object.prototype.hasOwnProperty.call(data, 'is_approved')) {
              // Strip attempted changes from non-approver/admin edits so regular updates don't fail
              delete (data as any).is_approved;
            }

            if (Object.prototype.hasOwnProperty.call(data, 'is_rejected')) {
              delete (data as any).is_rejected;
            }

            if (fields.includes('is_rejected')) {
              (data as any).is_rejected = false;
            }
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
          (tableName === 'tb_sites' && hasImagesField) ||
          (tableName === 'tb_memoryoftheworld' && hasGalleryField);

        if (!hasMainUpdates && !hasNestedUpdates) {
          return res.status(400).json({ error: 'No data to update' });
        }

        // Start transaction
        await client.query('BEGIN');

        // 🔹 1. Update main record (if there are fields)
        if (hasMainUpdates) {
          const JSON_FIELDS: Record<string, string[]> = {
            tb_sites: ['opening_hours'],
            tb_laboratorium_konservasi: ['gallery_images'],
            // tb_pemanfaatanasset: ['description', 'fasilitas', 'fasilitas_tambahan', 'ketentuan_umum'],
          };
          const jsonFieldsForTable = JSON_FIELDS[tableName] || [];

          const setClause = validFields
            .map((f, i) => `${f} = $${i + 2}${jsonFieldsForTable.includes(f) ? '::jsonb' : ''}`)
            .join(', ');

          const values = [
            id,
            ...validFields.map((f) => {
              const v = data[f];
              if (jsonFieldsForTable.includes(f)) {
                if (typeof v === 'string') {
                  if (v.trim() === '') return '[]';
                  return v;
                }
                if (v !== undefined && v !== null) {
                  return JSON.stringify(v);
                }
                return null;
              }
              return v;
            }),
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
        if (tableName === 'tb_sites' && hasImagesField) {
          const existingImages = await client.query(
            `SELECT id FROM tb_images WHERE sites_id = $1`,
            [id]
          );

          const remainingIds = new Set<string>(
            existingImages.rows.map((row: { id: string }) => row.id)
          );

          for (const img of images as any[]) {
            if (!img) { continue; }

            const imageId = img.id as string | undefined;
            const filePath = img.path || img.upload_file || img.url;

            if (img.is_deleted && imageId) {
              await client.query(
                `DELETE FROM tb_images WHERE id = $1 AND sites_id = $2`,
                [imageId, id]
              );
              remainingIds.delete(imageId);
              continue;
            }

            if (imageId) {
              remainingIds.delete(imageId);

              if (filePath) {
                await client.query(
                  `UPDATE tb_images
                  SET path = $1, updated_by = $2, updated_at = $3
                  WHERE id = $4 AND sites_id = $5`,
                  [filePath, updatedBy, new Date(), imageId, id]
                );
              }
            } else if (filePath) {
              await client.query(
                `INSERT INTO tb_images (id, path, sites_id, created_by, updated_by, created_at)
                VALUES ($1, $2, $3, $4, $4, $5)`,
                [uuidv4(), filePath, id, updatedBy, new Date()]
              );
            }
          }

          if (remainingIds.size > 0) {
            await client.query(
              `DELETE FROM tb_images WHERE id = ANY($1::uuid[]) AND sites_id = $2`,
              [Array.from(remainingIds), id]
            );
          }
        }

        // 🔹 4. Handle gallery for tb_memoryoftheworld
        if (tableName === 'tb_memoryoftheworld') {
          for (const item of gallery as any[]) {
            const filePath = item.path || item.upload_file;
            const caption = item.caption || '';
            if (item?.is_deleted && item.id) {
              await client.query(
                `DELETE FROM tb_memoryoftheworld_gallery WHERE id = $1 AND id_memoryoftheworld = $2`,
                [item.id, id]
              );
            } else if (item.id) {
              await client.query(
                `UPDATE tb_memoryoftheworld_gallery
                 SET upload_file = $1, caption = $2, updated_by = $3, updated_at = $4
                 WHERE id = $5 AND id_memoryoftheworld = $6`,
                [filePath, caption, updatedBy, new Date(), item.id, id]
              );
            } else if (filePath) {
              // Check for duplicates before inserting
              const existing = await client.query(
                `SELECT id FROM tb_memoryoftheworld_gallery WHERE id_memoryoftheworld = $1 AND upload_file = $2`,
                [id, filePath]
              );

              if (existing.rows.length === 0) {
                await client.query(
                  `INSERT INTO tb_memoryoftheworld_gallery (id, id_memoryoftheworld, upload_file, caption, created_by, updated_by, created_at, is_active, is_approved, is_rejected)
                   VALUES ($1, $2, $3, $4, $5, $5, $6, true, true, false)`,
                  [uuidv4(), id, filePath, caption, updatedBy, new Date()]
                );
              }
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
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Not found' });
        }
        res.json({ message: 'Deleted successfully', id });
      } catch (error) {
        console.error(`Delete ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // === REORDER ===
    reorder: async (req: AuthRequest, res: Response) => {
      const client = await getClient();
      try {
        if (!fields.includes('display_order')) {
          return res.status(400).json({ error: `Reordering not supported for table: ${tableName}` });
        }

        const { items } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'items must be a non-empty array of { id, display_order }' });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        for (const item of items) {
          if (!item || !uuidRegex.test(String(item.id)) || !Number.isInteger(Number(item.display_order))) {
            return res.status(400).json({ error: 'Each item must have a valid UUID id and integer display_order' });
          }
        }

        const idUser = req.user?.id;
        const hasUpdatedBy = fields.includes('updated_by');

        await client.query('BEGIN');
        for (const item of items) {
          const setClauses = ['display_order = $2', 'updated_at = NOW()'];
          const params: any[] = [item.id, Number(item.display_order)];
          if (hasUpdatedBy && idUser) {
            setClauses.push(`updated_by = $${params.length + 1}`);
            params.push(idUser);
          }
          await client.query(
            `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE id = $1`,
            params
          );
        }
        await client.query('COMMIT');

        res.json({ message: 'Order updated successfully', count: items.length });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Reorder ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to update order' });
      } finally {
        client.release();
      }
    },

    // === INCREMENT DOWNLOAD COUNT (public) ===
    incrementDownload: async (req: AuthRequest, res: Response) => {
      try {
        if (!fields.includes('download_count')) {
          return res.status(400).json({ error: `Download count not supported for table: ${tableName}` });
        }
        const { id } = req.params;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(id))) {
          return res.status(400).json({ error: 'Invalid id' });
        }
        const result = await query(
          `UPDATE ${tableName} SET download_count = COALESCE(download_count, 0) + 1 WHERE id = $1 RETURNING download_count`,
          [id]
        );
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ download_count: result.rows[0].download_count });
      } catch (error) {
        console.error(`Increment download ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to increment download count' });
      }
    },

    // === APPROVE ===
    approve: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const idUser = req.user?.id;

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

        const hasIsActive = fields.includes('is_active');
        const hasIsPublished = fields.includes('is_published');
        const hasReason = fields.includes('reason_rejected');

        const params: any[] = [id];
        const setClauses = [
          'is_approved = true',
          'is_rejected = false'
        ];

        if (hasReason) {
          setClauses.push("reason_rejected = ''");
        }

        if (hasIsActive) {
          setClauses.push(`is_active = CASE WHEN $${params.length + 1} THEN true ELSE is_active END`);
          params.push(autoActivate);
        } else if (hasIsPublished && autoActivate) {
          // For tables without is_active but with is_published (like merchandise_products)
          setClauses.push(`is_published = CASE WHEN $${params.length + 1} THEN true ELSE is_published END`);
          params.push(autoActivate);
        }

        if (fields.includes('updated_by')) {
          setClauses.push(`updated_by = $${params.length + 1}`);
          params.push(idUser);
        }

        setClauses.push(`updated_at = $${params.length + 1}`);
        params.push(now);

        const result = await query(
          `
          UPDATE ${tableName}
          SET 
            ${setClauses.join(',\n            ')}
          WHERE id = $1
          RETURNING *
          `,
          params
        );

        res.json({
          message: 'Record approved successfully',
          data: result.rows[0]
        });
      } catch (error) {
        console.error(`Approve ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to approve record' });
      }
    },

    // === REJECT ===
    reject: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const idUser = req.user?.id;
        const { reason_rejected } = req.body || {};

        const hasReasonField = fields.includes('reason_rejected');
        const computedReason = typeof reason_rejected === 'string' ? reason_rejected.trim() : '';

        if (hasReasonField && computedReason.length === 0) {
          return res.status(400).json({ error: 'Rejection reason is required' });
        }

        const approvalSettings = (approvalConfig as Record<string, any>)[tableName];
        if (!approvalSettings?.requiresApproval) {
          return res.status(400).json({ error: `Rejection not supported for table: ${tableName}` });
        }

        const userRoles = req.user?.roles || [];
        if (!userRoles.includes('approver') && !userRoles.includes('super-admin')) {
          return res.status(403).json({ error: 'You do not have permission to reject records.' });
        }

        const checkQuery = await query(
          `SELECT is_approved, is_rejected FROM ${tableName} WHERE id = $1`,
          [id]
        );

        if (checkQuery.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        const { is_approved, is_rejected } = checkQuery.rows[0];

        if (is_rejected) {
          return res.status(400).json({ error: 'Record is already rejected' });
        }

        if (is_approved) {
          return res.status(400).json({ error: 'Record is already approved' });
        }

        const now = new Date().toISOString();
        const hasIsActive = fields.includes('is_active');
        const hasIsPublished = fields.includes('is_published');

        const params: any[] = [id];
        const setClauses = [
          'is_rejected = true',
          'is_approved = false'
        ];

        if (hasIsActive) {
          setClauses.push('is_active = false');
        } else if (hasIsPublished) {
          // For tables without is_active but with is_published (like merchandise_products)
          setClauses.push('is_published = false');
        }

        if (hasReasonField) {
          setClauses.push(`reason_rejected = $${params.length + 1}`);
          params.push(computedReason);
        }

        if (fields.includes('updated_by')) {
          setClauses.push(`updated_by = $${params.length + 1}`);
          params.push(idUser);
        }

        setClauses.push(`updated_at = $${params.length + 1}`);
        params.push(now);

        const result = await query(
          `
          UPDATE ${tableName}
          SET 
            ${setClauses.join(',\n            ')}
          WHERE id = $1
          RETURNING *
          `,
          params
        );

        res.json({
          message: 'Record rejected successfully',
          data: result.rows[0]
        });
      } catch (error) {
        console.error(`Reject ${tableName} error:`, error);
        res.status(500).json({ error: 'Failed to reject record' });
      }
    }
  };
};
