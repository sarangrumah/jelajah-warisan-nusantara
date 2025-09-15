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
const bucketsToCreate = ['documents', 'cv-uploads', 'transcripts', 'cover-letters', 'images'];

bucketsToCreate.forEach(bucket => {
  const bucketPath = path.join(uploadDir, bucket);
  if (!fs.existsSync(bucketPath)) {
    fs.mkdirSync(bucketPath, { recursive: true });
  }
});

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
        cb(null, path.join(uploadDir, bucket));
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
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
// Helper to ensure hero-sections bucket lives under backend uploads
const heroSectionsPath = path.join(uploadDir, 'hero-sections');
if (!fs.existsSync(heroSectionsPath)) {
  fs.mkdirSync(heroSectionsPath, { recursive: true });
}

// Generic upload endpoint that handles different buckets
const uploadMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const bucket = req.body.bucket || 'images';
      // Special-case: hero-sections now stored under backend uploads, not src/assets
      if (bucket === 'hero-sections') {
        return cb(null, heroSectionsPath);
      }

      const bucketPath = path.join(uploadDir, bucket);
      
      // Ensure bucket directory exists
      if (!fs.existsSync(bucketPath)) {
        fs.mkdirSync(bucketPath, { recursive: true });
      }
      
      cb(null, bucketPath);
    },
    filename: (req, file, cb) => {
      const bucket = req.body.bucket || 'images';
      try {
        if (bucket === 'hero-sections') {
          const finalName = ensureUniqueFilename(heroSectionsPath, file.originalname);
          return cb(null, finalName);
        }
        // default behavior for other buckets: keep original sanitized + uniqueness in their bucket dir
        const dir = path.join(uploadDir, bucket);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const finalName = ensureUniqueFilename(dir, file.originalname);
        cb(null, finalName);
      } catch (e) {
        const fallback = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fallback);
      }
    }
  }),
  fileFilter: (req, file, cb) => {
    const bucket = req.body.bucket || 'images';
    
    if (bucket === 'documents' || bucket === 'cv-uploads' || bucket === 'transcripts' || bucket === 'cover-letters') {
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
  
  const bucket = req.body.bucket || 'images';
  // Unified public URL path under /uploads (avoid src/assets to prevent Vite HMR)
  const fileUrl = `/uploads/${bucket}/${req.file.filename}`;
  const relativeUrl = `..${fileUrl}`;
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      url: fileUrl,
      relative_url: relativeUrl,
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

// Kept for backward compatibility; now also writes to backend uploads/hero-sections
router.post('/images', authenticateToken, multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, heroSectionsPath),
    filename: (req, file, cb) => cb(null, ensureUniqueFilename(heroSectionsPath, file.originalname))
  }),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/hero-sections/${req.file.filename}`;
  const relativeUrl = `..${fileUrl}`;
  res.json({
    message: 'Image uploaded successfully',
    file: {
      url: fileUrl,
      relative_url: relativeUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    }
  });
});

// Serve uploaded files
router.use('/uploads', (req, res, next) => {
  // Add appropriate headers for file serving
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

export default router;
