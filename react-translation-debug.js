/**
 * React Translation Debug Script
 * 
 * This script helps identify React component re-rendering loops
 * that might be causing translation performance issues
 */

console.log('🔍 Starting React Translation Debug...');

// Track component renders
let renderCounts = new Map();
let translationCallCount = 0;
let apiCallCount = 0;

// Patch React components to track renders
const originalUseState = React.useState;
const originalUseEffect = React.useEffect;

React.useState = function(...args) {
    const [state, setState] = originalUseState.apply(this, args);
    
    // Track which component is calling useState
    const stack = new Error().stack;
    const componentName = stack.split('\n')[2]?.match(/at\s+(\w+)/)?.[1] || 'Unknown';
    
    if (!renderCounts.has(componentName)) {
        renderCounts.set(componentName, 0);
    }
    renderCounts.set(componentName, renderCounts.get(componentName) + 1);
    
    // Log excessive re-renders
    const count = renderCounts.get(componentName);
    if (count > 10 && count % 10 === 0) {
        console.warn(`⚠️ Component "${componentName}" has re-rendered ${count} times`);
    }
    
    return [state, setState];
};

// Monitor translation service
const originalTranslateText = window.optimizedTranslationService?.translateText;
if (originalTranslateText) {
    window.optimizedTranslationService.translateText = function(...args) {
        translationCallCount++;
        console.log(`🔄 Translation Call #${translationCallCount}:`, args[0]);
        
        // Check for rapid calls (potential loop)
        if (translationCallCount > 50) {
            console.error(`❌ EXCESSIVE: ${translationCallCount} translation calls detected - possible infinite loop`);
        }
        
        return originalTranslateText.apply(this, args);
    };
}

// Monitor API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
    if (args[0] && args[0].includes('translate')) {
        apiCallCount++;
        console.log(`🌐 API Call #${apiCallCount}: ${args[0]}`);
        
        // Check for rapid API calls
        if (apiCallCount > 20) {
            console.error(`❌ EXCESSIVE: ${apiCallCount} API calls detected - possible flooding`);
        }
    }
    return originalFetch.apply(this, args);
};

// Monitor useHybridTranslation hook
const originalUseHybridTranslation = window.useHybridTranslation;
if (originalUseHybridTranslation) {
    window.useHybridTranslation = function(...args) {
        console.log(`⚛️ useHybridTranslation called`);
        return originalUseHybridTranslation.apply(this, args);
    };
}

// Periodic monitoring
let monitoringInterval = setInterval(() => {
    console.log('📊 Current Stats:');
    console.log(`   Translation Calls: ${translationCallCount}`);
    console.log(`   API Calls: ${apiCallCount}`);
    console.log(`   Component Renders: ${Array.from(renderCounts.entries()).map(([name, count]) => `${name}: ${count}`).join(', ')}`);
    
    // Check for problematic patterns
    if (translationCallCount > 100) {
        console.error('🚨 CRITICAL: Excessive translation calls detected - stopping monitoring');
        clearInterval(monitoringInterval);
    }
}, 5000); // Check every 5 seconds

console.log('🎯 Monitoring started. Navigate to /collections route to see activity...');
console.log('⏰ Monitoring will run for 60 seconds automatically');

// Auto-stop after 60 seconds
setTimeout(() => {
    clearInterval(monitoringInterval);
    console.log('📊 Final Summary:');
    console.log(`   Total Translation Calls: ${translationCallCount}`);
    console.log(`   Total API Calls: ${apiCallCount}`);
    console.log('   Top Re-rendering Components:');
    
    const sortedComponents = Array.from(renderCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    sortedComponents.forEach(([name, count]) => {
        console.log(`     ${name}: ${count} renders`);
    });
    
    if (translationCallCount > 50) {
        console.log('🔧 RECOMMENDATION: Check for infinite loops in translation hooks');
    }
    if (apiCallCount > 20) {
        console.log('🔧 RECOMMENDATION: Implement batch translation or caching');
    }
    
}, 60000);

// Export functions for manual control
window.stopMonitoring = () => {
    clearInterval(monitoringInterval);
    console.log('🛑 Monitoring stopped');
};

window.getStats = () => {
    return {
        translationCalls: translationCallCount,
        apiCalls: apiCallCount,
        componentRenders: Object.fromEntries(renderCounts)
    };
};

console.log('ℹ️ Commands available:');
console.log('   stopMonitoring() - Stop the monitoring');
console.log('   getStats() - Get current statistics');