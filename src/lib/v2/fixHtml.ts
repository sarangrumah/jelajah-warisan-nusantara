// Salinan utilitas v1 (Heritage.tsx / HeritageDetail.tsx) khusus scope v2,
// agar v2 tidak mengubah/meng-import file halaman v1.

/** Memperbaiki tag HTML rusak seperti "< p >" menjadi "<p>". */
export function fixBrokenHtmlTags(html: string): string {
  if (!html) {
    return html;
  }
  return html
    .replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
    .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

/** Mengubah HTML dari API menjadi teks polos (untuk kartu, alt text, judul hero). */
export function htmlToText(html: string): string {
  if (!html) {
    return '';
  }
  if (typeof document === 'undefined') {
    return html;
  }
  const doc = new DOMParser().parseFromString(fixBrokenHtmlTags(html), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Memotong teks pada batas kata. */
export function truncate(text: string, max = 140): string {
  if (!text || text.length <= max) {
    return text;
  }
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)) || cut}…`;
}
