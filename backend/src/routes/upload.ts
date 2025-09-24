import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// --- Helpers: filename sanitization + uniqueness ---
const sanitizeFilename = (originalName: string) => {
  const ext = path.extname(originalName || '').toLowerCase();
  const base = path
    .basename(originalName || '', ext)
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces -> dashes
    .replace(/[^a-z0-9-_\.]/g, ''); // remove unsafe chars
  const safeBase = base || 'file';
  return { base: safeBase, ext: ext || '' };
};

const ensureUniqueFilename = (dir: string, desired: string) => {
  const { base, ext } = sanitizeFilename(desired);
  let candidate = `${base}${ext}`;
  let counter = 1;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${base}-${counter}${ext}`;
    counter += 1;
  }
  return candidate;
};

// Ensure upload directories exist
// Use an absolute path relative to this file for reliability
// Store uploads under backend/uploads (not under src) to avoid Vite HMR
const uploadDir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../../uploads');

const DEFAULT_BUCKET = 'images';
const bucketWhitelist = [
  'documents',
  'cv-uploads',
  'transcripts',
  'cover-letters',
  'images',
  'hero-sections',
  'sites',
  'events',
  'museum',
  'memory-thumbnails'
];

const allowedBuckets = new Set(bucketWhitelist);

const ensureBucketPath = (bucket: string) => {
  // Special case: for images/hero-section, always use absolute path to src/assets/images/hero-section
  if (bucket === 'images/hero-section') {
    const target = path.resolve(__dirname, '../../../src/assets/images/hero-section');
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    return target;
  }
  // Support nested buckets, e.g., "images/hero-section"
  const safeBucket = bucket
    .split('/')
    .map(seg => seg.replace(/[^a-zA-Z0-9-_]/g, '')) // sanitize each segment
    .filter(Boolean)
    .join('/');
  const target = path.join(uploadDir, safeBucket);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  return target;
};

const resolveBucket = (rawBucket: any) => {
  // Allow nested buckets like "images/hero-section"
  const candidate = typeof rawBucket === 'string' && rawBucket.trim().length > 0
    ? rawBucket.trim().toLowerCase()
    : DEFAULT_BUCKET;

  // Allow "images/hero-section" and similar
  if (
    allowedBuckets.has(candidate) ||
    candidate.startsWith('images/') ||
    candidate.startsWith('documents/') ||
    candidate.startsWith('cv-uploads/') ||
    candidate.startsWith('transcripts/') ||
    candidate.startsWith('cover-letters/')
  ) {
    return candidate;
  }

  return DEFAULT_BUCKET;
};

bucketWhitelist.forEach(ensureBucketPath);

// File filter for PDF files
const pdfFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// File filter for images
const imageFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration for different buckets
const createMulterConfig = (bucket: string, fileFilter: any, sizeLimit: number) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          cb(null, ensureBucketPath(bucket));
        } catch (err) {
          cb(err as Error, uploadDir);
        }
      },
      filename: (req, file, cb) => {
        try {
          const dir = ensureBucketPath(bucket);
          const finalName = ensureUniqueFilename(dir, file.originalname);
          cb(null, finalName);
        } catch (err) {
          const fallback = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, fallback);
        }
      }
    }),
    fileFilter,
    limits: { fileSize: sizeLimit }
  });
};

// Different upload configurations
const uploadPDF = createMulterConfig('documents', pdfFileFilter, 10 * 1024 * 1024); // 10MB
const uploadCV = createMulterConfig('cv-uploads', pdfFileFilter, 5 * 1024 * 1024); // 5MB
const uploadTranscript = createMulterConfig('transcripts', pdfFileFilter, 5 * 1024 * 1024); // 5MB
const uploadCoverLetter = createMulterConfig('cover-letters', pdfFileFilter, 5 * 1024 * 1024); // 5MB
// Generic upload endpoint that handles different buckets
const uploadMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        const bucket = resolveBucket(req.body.bucket);
        const bucketPath = ensureBucketPath(bucket);
        cb(null, bucketPath);
      } catch (err) {
        cb(err as Error, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      try {
        const bucket = resolveBucket(req.body.bucket);
        const dir = ensureBucketPath(bucket);
        const finalName = ensureUniqueFilename(dir, file.originalname);
        cb(null, finalName);
      } catch (e) {
        const fallback = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fallback);
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    const bucket = resolveBucket(req.body.bucket);
    const pdfBuckets = new Set(['documents', 'cv-uploads', 'transcripts', 'cover-letters']);

    if (pdfBuckets.has(bucket)) {
      // PDF files for these buckets
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else {
      // Allow image and video files for general buckets
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Generic upload endpoint
router.post('/', authenticateToken, uploadMulter.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const bucket = resolveBucket(req.body.bucket);
  // Debug log: where is the file being saved?
  console.log('[UPLOAD DEBUG] bucket:', bucket, 'req.file.path:', req.file.path, 'req.file.filename:', req.file.filename);

  // Unified public URL path under /uploads (avoid src/assets to prevent Vite HMR)
  // Return the public URL for the uploaded file (for frontend preview)
  // If bucket is nested (e.g., images/hero-section), reflect that in the URL
  const safeBucket = bucket
    .split('/')
    .map(seg => seg.replace(/[^a-zA-Z0-9-_]/g, ''))
    .filter(Boolean)
    .join('/');
  // Debug: log bucket and safeBucket
  console.log('[UPLOAD DEBUG] bucket:', bucket, 'safeBucket:', safeBucket, 'filename:', req.file.filename);

  // If uploading to images/hero-section, return /assets/images/hero-section/filename as the URL
  let fileUrl;
  if (safeBucket === 'images/hero-section') {
    fileUrl = `/assets/images/hero-section/${req.file.filename}`;
  } else {
    fileUrl = `/uploads/${safeBucket}/${req.file.filename}`;
  }

  // Debug: print absolute file path and existence
  console.log('[UPLOAD DEBUG] req.file.path:', req.file.path, 'exists:', fs.existsSync(req.file.path));

  // Debug: log the fileUrl being returned
  console.log('[UPLOAD DEBUG] Returning fileUrl:', fileUrl);

  res.json({
    message: 'File uploaded successfully',
    file: {
      url: fileUrl,
      relative_url: fileUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

// API: Copy an uploaded image to src/assets/images/hero-section for static asset use
router.post('/copy-to-assets', authenticateToken, (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid filename' });
    }

    // Only allow copying from backend/uploads/images
    const sourceDir = path.resolve(__dirname, '../../uploads/images');
    const sourcePath = path.join(sourceDir, filename);

    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ error: 'Source file not found' });
    }

    // Target: src/assets/images/hero-section
    const targetDir = path.resolve(__dirname, '../../../src/assets/images/hero-section');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    // Ensure unique filename in target
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    let targetFilename = filename;
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, targetFilename))) {
      targetFilename = `${base}-${counter}${ext}`;
      counter += 1;
    }
    const targetPath = path.join(targetDir, targetFilename);

    fs.copyFileSync(sourcePath, targetPath);

    // Return the new static asset path
    const assetPath = `/assets/images/hero-section/${targetFilename}`;
    return res.json({
      message: 'File copied to static assets',
      assetPath,
      filename: targetFilename
    });
  } catch (err) {
    console.error('[copy-to-assets] Error:', err);
    return res.status(500).json({ error: 'Failed to copy file to static assets' });
  }
});

// Upload routes
router.post('/documents', authenticateToken, uploadPDF.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `../src/assets/documents/${req.file.filename}`;
  res.json({
    message: 'File uploaded successfully',
    file: {
      url: fileUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

router.post('/cv-uploads', uploadCV.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `../src/assets/cv-assets/${req.file.filename}`;
  res.json({
    message: 'CV uploaded successfully',
    file: {
      url: fileUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

router.post('/transcripts', uploadTranscript.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `../src/assets/transcripts/${req.file.filename}`;
  res.json({
    message: 'Transcript uploaded successfully',
    file: {
      url: fileUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

router.post('/cover-letters', uploadCoverLetter.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `../src/assets/cover-letters/${req.file.filename}`;
  res.json({
    message: 'Cover letter uploaded successfully',
    file: {
      url: fileUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

// // Kept for backward compatibility; now also writes to backend assets/hero-sections
// router.post('/images', authenticateToken, multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, heroSectionsPath),
//     filename: (req, file, cb) => cb(null, ensureUniqueFilename(heroSectionsPath, file.originalname))
//   }),
//   fileFilter: imageFileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// }).single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
  
//   const fileUrl = `/assets/hero-sections/${req.file.filename}`;
//   const relativeUrl = `..${fileUrl}`;
//   res.json({
//     message: 'Image uploaded successfully',
//     file: {
//       url: fileUrl,
//       relative_url: relativeUrl,
//       name: req.file.filename,
//       originalName: req.file.originalname,
//       size: req.file.size,
//       type: req.file.mimetype
//     }
//   });
// });

// Serve uploaded files
router.use('/uploads', (req, res, next) => {
  // Add appropriate headers for file serving
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

export default router;
