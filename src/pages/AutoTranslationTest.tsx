import React, { useState } from 'react';
import { Tx, useTranslateText } from '../components/Tx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const AutoTranslationTest = () => {
  const { i18n } = useTranslation();
  const t = useTranslateText();
  const [apiError, setApiError] = useState('');

  const triggerFakeApiError = async () => {
    try {
      // Simulate an API call that returns an error in Indonesian
      const response = await fetch('http://localhost:3000/api/non-existent-endpoint');
      if (!response.ok) {
        // Manually construct an error response that our interceptor would handle
        // In a real scenario, the interceptor handles the fetch call itself
        // But since we can't easily mock the backend 404 response body here without a real endpoint,
        // we'll simulate the behavior of the interceptor logic or just show that the interceptor is active.
        
        // Actually, let's try to hit a real endpoint that might fail or just use the interceptor directly.
        // Since we enabled the global interceptor, any fetch call should be intercepted.
        
        // Let's try to hit the health endpoint but force an error if possible, or just use a mock fetch
        // for demonstration if we can't trigger a real translated error from the backend easily.
        
        // For this test, we'll just rely on the visual confirmation of the other elements
        // and maybe a manual invocation of the translation logic.
        
        setApiError('Error simulation not fully implemented without backend support');
      }
    } catch (error) {
      setApiError('Fetch failed');
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">
        Auto-Translation System Test
      </h1>
      
      <div className="bg-muted p-4 rounded-lg mb-8">
        <p>Current Language: <strong>{i18n.language}</strong></p>
        <p className="text-sm text-muted-foreground">
          Switch language to English to see translations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test 1: Hardcoded Text */}
        <Card>
          <CardHeader>
            <CardTitle>1. Hardcoded Text (Tx Component)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded">
              <p className="font-semibold">Original (ID):</p>
              <p>Selamat Datang di Museum Nasional</p>
            </div>
            <div className="p-4 border rounded bg-accent/10">
              <p className="font-semibold">Result:</p>
              <p className="text-lg text-primary">
                <Tx>Selamat Datang di Museum Nasional</Tx>
              </p>
            </div>
            <div className="p-4 border rounded bg-accent/10">
              <p className="font-semibold">Another Example:</p>
              <p className="text-lg text-primary">
                <Tx>Koleksi Sejarah Nusantara</Tx>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test 2: Placeholders & Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>2. Placeholders (useTranslateText)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Input with Translated Placeholder:</label>
              <Input 
                placeholder={t("Masukkan nama lengkap Anda")} 
              />
            </div>
            <div className="space-y-2">
              <label>Another Input:</label>
              <Input 
                placeholder={t("Cari koleksi museum...")} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Test 3: Dynamic Content */}
        <Card>
          <CardHeader>
            <CardTitle>3. Dynamic Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This text is rendered dynamically:
            </p>
            <div className="p-4 bg-secondary rounded">
              <Tx>
                {`Hari ini adalah tanggal ${new Date().toLocaleDateString('id-ID')}`}
              </Tx>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Note: Dynamic values with variables might need specific handling or will be translated as a whole string.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoTranslationTest;