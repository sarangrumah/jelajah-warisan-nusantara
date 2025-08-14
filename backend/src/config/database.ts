import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Database Configuration:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully');
    client.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
  });

export const query = (text: string, params?: any[]) => {
  console.log('🔎 Database Query:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
  console.log('🔎 Query Params:', params);
  return pool.query(text, params);
};

export const getClient = () => {
  return pool.connect();
};

export default pool;