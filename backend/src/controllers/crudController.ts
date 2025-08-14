import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

// Generic CRUD controller factory
export const createCrudController = (tableName: string, fields: string[]) => {
  return {
    // Get all records
    getAll: async (req: AuthRequest, res: Response) => {
      try {
        const { limit = 50, offset = 0, ...filters } = req.query;
        
        let whereClause = '';
        const params: any[] = [];
        let paramIndex = 1;

        // Build WHERE clause from query parameters
        if (Object.keys(filters).length > 0) {
          const conditions: string[] = [];
          for (const [key, value] of Object.entries(filters)) {
            if (fields.includes(key) && value !== undefined) {
              if (key === 'search' && (tableName === 'news_articles' || tableName === 'agenda_items')) {
                conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
                params.push(`%${value}%`);
              } else {
                conditions.push(`${key} = $${paramIndex}`);
                params.push(value);
              }
              paramIndex++;
            }
          }
          if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
          }
        }

        // Default to published items for public tables
        if (fields.includes('is_published') && !filters.is_published) {
          whereClause = whereClause ? `${whereClause} AND is_published = true` : 'WHERE is_published = true';
        }

        const result = await query(
          `SELECT * FROM ${tableName} ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
          [...params, limit, offset]
        );

        res.json(result.rows);
      } catch (error) {
        console.error(`Get all ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // Get single record by ID
    getById: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Get ${tableName} by ID error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // Create new record
    create: async (req: AuthRequest, res: Response) => {
      try {
        const data = req.body;
        const id = uuidv4();
        
        // Add metadata
        data.id = id;
        data.created_at = new Date();
        data.updated_at = new Date();
        if (fields.includes('created_by') && req.user) {
          data.created_by = req.user.id;
        }

        // Build INSERT query
        const validFields = fields.filter(field => data[field] !== undefined);
        const placeholders = validFields.map((_, index) => `$${index + 1}`).join(', ');
        const values = validFields.map(field => data[field]);

        const result = await query(
          `INSERT INTO ${tableName} (${validFields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
          values
        );

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error(`Create ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // Update record
    update: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const data = req.body;
        
        // Add metadata
        data.updated_at = new Date();

        // Build UPDATE query
        const validFields = fields.filter(field => 
          data[field] !== undefined && field !== 'id' && field !== 'created_at'
        );
        
        if (validFields.length === 0) {
          return res.status(400).json({ error: 'No valid fields to update' });
        }

        const setClause = validFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const values = [id, ...validFields.map(field => data[field])];

        const result = await query(
          `UPDATE ${tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
          values
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error(`Update ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    // Delete record
    delete: async (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        
        const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }

        res.json({ message: 'Record deleted successfully', id });
      } catch (error) {
        console.error(`Delete ${tableName} error:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};