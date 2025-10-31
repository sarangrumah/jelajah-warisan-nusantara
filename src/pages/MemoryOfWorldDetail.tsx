import Header from '@/components/Header'
import { memoryWorldService } from '@/lib/api-services';
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import logo from '@/assets/MCB-Logo.png';
import { Card, CardContent } from '@/components/ui/card';
import MemoryOfWorldGallery from '@/components/mow/MemoryOfWorldGallery';
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

const MemoryOfWorldDetail = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const [memories, setMemories] = useState([]);

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
                setMemories([response.data]);
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
        <div className="min-h-screen bg-background pt-5">
            <Header />
            {memories.map((memory) => (
                <section key={memory.id} className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="aspect-square overflow-hidden rounded-lg border">
                            <img
                                src={getImageUrl(memory.thumbnails) || logo}
                                alt={memory.title}
                                className="w-full h-full object-cover"
                            />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: fixBrokenHtmlTags(memory.title)
                                      }}
                                  />
                                </h1>
                                {memory.subtitle && (
                                  <p className="text-xl text-muted-foreground">
                                    <span
                                      dangerouslySetInnerHTML={{
                                          __html: fixBrokenHtmlTags(memory.subtitle)
                                      }}
                                    />
                                  </p>
                                )}
                            </div>

                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: fixBrokenHtmlTags(memory.description)
                                          }}
                                        />
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className='p-5'>
                                    <div className="flex flex-wrap gap-2">
                                        <MemoryOfWorldGallery mowId={memory.id} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    )
}

export default MemoryOfWorldDetail