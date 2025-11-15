/**
 * Collection Route Performance Diagnostic Script
 * 
 * This script helps identify performance bottlenecks in the /collections route
 * by monitoring translation API calls, memory usage, and component rendering.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  logFile: './collection-performance.log',
  maxLogSize: 10 * 1024 * 1024, // 10MB
  sampleInterval: 1000, // 1 second
  maxSamples: 60 // 1 minute of monitoring
};

class PerformanceMonitor {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
    this.sampleCount = 0;
    this.translationCalls = 0;
    this.apiCalls = 0;
    this.memoryUsage = [];
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
    
    // Write to file periodically
    if (this.logs.length >= 10) {
      this.flushLogs();
    }
  }

  flushLogs() {
    try {
      const logContent = this.logs.join('\n') + '\n';
      fs.appendFileSync(CONFIG.logFile, logContent);
      this.logs = [];
    } catch (error) {
      console.error('Failed to write logs:', error);
    }
  }

  sampleMemory() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memory = process.memoryUsage();
      this.memoryUsage.push({
        timestamp: Date.now(),
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external
      });
    }
  }

  recordTranslationCall() {
    this.translationCalls++;
    this.log(`Translation call #${this.translationCalls} at ${Date.now() - this.startTime}ms`);
  }

  recordApiCall() {
    this.apiCalls++;
    this.log(`API call #${this.apiCalls} at ${Date.now() - this.startTime}ms`);
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    const report = [
      '=== COLLECTION ROUTE PERFORMANCE REPORT ===',
      `Monitoring Duration: ${duration}ms`,
      `Translation Calls: ${this.translationCalls}`,
      `API Calls: ${this.apiCalls}`,
      `Memory Samples: ${this.memoryUsage.length}`,
      '',
      'Memory Usage Summary:'
    ];

    if (this.memoryUsage.length > 0) {
      const first = this.memoryUsage[0];
      const last = this.memoryUsage[this.memoryUsage.length - 1];
      report.push(`Initial RSS: ${(first.rss / 1024 / 1024).toFixed(2)} MB`);
      report.push(`Final RSS: ${(last.rss / 1024 / 1024).toFixed(2)} MB`);
      report.push(`Memory Growth: ${((last.rss - first.rss) / 1024 / 1024).toFixed(2)} MB`);
    }

    report.push('');
    report.push('=== POTENTIAL ISSUES ===');
    
    if (this.translationCalls > 50) {
      report.push('❌ HIGH: Too many translation calls detected');
    }
    
    if (this.apiCalls > 10) {
      report.push('❌ HIGH: Too many API calls detected');
    }
    
    if (this.memoryUsage.length > 0) {
      const memoryGrowth = this.memoryUsage[this.memoryUsage.length - 1].rss - this.memoryUsage[0].rss;
      if (memoryGrowth > 50 * 1024 * 1024) { // 50MB growth
        report.push('❌ HIGH: Significant memory growth detected');
      }
    }

    if (this.translationCalls === 0 && this.apiCalls === 0) {
      report.push('⚠️ WARNING: No translation/API activity detected - check if monitoring is working');
    }

    return report.join('\n');
  }
}

// Create monitoring patches
function patchTranslationServices() {
  const monitor = new PerformanceMonitor();
  
  // Patch optimizedTranslationService
  const originalTranslateText = require('./src/lib/optimized-translation-service').optimizedTranslationService.translateText;
  require('./src/lib/optimized-translation-service').optimizedTranslationService.translateText = function(...args) {
    monitor.recordTranslationCall();
    monitor.log(`translateText called with: ${JSON.stringify(args[0])}`);
    return originalTranslateText.apply(this, args);
  };

  // Patch hybridTranslationService
  const originalQueueTranslation = require('./src/lib/hybrid-translation-service').hybridTranslationService.queueTranslation;
  require('./src/lib/hybrid-translation-service').hybridTranslationService.queueTranslation = function(...args) {
    monitor.recordTranslationCall();
    monitor.log(`queueTranslation called with: ${JSON.stringify(args[0])}`);
    return originalQueueTranslation.apply(this, args);
  };

  // Patch fetch calls to LibreTranslate
  const originalFetch = global.fetch;
  global.fetch = function(...args) {
    if (args[0] && args[0].includes('translate')) {
      monitor.recordApiCall();
      monitor.log(`API call to: ${args[0]}`);
    }
    return originalFetch.apply(this, args);
  };

  // Start memory sampling
  const interval = setInterval(() => {
    monitor.sampleMemory();
    monitor.sampleCount++;
    
    if (monitor.sampleCount >= CONFIG.maxSamples) {
      clearInterval(interval);
      const report = monitor.generateReport();
      console.log('\n' + report);
      monitor.flushLogs();
      console.log(`\nFull log saved to: ${CONFIG.logFile}`);
    }
  }, CONFIG.sampleInterval);

  monitor.log('Performance monitoring started for /collections route');
  return monitor;
}

// Usage instructions
console.log(`
=== Collection Route Performance Diagnostic ===

This script will:
1. Monitor translation service calls
2. Track API calls to LibreTranslate
3. Sample memory usage every second
4. Generate a performance report

To use:
1. Run this script: node diagnose-collection-performance.js
2. Navigate to /collections route in your browser
3. Wait for the monitoring to complete (60 seconds)
4. Check the generated report in collection-performance.log

The script will patch the translation services to track performance metrics.
`);

// Export for use in other files
if (require.main === module) {
  patchTranslationServices();
} else {
  module.exports = { PerformanceMonitor, patchTranslationServices };
}