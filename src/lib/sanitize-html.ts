const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'span',
  'blockquote',
  'code',
  'pre',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  span: new Set(['style']),
  p: new Set(['style']),
  li: new Set(['style']),
};

const URL_SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:'];

const sanitizeHref = (value: string) => {
  try {
    const anchor = document.createElement('a');
    anchor.href = value;
    const protocol = (anchor.protocol || '').toLowerCase();
    if (value.startsWith('/') || value.startsWith('#')) {
      return value;
    }
    if (!URL_SAFE_PROTOCOLS.includes(protocol)) {
      return '#';
    }
    return anchor.href;
  } catch (_) {
    return '#';
  }
};

const stripDangerousStyles = (style: string) => {
  return style
    .split(';')
    .map((rule) => rule.trim())
    .filter((rule) => !!rule && !rule.toLowerCase().startsWith('expression') && !rule.toLowerCase().includes('url('))
    .join('; ');
};

export const unescapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&/g, '&');
};

export const sanitizeHtml = (dirty: string): string => {
  if (typeof dirty !== 'string') {
    return '';
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return dirty;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  const walk = (node: Node) => {
    const childNodes = Array.from(node.childNodes);
    for (const child of childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (!ALLOWED_TAGS.has(tagName)) {
          const fragment = document.createDocumentFragment();
          while (el.firstChild) {
            fragment.appendChild(el.firstChild);
          }
          el.replaceWith(fragment);
          continue;
        }

        for (const attr of Array.from(el.attributes)) {
          const attrName = attr.name.toLowerCase();
          const allowedForTag = ALLOWED_ATTRS[tagName];

          if (attrName.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (tagName === 'a' && attrName === 'href') {
            el.setAttribute('href', sanitizeHref(attr.value));
            continue;
          }

          if (!allowedForTag || !allowedForTag.has(attrName)) {
            el.removeAttribute(attr.name);
            continue;
          }

          if (attrName === 'style') {
            const cleaned = stripDangerousStyles(attr.value);
            if (cleaned) {
              el.setAttribute('style', cleaned);
            } else {
              el.removeAttribute('style');
            }
          }
        }

        walk(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        node.removeChild(child);
      }
    }
  };

  walk(doc.body);

  return doc.body.innerHTML;
};

export default sanitizeHtml;
