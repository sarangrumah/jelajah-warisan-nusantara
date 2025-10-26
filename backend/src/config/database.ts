import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🔍 Database Configuration:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

const isProduction = process.env.NODE_ENV === 'production';
const isRemoteDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (isProduction || isRemoteDb) {
  config.ssl = {
    rejectUnauthorized: false // Default for self-signed certs
  };

  const caPath = process.env.DB_SSL_CA_PATH;
  if (caPath) {
    try {
      const certPath = path.resolve(caPath);
      if (fs.existsSync(certPath)) {
        config.ssl.ca = fs.readFileSync(certPath).toString();
        config.ssl.rejectUnauthorized = true; // Enforce verification with provided CA
        console.log(`[DB] SSL CA certificate loaded from: ${certPath}`);
      } else {
        console.error(`[DB] WARNING: DB_SSL_CA_PATH is set, but file not found at ${certPath}`);
      }
    } catch (error) {
      console.error(`[DB] ERROR: Failed to read SSL certificate file:`, error);
    }
  }
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