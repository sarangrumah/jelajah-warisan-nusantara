import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { memoryWorldService } from '@/lib/api-services';

interface MemoryItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  image: string | null;
  start_publish_date: string;
  end_publish_date: string;
  is_active: boolean | string;
  is_approved: boolean | string;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  thumbnails: string;
  is_rejected: boolean | string;
  reason_rejected: string;
  excerpt: string | null;
}
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

function getImageUrl(imagePath: string) {
  if (!imagePath) {return null};
  
  if (
    typeof imagePath === 'string' &&
    (imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('/uploads/'))
  ) {
    return imagePath;
  }
  
  // For relative paths starting with ../src/assets/
  if (imagePath.startsWith('../src/assets/')) {
    return imagePath.replace('../src/assets/', '/src/assets/');
  }
  
  return imagePath;
}
const MemoryOfWorld = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const { pathname } = useLocation();
      
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await memoryWorldService.getAll();
        if(response.error) {
          console.error('Error fetching memories:', response.error);
        } else {
          const mappedMemories = response.data.map((memory: {
            id: string; thumbnails: string
          }) => ({
            ...memory,
            image: memory.thumbnails && !memory.thumbnails.startsWith('/uploads/memory-thumbnails/')
              ? `/uploads/memory-thumbnails/${memory.thumbnails.split('/').pop()}`
              : memory.thumbnails
          }))
          setMemories(mappedMemories as MemoryItem[]);
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    }
    fetchMemories();
  }, []);

  const parseDate = (dateString: string) => {
    if (!dateString) {return null};
    // Handle DD/MM/YYYY format
    const parts = dateString.split(' ')[0].split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateString);
  };

  const filteredMemories = memories.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by publish dates and status
    const currentDate = new Date();
    const startPublishDate = item.start_publish_date ? parseDate(item.start_publish_date) : null;
    const endPublishDate = item.end_publish_date ? parseDate(item.end_publish_date) : null;
    
    const isPublished = (!startPublishDate || currentDate >= startPublishDate) &&
                       (!endPublishDate || currentDate <= endPublishDate);
    
    // Handle both string ('t'/'f') and boolean (true/false) values from API
    const isActive = item.is_active === true || item.is_active === 't';
    const isApproved = item.is_approved === true || item.is_approved === 't';
    const isNotRejected = item.is_rejected === false || item.is_rejected === 'f';
    
    const shouldShow = matchesSearch 
        && isPublished 
        && isActive 
        && isApproved 
        && isNotRejected;
    
    if (item.id === 'f70009f8-9c1c-4b8e-93b4-bd0350265546') {
      console.log('Prambanan Candi debug:', {
        title: item.title,
        matchesSearch,
        isPublished,
        isActive: item.is_active,
        isApproved: item.is_approved,
        isNotRejected: item.is_rejected,
        startPublishDate: startPublishDate?.toISOString(),
        endPublishDate: endPublishDate?.toISOString(),
        currentDate: currentDate.toISOString(),
        shouldShow
      });
    }
    
    return shouldShow;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative py-20 h-80 from-primary to-primary-glow flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('mow.title')}
          </h1>
          <p className="text-xl">
            {t('mow.subtitle')}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder={t('filter.mow.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((item) => (
            <Link key={item.id} to={`/mow/${item.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="aspect-video overflow-hidden rounded-t-lg pt-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain object-center"
                    onError={(e) => {
                      console.error('[Collection] Image failed to load:', item.image);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(item.title)
                      }}
                    />
                  </CardTitle>
                  <CardDescription>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: fixBrokenHtmlTags(item.subtitle)
                      }}
                    />
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('No memories found. Try adjusting your search or filter.')}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default MemoryOfWorld