import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';
import { useOptimizedTranslate, useBatchTranslate } from '@/hooks/useOptimizedTranslate';
import TranslationPerformanceDashboard from '@/components/TranslationPerformanceDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TranslationTest: React.FC = () => {
  const { language } = useLanguage();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Test single translation
  const singleText = 'Beranda';
  const { translatedText: singleTranslated, loading: singleLoading } = useOptimizedTranslate(singleText);

  // Test batch translation
  const batchTexts = ['Destinasi', 'Museum', 'Warisan Budaya', 'Koleksi', 'Merchandise'];
  const { translations: batchTranslations, loading: batchLoading, stats: batchStats } = useBatchTranslate(batchTexts);

  const runPerformanceTest = async () => {
    setIsTesting(true);
    const results = [];

    // Test 1: Single translation
    const start1 = performance.now();
    const result1 = await optimizedTranslationService.translateText({
      text: 'Beranda',
      source: 'id',
      target: 'en'
    });
    const time1 = performance.now() - start1;
    results.push({ test: 'Single Translation', time: time1, result: result1 });

    // Test 2: Batch translation
    const start2 = performance.now();
    const result2 = await optimizedTranslationService.translateBatch({
      texts: batchTexts,
      source: 'id',
      target: 'en'
    });
    const time2 = performance.now() - start2;
    results.push({ 
      test: 'Batch Translation', 
      time: time2, 
      result: result2.translations.join(', '),
      cacheHits: result2.cacheHits,
      apiCalls: result2.apiCalls
    });

    // Test 3: Cached translation
    const start3 = performance.now();
    const result3 = await optimizedTranslationService.translateBatch({
      texts: batchTexts,
      source: 'id',
      target: 'en'
    });
    const time3 = performance.now() - start3;
    results.push({ 
      test: 'Cached Translation', 
      time: time3, 
      result: result3.translations.join(', '),
      cacheHits: result3.cacheHits,
      apiCalls: result3.apiCalls
    });

    setTestResults(results);
    setIsTesting(false);
  };

  useEffect(() => {
    // Pre-warm cache on component mount
    optimizedTranslationService.prewarmCache();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Translation Performance Test</h1>
        <p className="text-muted-foreground">Testing the optimized translation system</p>
        <Badge variant="secondary" className="mt-2">
          Current Language: {language}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Translation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Single Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Input:</span>
              <Badge variant="outline">{singleText}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Output:</span>
              <Badge variant={singleLoading ? "secondary" : "default"}>
                {singleLoading ? 'Translating...' : singleTranslated}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Using useOptimizedTranslate hook with automatic caching
            </div>
          </CardContent>
        </Card>

        {/* Batch Translation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Translation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium">Inputs:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {batchTexts.map((text, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {text}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Outputs:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {batchTranslations.map((text, index) => (
                  <Badge 
                    key={index} 
                    variant={batchLoading ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {batchLoading ? '...' : text}
                  </Badge>
                ))}
              </div>
            </div>
            {!batchLoading && batchStats && (
              <div className="text-sm text-muted-foreground">
                Cache hits: {batchStats.cacheHits} | API calls: {batchStats.apiCalls} | Time: {batchStats.totalTime.toFixed(1)}ms
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Performance Tests</span>
            <Button onClick={runPerformanceTest} disabled={isTesting}>
              {isTesting ? 'Testing...' : 'Run Performance Tests'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTesting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Running performance tests...</p>
            </div>
          )}
          
          {testResults.length > 0 && (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{result.test}</h4>
                    <Badge variant="outline">{result.time.toFixed(1)}ms</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Result: {result.result}
                  </p>
                  {result.cacheHits !== undefined && (
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Cache Hits: {result.cacheHits}</span>
                      <span>API Calls: {result.apiCalls}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Dashboard */}
      <TranslationPerformanceDashboard />

      {/* Cache Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={() => optimizedTranslationService.prewarmCache()}
            variant="outline"
          >
            Pre-warm Cache
          </Button>
          <Button
            onClick={() => {
              optimizedTranslationService.clearCache();
              setTestResults([]);
            }}
            variant="outline"
          >
            Clear Cache
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Single Translation:</strong> Use <code>useOptimizedTranslate</code> hook for individual text translations.</p>
          <p><strong>Batch Translation:</strong> Use <code>useBatchTranslate</code> hook for multiple texts at once.</p>
          <p><strong>Performance:</strong> Monitor cache hits and API calls in the dashboard above.</p>
          <p><strong>Common Translations:</strong> Navigation items are cached automatically for instant translation.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationTest;