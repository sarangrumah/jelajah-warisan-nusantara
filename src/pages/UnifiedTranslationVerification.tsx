import React, { useState } from 'react';
import { useUnifiedTranslation, useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UnifiedTranslationVerification: React.FC = () => {
  const { language, setLanguage } = useUnifiedTranslation();
  
  // Test 1: Single string translation
  const { translatedContent: singleText, isTranslating: singleLoading } = useTranslationSystem('Selamat datang di Museum', 'test-single');

  // Test 2: Array translation
  const menuItems = ['Beranda', 'Tentang Kami', 'Layanan', 'Kontak'];
  const { translatedContent: menuTranslated, isTranslating: menuLoading } = useTranslationSystem(menuItems, 'test-menu');

  // Test 3: Object translation
  const complexObject = {
    title: 'Pameran Seni',
    description: 'Pameran ini menampilkan karya seni dari berbagai era.',
    details: {
      location: 'Galeri Utama',
      date: '25 November 2025'
    }
  };
  const { translatedContent: objectTranslated, isTranslating: objectLoading } = useTranslationSystem(complexObject, 'test-object');

  // Test 4: Async Data
  const [asyncData, setAsyncData] = useState<string[]>([]);
  const { translatedContent: asyncTranslated, isTranslating: asyncLoading } = useTranslationSystem(asyncData, 'test-async');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAsyncData(['Data 1', 'Data 2', 'Data 3']);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Unified Translation System Verification</h1>
        <div className="flex gap-2">
          <Button 
            variant={language === 'id' ? 'default' : 'outline'}
            onClick={() => setLanguage('id')}
          >
            Bahasa Indonesia
          </Button>
          <Button 
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test 1: Single String */}
        <Card>
          <CardHeader>
            <CardTitle>Test 1: Single String</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Original: "Selamat datang di Museum"</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Result:</span>
                {singleLoading ? (
                  <Badge variant="secondary">Translating...</Badge>
                ) : (
                  <span className="text-lg">{singleText}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test 2: Array */}
        <Card>
          <CardHeader>
            <CardTitle>Test 2: Array Translation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Original: ['Beranda', 'Tentang Kami', 'Layanan', 'Kontak']</p>
              <div className="space-y-1">
                <span className="font-semibold">Result:</span>
                {menuLoading ? (
                  <Badge variant="secondary">Translating...</Badge>
                ) : (
                  <ul className="list-disc list-inside">
                    {menuTranslated?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test 3: Complex Object */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test 3: Complex Object</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold mb-2">Original Object:</p>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(complexObject, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Translated Object:</p>
                {objectLoading ? (
                  <div className="h-full flex items-center justify-center bg-muted rounded-lg">
                    <Badge variant="secondary">Translating...</Badge>
                  </div>
                ) : (
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(objectTranslated, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test 4: Async Data */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test 4: Async Data (Simulated Fetch)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Original: {asyncData.length === 0 ? 'Loading...' : JSON.stringify(asyncData)}</p>
              <div className="space-y-1">
                <span className="font-semibold">Result:</span>
                {asyncLoading ? (
                  <Badge variant="secondary">Translating...</Badge>
                ) : (
                  <ul className="list-disc list-inside">
                    {asyncTranslated?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedTranslationVerification;