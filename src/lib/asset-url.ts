const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function assetUrl(u?: string): string {
  if (!u) return '';
  // already absolute URL
  if (u.startsWith('http://') || u.startsWith('https://')) return u;

  // Normalize legacy '../uploads' to '/uploads'
  if (u.startsWith('../uploads')) u = u.replace(/^\.\./, '');

  // Only prefix with API base for backend-served uploads
  if (u.startsWith('/uploads/')) {
    // If API_BASE is set and not just '/', use it; otherwise, use relative path
    if (API_BASE && API_BASE !== '/') {
      return `${API_BASE}${u}`;
    } else {
      return u;
    }
  }

  // For all other URLs (e.g., /assets/, static, or relative), return as-is
  return u;
}

