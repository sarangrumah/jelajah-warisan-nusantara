import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrate = async () => {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, '../../../../database/update_schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Database migration completed successfully.');
  } catch (err) {
    console.error('Error during database migration:', err);
  } finally {
    client.release();
  }
};

migrate();