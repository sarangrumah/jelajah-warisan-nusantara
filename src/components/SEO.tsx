import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: object;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const SEO = ({
  title,
  description = "Jelajah Warisan Nusantara - Museum dan Cagar Budaya Indonesia",
  image = "/og-image.jpg",
  url,
  type = "website",
  keywords = "museum, cagar budaya, indonesia, warisan nusantara, heritage, museum indonesia, sejarah, budaya",
  breadcrumbs,
  structuredData,
  noindex = false,
  publishedTime,
  modifiedTime,
  author = "Museum dan Cagar Budaya Indonesia",
  section,
  tags = []
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const siteTitle = `${title} | Museum dan Cagar Budaya`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Default structured data for museums and cultural sites
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": siteTitle,
    "description": fullDescription,
    "url": currentUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Museum dan Cagar Budaya Indonesia",
      "url": "https://museumcagarbudaya.kemenbud.go.id"
    },
    "publisher": {
      "@type": "GovernmentOrganization",
      "name": "Kementerian Pendidikan dan Kebudayaan Republik Indonesia",
      "url": "https://www.kemenbud.go.id"
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "mainEntity": {
      "@type": "Museum",
      "name": title,
      "description": fullDescription,
      "url": currentUrl,
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ID",
        "addressRegion": "Indonesia"
      }
    }
  };
  
  const finalStructuredData = structuredData || defaultStructuredData;
  
  // Breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Article/Content specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Open Graph tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Museum dan Cagar Budaya Indonesia" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Additional Open Graph tags for better sharing */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional Twitter meta tags */}
      <meta name="twitter:site" content="@kemenbud" />
      <meta name="twitter:creator" content="@kemenbud" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}

      {/* Additional SEO meta tags for better indexing */}
      <meta name="language" content="id" />
      <meta name="geo.region" content="ID" />
      <meta name="geo.country" content="Indonesia" />
      <meta name="ICBM" content="-6.2088,106.8456" />
      
      {/* Performance hints */}
      <link rel="dns-prefetch" href="//museumcagarbudaya.kemenbud.go.id" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;
