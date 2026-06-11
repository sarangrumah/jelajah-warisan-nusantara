import { useMemo } from 'react';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { fixBrokenHtmlTags } from '@/lib/v2/fixHtml';

interface SafeHtmlProps {
  html: string | undefined | null;
  className?: string;
}

/**
 * Satu-satunya jalur render HTML dari API di scope /v2.
 * Selalu melalui sanitizeHtml (allowlist) — berbeda dari v1 yang merender
 * HTML API mentah, ini menutup celah XSS untuk konten v2.
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = useMemo(() => sanitizeHtml(fixBrokenHtmlTags(html || '')), [html]);
  if (!clean) {
    return null;
  }
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default SafeHtml;
