import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Database Configuration:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Use DATABASE_URL if available, otherwise use individual environment variables
let config: PoolConfig;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL);
  config = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace('/', ''),
    ssl: false
  };
} else {
  config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mcb_db',
    ssl: false // Disable SSL for local connections
  };
}

const pool = new Pool(config);

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
  console.log('🔎 Database Query:', text);
  console.log('🔎 Query Params:', params);
  return pool.query(text, params);
};

export const getClient = () => {
  return pool.connect();
};

export default pool;