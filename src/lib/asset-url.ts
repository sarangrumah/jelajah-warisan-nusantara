// Original simple implementation (commented for reference)
// export function assetUrl(raw?: string): string {
//   if (!raw) return '';
//   return raw.trim();
// }

/**
 * Transform asset URLs to work in both development and production environments
 * - In development: Vite serves from /src/assets/
 * - In production: Backend serves from /assets/
 * - Handles uploaded files from backend API
 */
export function assetUrl(raw?: string): string {
  if (!raw) {
    return '';
  }

  const trimmed = raw.trim();
  
  // If it's already a full URL (http/https), return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a placeholder, return as-is
  if (trimmed === '/placeholder.svg' || trimmed.includes('placeholder')) {
    return trimmed;
  }

  // Transform /src/assets/ paths to /assets/ for production compatibility
  if (trimmed.startsWith('/src/assets/')) {
    return trimmed.replace('/src/assets/', '/assets/');
  }

  // If it starts with /assets/, it's already correct
  if (trimmed.startsWith('/assets/')) {
    return trimmed;
  }

  // If it starts with /uploads/, it's a backend upload (correct)
  if (trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  // If it's a relative path without leading slash, add /assets/ prefix
  if (!trimmed.startsWith('/')) {
    return `/assets/${trimmed}`;
  }

  // Default: return as-is
  return trimmed;
}

/**
 * Get the API base URL for backend requests
 * In production, this should point to your backend server
 */
export function getApiBaseUrl(): string {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // Use the same domain for API in production
    return '';
  }
  // In development, proxy handles /api requests
  return '';
}

/**
 * Helper to construct full image URLs for uploaded content
 */
export function getUploadedImageUrl(path?: string): string {
  if (!path) {
    return '/placeholder.svg';
  }
  
  const trimmed = path.trim();
  
  // If already a full URL, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // If it's already a proper path, use assetUrl
  return assetUrl(trimmed);
}
