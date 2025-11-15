import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, Zap, Database } from 'lucide-react';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

interface PerformanceStats {
  cacheSize: number;
  cacheHitRate: number;
  apiCalls: number;
  totalTranslations: number;
  averageResponseTime: number;
}

export const TranslationPerformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    cacheSize: 0,
    cacheHitRate: 0,
    apiCalls: 0,
    totalTranslations: 0,
    averageResponseTime: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStats = async () => {
    setIsRefreshing(true);
    try {
      const cacheStats = optimizedTranslationService.getCacheStats();
      
      // Simulate some performance metrics
      // In a real implementation, you'd track these metrics
      setStats({
        cacheSize: cacheStats.size,
        cacheHitRate: cacheStats.hitRate,
        apiCalls: Math.floor(Math.random() * 100), // Mock data
        totalTranslations: cacheStats.size + Math.floor(Math.random() * 50),
        averageResponseTime: Math.random() * 100 + 50 // Mock data in ms
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearCache = () => {
    optimizedTranslationService.clearCache();
    refreshStats();
  };

  const prewarmCache = () => {
    optimizedTranslationService.prewarmCache();
    refreshStats();
  };

  useEffect(() => {
    refreshStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Translation Performance Dashboard
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshStats}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cache Size */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cache Size</p>
                  <p className="text-2xl font-bold">{stats.cacheSize}</p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Cache Hit Rate */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">{(stats.cacheHitRate * 100).toFixed(1)}%</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Calls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">API Calls</p>
                  <p className="text-2xl font-bold">{stats.apiCalls}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Response Time */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}ms</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">✅ Best Practices</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use batch translation for multiple texts</li>
                  <li>• Leverage common translations cache</li>
                  <li>• Implement debouncing for user input</li>
                  <li>• Pre-warm cache with common phrases</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚠️ Common Issues</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Individual API calls for each text</li>
                  <li>• No caching for repeated translations</li>
                  <li>• Missing common translations</li>
                  <li>• No batch processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={prewarmCache} variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Pre-warm Cache
          </Button>
          <Button onClick={clearCache} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stats.cacheHitRate > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm">
              Cache Performance: {stats.cacheHitRate > 0.7 ? 'Excellent' : 'Needs Improvement'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stats.averageResponseTime < 100 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              Response Time: {stats.averageResponseTime < 100 ? 'Fast' : 'Slow'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stats.apiCalls < 10 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm">
              API Usage: {stats.apiCalls < 10 ? 'Optimal' : 'High'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationPerformanceDashboard;