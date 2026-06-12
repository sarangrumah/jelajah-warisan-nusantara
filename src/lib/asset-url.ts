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

  // Clean up any path that contains /src/assets/ anywhere in it
  // This handles cases like /assets/../src/assets/ or ../src/assets/
  if (trimmed.includes('/src/assets/')) {
    // First, remove any ../ patterns
    let cleaned = trimmed.replace(/\/\.\.\//g, '/');
    cleaned = cleaned.replace(/^\.\.\//g, '/');
    // Then replace all occurrences of /src/assets/ with /assets/
    cleaned = cleaned.replace(/\/src\/assets\//g, '/assets/');
    // Remove duplicate /assets/ if any (e.g., /assets/assets/ -> /assets/)
    cleaned = cleaned.replace(/\/assets\/assets\//g, '/assets/');
    return cleaned;
  }

  // Handle src/assets/ without leading slash
  if (trimmed.startsWith('src/assets/')) {
    return '/' + trimmed.replace('src/assets/', 'assets/');
  }

  // If it starts with /assets/, it's already correct
  if (trimmed.startsWith('/assets/')) {
    return trimmed;
  }

  // If it starts with /uploads/, it's a backend upload (correct)
  if (trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  // Handle uploaded files by bucket type
  if (!trimmed.startsWith('/')) {
    // Check if it's likely an uploaded file based on context
    // This is a heuristic - if it's just a filename, it's likely uploaded
    if (trimmed.includes('.') && trimmed.split('.').length === 2) {
      // This looks like a filename (e.g., "image.jpg")
      // Try to determine bucket from context or use a default
      // For now, we'll use a generic approach that can be overridden
      return `/uploads/${trimmed}`;
    }
    // For other relative paths, use assets prefix
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
 * Backend origin that serves /uploads — mirrors api-client baseUrl logic.
 * Frontend runs on vite (preview :4173 / dev :5173) which does not serve uploads,
 * so upload paths must be absolute against the backend origin.
 */
export function apiUrl(): string {
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  return import.meta.env.VITE_API_URL || 'https://museumcagarbudaya.kemenbud.go.id';
}

/**
 * Helper to construct full image URLs for uploaded content
 * @param path stored value: full URL, "/uploads/{bucket}/{file}", or bare filename
 * @param bucket bucket used when path is a bare filename (default "images")
 */
export function getUploadedImageUrl(path?: string, bucket?: string): string {
  if (!path) {
    return '/placeholder.svg';
  }

  const trimmed = path.trim();

  // If already a full URL, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Backend upload path → make absolute against backend origin
  if (trimmed.startsWith('/uploads/')) {
    return `${apiUrl()}${trimmed}`;
  }

  // Frontend static asset
  if (trimmed.startsWith('/assets/') || trimmed.includes('placeholder')) {
    return trimmed;
  }

  // Bare filename → assume uploaded file in the given bucket
  if (!trimmed.startsWith('/') && trimmed.includes('.')) {
    return `${apiUrl()}/uploads/${bucket || 'images'}/${trimmed.split('/').pop()}`;
  }

  // Anything else: legacy asset paths
  return assetUrl(trimmed);
}
