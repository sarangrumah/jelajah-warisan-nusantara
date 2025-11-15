/**
 * Quick Collection Route Diagnostic
 * 
 * This script helps identify the exact performance bottleneck on /collections route
 */

console.log('🔍 Starting Collection Route Performance Diagnostic...');

// Monitor translation service calls
const originalTranslateText = window.optimizedTranslationService?.translateText;
if (originalTranslateText) {
  let translationCallCount = 0;
  let apiCallCount = 0;
  const callLog = [];
  
  window.optimizedTranslationService.translateText = function(...args) {
    translationCallCount++;
    const startTime = performance.now();
    callLog.push({
      type: 'translateText',
      timestamp: startTime,
      args: args[0],
      callNumber: translationCallCount
    });
    
    console.log(`🔄 Translation Call #${translationCallCount}:`, args[0]);
    
    return originalTranslateText.apply(this, args).then(result => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`✅ Translation #${translationCallCount} completed in ${duration.toFixed(2)}ms`);
      return result;
    });
  };
}

// Monitor API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0] && args[0].includes('translate')) {
    const startTime = performance.now();
    apiCallCount++;
    console.log(`🌐 API Call #${apiCallCount}: ${args[0]}`);
    
    return originalFetch.apply(this, args).then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`✅ API Call #${apiCallCount} completed in ${duration.toFixed(2)}ms`);
      return response;
    });
  }
  return originalFetch.apply(this, args);
};

// Monitor component rendering
let componentRenderCount = 0;
const originalUseState = React.useState;
React.useState = function(...args) {
  componentRenderCount++;
  if (componentRenderCount % 50 === 0) {
    console.log(`⚛️ Component render count: ${componentRenderCount}`);
  }
  return originalUseState.apply(this, args);
};

// Performance monitoring
let performanceData = {
  startTime: performance.now(),
  translationCalls: 0,
  apiCalls: 0,
  componentRenders: 0,
  memoryUsage: []
};

const monitorInterval = setInterval(() => {
  const currentTime = performance.now();
  const elapsed = currentTime - performanceData.startTime;
  
  if (performance.memory) {
    performanceData.memoryUsage.push({
      time: elapsed,
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize
    });
  }
  
  if (elapsed > 10000) { // Stop after 10 seconds
    clearInterval(monitorInterval);
    console.log('📊 Performance Summary:');
    console.log(`⏱️ Total Time: ${elapsed.toFixed(2)}ms`);
    console.log(`🔄 Translation Calls: ${translationCallCount}`);
    console.log(`🌐 API Calls: ${apiCallCount}`);
    console.log(`⚛️ Component Renders: ${componentRenderCount}`);
    
    if (performanceData.memoryUsage.length > 0) {
      const memoryGrowth = performanceData.memoryUsage[performanceData.memoryUsage.length - 1].used - performanceData.memoryUsage[0].used;
      console.log(`💾 Memory Growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    }
    
    if (translationCallCount > 50) {
      console.log('❌ ISSUE: Too many translation calls detected');
    }
    if (apiCallCount > 10) {
      console.log('❌ ISSUE: Too many API calls detected');
    }
    if (componentRenderCount > 100) {
      console.log('❌ ISSUE: Too many component re-renders');
    }
  }
}, 1000);

console.log('🎯 Navigate to /collections route to see performance data...');
console.log('📈 Monitoring will run for 10 seconds and provide summary');