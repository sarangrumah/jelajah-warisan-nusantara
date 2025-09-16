const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function assetUrl(u?: string): string {
  if (!u) return '';
  // already absolute URL
  if (u.startsWith('http://') || u.startsWith('https://')) return u;

  // Normalize legacy '../uploads' to '/uploads'
  if (u.startsWith('../uploads')) u = u.replace(/^\.\./, '');

  // Special handling for production: always use the real backend domain for /uploads/
  if (u.startsWith('/uploads/')) {
    // If running on production domain, force the correct backend URL
    if (typeof window !== 'undefined' && window.location.hostname === 'museumcagarbudaya.kemenbud.go.id') {
      return `https://museumcagarbudaya.kemenbud.go.id${u}`;
    }
    // Otherwise, use API_BASE if set, or relative
    if (API_BASE && API_BASE !== '/') {
      return `${API_BASE}${u}`;
    } else {
      return u;
    }
  }

  // For all other URLs (e.g., /assets/, static, or relative), return as-is
  return u;
}

