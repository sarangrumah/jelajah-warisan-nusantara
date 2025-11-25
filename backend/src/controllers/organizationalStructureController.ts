import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM organizational_structure WHERE is_active = true ORDER BY "order" ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminEmployees = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM organizational_structure ORDER BY "order" ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching employees for admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  const { name, role, image_url, level, order, birth_date, education_history, career_history, is_active } = req.body;
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO organizational_structure 
      (name, role, image_url, level, "order", birth_date, education_history, career_history, is_active) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [name, role, image_url, level, order || 0, birth_date, JSON.stringify(education_history || []), JSON.stringify(career_history || []), is_active ?? true]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, image_url, level, order, birth_date, education_history, career_history, is_active } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE organizational_structure 
      SET name = $1, role = $2, image_url = $3, level = $4, "order" = $5, birth_date = $6, education_history = $7, career_history = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *`,
      [name, role, image_url, level, order, birth_date, JSON.stringify(education_history), JSON.stringify(career_history), is_active, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM organizational_structure WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};