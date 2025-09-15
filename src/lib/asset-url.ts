const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function assetUrl(u?: string): string {
  if (!u) return '';
  // already absolute URL
  if (u.startsWith('http://') || u.startsWith('https://')) return u;

  // Normalize legacy '../uploads' to '/uploads'
  if (u.startsWith('../uploads')) u = u.replace(/^\.\./, '');

  // If it points to backend-served uploads, prefix with API base
  if (u.startsWith('/uploads/')) return `${API_BASE}${u}`;

  // Keep other app-relative assets as-is
  return u;
}

