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
    .replace(/[^a-z0-9-_.]/g, ''); // remove unsafe chars
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
  'memory-thumbnails',
  'publication'
];

const allowedBuckets = new Set(bucketWhitelist);

const ensureBucketPath = (bucket: string) => {
  const target = path.join(uploadDir, bucket);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  return target;
};

const resolveBucket = (rawBucket: any) => {
  const candidate = typeof rawBucket === 'string' && rawBucket.trim().length > 0
    ? rawBucket.trim().toLowerCase()
    : DEFAULT_BUCKET;

  if (allowedBuckets.has(candidate)) {
    return candidate;
  }

  return DEFAULT_BUCKET;
};

bucketWhitelist.forEach(ensureBucketPath);

// Enhanced file validation functions
const validatePDFFile = (file: any): boolean => {
  // Check MIME type
  if (file.mimetype !== 'application/pdf') {
    return false;
  }
  
  // Check file extension
  if (!file.originalname.toLowerCase().endsWith('.pdf')) {
    return false;
  }
  
  // Check for potential malicious file names
  const maliciousPatterns = [
    /\.\.\//, // Path traversal
    /\/\//,   // Double slash
    /\\/,     // Backslash (Windows paths)
    /\.(exe|bat|cmd|sh|js|html|htm|php|py|rb|pl)$/i, // Executable or script extensions
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(file.originalname)) {
      return false;
    }
  }
  
  return true;
};

// File filter for PDF files
const pdfFileFilter = (req: any, file: any, cb: any) => {
  if (validatePDFFile(file)) {
    cb(null, true);
  } else {
    cb(new Error('Only valid PDF files are allowed'), false);
  }
};


// Multer configuration for different buckets
const createMulterConfig = (bucket: string, fileFilter: any, sizeLimit: number) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        try {
          // Always save to backend/uploads/{bucket}
          cb(null, ensureBucketPath(bucket));
        } catch (_err) {
          cb(_err as Error, uploadDir);
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
      } catch {
        const fallback = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fallback);
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    const bucket = resolveBucket(req.body.bucket);
    const pdfBuckets = new Set(['documents', 'cv-uploads', 'transcripts', 'cover-letters', 'publication']);

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
  // LOGGING: Print incoming upload details
  console.log('---[UPLOAD DEBUG]---');
  console.log('req.body.bucket:', req.body.bucket);
  console.log('resolved bucket:', resolveBucket(req.body.bucket));
  if (req.file) {
    console.log('req.file.destination:', req.file.destination);
    console.log('req.file.filename:', req.file.filename);
    console.log('req.file.path:', req.file.path);
    console.log('req.file.mimetype:', req.file.mimetype);
    console.log('req.file.size:', req.file.size);
  } else {
    console.log('No file received!');
  }
  console.log('--------------------');

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const bucket = resolveBucket(req.body.bucket);
  // Return correct URL path that matches where backend serves files from
  // Always return /uploads/{bucket}/{filename}
  const fileUrl = `/uploads/${bucket}/${req.file.filename}`;
  
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

// Upload routes
router.post('/documents', authenticateToken, uploadPDF.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/documents/${req.file.filename}`;
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
  
  const fileUrl = `/uploads/cv-uploads/${req.file.filename}`;
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
  
  const fileUrl = `/uploads/transcripts/${req.file.filename}`;
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
  
  const fileUrl = `/uploads/cover-letters/${req.file.filename}`;
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
