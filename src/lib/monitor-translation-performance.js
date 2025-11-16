/**
 * Real-time translation performance monitor
 * This script monitors translation requests and performance in the browser
 */

class TranslationPerformanceMonitor {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      batchRequests: 0,
      individualRequests: 0,
      cacheHits: 0,
      apiCalls: 0,
      errors: 0,
      startTime: Date.now(),
      requests: new Map()
    };
    
    this.setupMonitoring();
    this.startPeriodicReporting();
  }

  setupMonitoring() {
    // Monitor fetch requests to translation API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      
      if (typeof url === 'string' && url.includes('/api/translate')) {
        const requestId = Date.now() + Math.random();
        this.metrics.totalRequests++;
        
        const startTime = performance.now();
        console.log(`📤 Translation API Request #${this.metrics.totalRequests}:`, url);
        
        try {
          const response = await originalFetch.apply(this, args);
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          console.log(`✅ Translation API Response #${this.metrics.totalRequests}: ${duration.toFixed(2)}ms`);
          
          if (url.includes('/batch')) {
            this.metrics.batchRequests++;
          } else {
            this.metrics.individualRequests++;
          }
          
          this.metrics.apiCalls++;
          
          return response;
        } catch (error) {
          this.metrics.errors++;
          console.error(`❌ Translation API Error #${this.metrics.totalRequests}:`, error);
          throw error;
        }
      }
      
      return originalFetch.apply(this, args);
    };

    // Monitor IntersectionObserver events
    const originalIntersectionObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends originalIntersectionObserver {
      constructor(callback, options) {
        const wrappedCallback = (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              console.log('👁️ Component intersecting:', entry.target);
            }
          });
          return callback(entries, observer);
        };
        super(wrappedCallback, options);
      }
    };

    console.log('🔍 Translation Performance Monitor initialized');
  }

  startPeriodicReporting() {
    setInterval(() => {
      this.reportMetrics();
    }, 5000); // Report every 5 seconds
  }

  reportMetrics() {
    const elapsedTime = Date.now() - this.metrics.startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    const cacheHitRate = this.metrics.totalRequests > 0 
      ? ((this.metrics.cacheHits / this.metrics.totalRequests) * 100).toFixed(1)
      : 0;

    console.group('📊 Translation Performance Report');
    console.log(`⏱️  Monitoring Time: ${minutes}m ${seconds}s`);
    console.log(`📊 Total Requests: ${this.metrics.totalRequests}`);
    console.log(`📦 Batch Requests: ${this.metrics.batchRequests}`);
    console.log(`🔍 Individual Requests: ${this.metrics.individualRequests}`);
    console.log(`💾 Cache Hits: ${this.metrics.cacheHits}`);
    console.log(`📞 API Calls: ${this.metrics.apiCalls}`);
    console.log(`📈 Cache Hit Rate: ${cacheHitRate}%`);
    console.log(`❌ Errors: ${this.metrics.errors}`);
    
    if (this.metrics.totalRequests > 0) {
      const requestsPerSecond = this.metrics.totalRequests / (elapsedTime / 1000);
      console.log(`⚡ Requests/Second: ${requestsPerSecond.toFixed(2)}`);
    }
    
    console.groupEnd();
  }

  logCacheHit(text) {
    this.metrics.cacheHits++;
    console.log(`💾 Cache hit: "${text}"`);
  }

  logBatchTranslation(texts) {
    console.log(`📦 Batch translation requested: ${texts.length} texts`);
  }

  logCoordinatedTranslation(texts, requests) {
    console.log(`🔥 Coordinated translation: ${texts.length} texts for ${requests} requests`);
  }
}

// Initialize monitor
if (typeof window !== 'undefined') {
  window.translationMonitor = new TranslationPerformanceMonitor();
  
  // Add to global scope for easy access
  window.monitorTranslationPerformance = () => {
    return window.translationMonitor;
  };
  
  console.log('🎯 Translation Performance Monitor ready');
  
  // Log when language changes
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('Language changed to') || args[0].includes('Switching language')) {
        originalConsoleLog('🌐 Language change detected:', ...args);
      }
      if (args[0].includes('👁️ Component is intersecting')) {
        originalConsoleLog('🎯 Intersection Observer triggered:', ...args);
      }
      if (args[0].includes('🔥 Coordinated translation')) {
        originalConsoleLog('🚀 Translation Coordinator working:', ...args);
      }
    }
    originalConsoleLog.apply(console, args);
  };
}