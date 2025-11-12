import rateLimit from 'express-rate-limit';

// Rate limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    error: 'Terlalu banyak permintaan reset password. Silakan coba lagi dalam 1 jam.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for general auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});