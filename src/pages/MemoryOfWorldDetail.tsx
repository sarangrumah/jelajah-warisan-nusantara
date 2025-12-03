import Header from '@/components/Header'
import { memoryWorldService } from '@/lib/api-services';
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import logo from '@/assets/MCB-Logo.png';
import { Card, CardContent } from '@/components/ui/card';
import MemoryOfWorldGallery from '@/components/mow/MemoryOfWorldGallery';

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
  categories_id: string | null;
  reason_rejected: string;
  excerpt: string | null;
  galleries?: { upload_file: string }[];
  gallery?: string[];
}
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

function getImageUrl(imagePath: string) {
  if (!imagePath) return null;
  
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

const parseDate = (dateString: string) => {
  if (!dateString) return null;
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

const MemoryOfWorldDetail = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const [memories, setMemories] = useState<MemoryItem[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchMemoryDetail = async () => {
          try {
            const response = await memoryWorldService.getById(id!);
            if (response.error) {
              console.error('Error fetching memory detail:', response.error);
            } else {
                // Check if the memory should be visible based on publish dates and status
                const memory = response.data as MemoryItem;
                console.log('Fetched memory:', memory);
                const currentDate = new Date();
                const startPublishDate = memory.start_publish_date ? parseDate(memory.start_publish_date) : null;
                const endPublishDate = memory.end_publish_date ? parseDate(memory.end_publish_date) : null;
                
                const isPublished = (!startPublishDate || currentDate >= startPublishDate) &&
                                   (!endPublishDate || currentDate <= endPublishDate);
                
                const isActive = memory.is_active === true || memory.is_active === 't';
                const isApproved = memory.is_approved === true || memory.is_approved === 't';
                const isNotRejected = memory.is_rejected === false || memory.is_rejected === 'f';
                
                if (isPublished && isActive && isApproved && isNotRejected) {
                    setMemories([memory]);
                } else {
                    setMemories([]);
                }
            }
          } catch (error) {
            console.error('Error fetching memory detail:', error);
          }
        };
        if (id) {
            fetchMemoryDetail();
        }
    }, [id]);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {memories.map((memory) => (
                <section key={memory.id} className="container mx-auto px-4 py-8 pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                        <div className="lg:col-span-4 space-y-4">
                            <div className="aspect-square overflow-hidden rounded-lg border shadow-sm">
                                <img
                                    src={getImageUrl(memory.thumbnails) || logo}
                                    alt={memory.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: fixBrokenHtmlTags(memory.title)
                                        }}
                                    />
                                </h1>
                                {memory.subtitle && (
                                    <p className="text-lg md:text-xl text-muted-foreground">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: fixBrokenHtmlTags(memory.subtitle)
                                            }}
                                        />
                                    </p>
                                )}
                            </div>

                            <Card className="border-none shadow-none bg-transparent">
                                <CardContent className="p-0">
                                    <div className="text-muted-foreground leading-relaxed text-justify">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: fixBrokenHtmlTags(memory.description)
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-4">Galeri</h2>
                        <Card>
                            <CardContent className='p-5'>
                                <div className="flex flex-wrap gap-2">
                                    <MemoryOfWorldGallery
                                        mowId={memory.id}
                                        images={
                                            memory.galleries?.map(g => ({
                                                upload_file: g.upload_file,
                                                caption: (g as any).caption
                                            })) ||
                                            memory.gallery ||
                                            []
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            ))}
        </div>
    )
}

export default MemoryOfWorldDetail