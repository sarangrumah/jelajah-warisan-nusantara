/**
 * Sitemap Generator for Museum and Cultural Heritage Website
 * Generates XML sitemaps for better SEO and search engine indexing
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapOptions {
  baseUrl: string;
  additionalUrls?: SitemapUrl[];
  excludePaths?: string[];
}

const defaultUrls: SitemapUrl[] = [
  // Main pages
  { loc: '/', lastmod: '2024-12-19', changefreq: 'daily', priority: 1.0 },
  { loc: '/beranda', lastmod: '2024-12-19', changefreq: 'daily', priority: 1.0 },
  
  // Museum and Heritage pages
  { loc: '/museums', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.9 },
  { loc: '/heritage', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.9 },
  { loc: '/collection', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.9 },
  { loc: '/mow', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.8 },
  
  // Information pages
  { loc: '/tentang-kami', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.7 },
  { loc: '/struktur-organisasi', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.6 },
  { loc: '/laboratorium-konservasi', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.6 },
  { loc: '/media-publikasi', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.8 },
  { loc: '/agenda', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.8 },
  { loc: '/karir', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.7 },
  { loc: '/hubungi-kami', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.6 },
  { loc: '/ppid', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.5 },
  
  // Services and products
  { loc: '/pemanfaatan-aset', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.7 },
  { loc: '/prosedur-operasional-standar', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.6 },
  { loc: '/peraturan', lastmod: '2024-12-19', changefreq: 'monthly', priority: 0.5 },
  { loc: '/merchandise', lastmod: '2024-12-19', changefreq: 'weekly', priority: 0.6 },
];

const excludedPaths = [
  '/admin',
  '/auth',
  '/api',
  '/test-',
  '/dashboard',
  '/404',
  '/500'
];

export class SitemapGenerator {
  public additionalUrls: SitemapUrl[];
  private baseUrl: string;
  private excludePaths: string[];

  constructor(options: SitemapOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.additionalUrls = options.additionalUrls || [];
    this.excludePaths = [...excludedPaths, ...(options.excludePaths || [])];
  }

  private shouldExcludeUrl(url: string): boolean {
    return this.excludePaths.some(excludedPath => 
      url.includes(excludedPath) || url.startsWith(excludedPath)
    );
  }

  private formatUrl(url: SitemapUrl): string {
    const loc = url.loc.startsWith('/') ? `${this.baseUrl}${url.loc}` : `${this.baseUrl}/${url.loc}`;
    
    let urlXml = `  <url>\n`;
    urlXml += `    <loc>${loc}</loc>\n`;
    
    if (url.lastmod) {
      urlXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      urlXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
      urlXml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    urlXml += `  </url>\n`;
    return urlXml;
  }

  public generateSitemapXml(): string {
    // Filter out excluded URLs
    const allUrls = [...defaultUrls, ...this.additionalUrls]
      .filter(url => !this.shouldExcludeUrl(url.loc));

    let sitemapXml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n`;
    sitemapXml += `<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n`;

    allUrls.forEach(url => {
      sitemapXml += this.formatUrl(url);
    });

    sitemapXml += `</urlset>`;
    return sitemapXml;
  }

  public generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
${this.excludePaths.map(path => `Disallow: ${path}`).join('\n')}`;
  }

  // Method to fetch dynamic URLs from API (if needed)
  public async fetchDynamicUrls(): Promise<SitemapUrl[]> {
    try {
      // This would fetch dynamic URLs from your API
      // For example, museum details, news articles, etc.
      const response = await fetch(`${this.baseUrl}/api/sitemap-urls`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch dynamic URLs for sitemap:', error);
    }
    return [];
  }
}

// Utility function to generate sitemap
export const generateSitemap = async (baseUrl: string = 'https://museumcagarbudaya.kemenbud.go.id'): Promise<string> => {
  const generator = new SitemapGenerator({ baseUrl });
  const dynamicUrls = await generator.fetchDynamicUrls();
  
  generator.additionalUrls = dynamicUrls;
  return generator.generateSitemapXml();
};

// Utility function to generate robots.txt
export const generateRobotsTxt = (baseUrl: string = 'https://museumcagarbudaya.kemenbud.go.id'): string => {
  const generator = new SitemapGenerator({ baseUrl });
  return generator.generateRobotsTxt();
};

export default SitemapGenerator;