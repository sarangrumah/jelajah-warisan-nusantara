import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import uploadRoutes from './routes/upload';
import usersRoutes from './routes/users';
import activityLogRoutes from './routes/activityLog';
import translationCacheRoutes from './routes/translationCache';

// Import translation utilities
import { warmUpCache, getCacheStats, clearTranslationCache } from './middleware/translateResponse';
import pool from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DEBUG: Log __dirname and uploadBase to verify static path resolution
console.log('DEBUG __dirname:', __dirname);
const uploadBase = process.env.UPLOAD_PATH
  ? path.resolve(process.env.UPLOAD_PATH)
  : path.resolve(__dirname, '../../uploads');
console.log('DEBUG uploadBase:', uploadBase);

import { globalActivityLogger } from './middleware/activityLogger';

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
// Original localhost-only config (commented for reference)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200
// }));

// Updated CORS configuration to support both development and production
app.use(cors({
  origin: [
    // Development origins
    'http://localhost:5173',
    'http://localhost:5177',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    // Production origins
    'https://museumcagarbudaya.kemenbud.go.id',
    'https://www.museumcagarbudaya.kemenbud.go.id',
    'http://museumcagarbudaya.kemenbud.go.id',
    'http://www.museumcagarbudaya.kemenbud.go.id'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use('/api', limiter);

// Stricter rate limit for auth routes
// const authLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 auth requests per windowMs
//   message: 'Too many authentication attempts, please try again later.',
// });
// app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global activity logger (logs all requests)
app.use(globalActivityLogger);


// Serve static files for uploaded contents
// Allow overriding upload base via UPLOAD_PATH to keep uploads outside project root (avoids Vite HMR watching)
/* (moved above for debug logging)
const uploadBase = process.env.UPLOAD_PATH
  ? path.resolve(process.env.UPLOAD_PATH)
  : path.resolve(__dirname, '../../uploads');
*/
app.use('/uploads', express.static(uploadBase));

// Serve frontend static files (production build)
const frontendDir = path.resolve(__dirname, '../../public');
app.use(express.static(frontendDir));

// Serve assets from project root src/assets (outside backend)
const assetsDir = fs.existsSync(path.resolve(__dirname, '../../../src/assets'))
  ? path.resolve(__dirname, '../../../src/assets')
  : path.resolve(process.cwd(), 'src/assets');

app.use('/assets', express.static(assetsDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes - MUST be registered BEFORE the fallback route
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/translation-cache', translationCacheRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }
  
  if (error.message.includes('Only PDF files are allowed')) {
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }
  
  if (error.message.includes('Only image files are allowed')) {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Fallback: serve index.html for any non-API route (client-side routing)
// IMPORTANT: This MUST be after all API routes and error handling to avoid catching API requests
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    // If we somehow reach here for an API route, return 404
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📱 Main API: http://localhost:${PORT}/api`);
  console.log(`📁 Upload API: http://localhost:${PORT}/api/upload`);
  console.log(`🌐 Translation middleware: Active (Local LibreTranslate)`);
  
  // Warm up translation cache with popular content
  // try {
  //   await warmUpCache(pool);
  //   const stats = getCacheStats();
  //   console.log(`💾 Translation cache ready: ${stats.totalTranslations} translations (${stats.cacheSizeKB} KB)`);
  // } catch (error) {
  //   console.error('⚠️  Failed to warm up cache:', error);
  // }
});

export default app;
