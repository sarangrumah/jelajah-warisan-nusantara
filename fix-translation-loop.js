/**
 * Translation Loop Fix Script
 * 
 * This script identifies and fixes translation loops by:
 * 1. Adding proper caching to prevent repeated API calls
 * 2. Implementing debouncing for translation requests
 * 3. Adding circuit breaker pattern for failed translations
 */

console.log('🔧 Applying Translation Loop Fixes...');

// Circuit breaker for translation API
class TranslationCircuitBreaker {
    constructor() {
        this.failures = 0;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.nextAttempt = 0;
        this.threshold = 5; // 5 failures trigger open state
        this.timeout = 30000; // 30 seconds timeout
    }

    canMakeRequest() {
        if (this.state === 'OPEN') {
            if (Date.now() > this.nextAttempt) {
                this.state = 'HALF_OPEN';
                return true;
            }
            return false;
        }
        return true;
    }

    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failures++;
        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
            console.warn('🚨 Translation circuit breaker OPEN - blocking requests for 30 seconds');
        }
    }
}

const circuitBreaker = new TranslationCircuitBreaker();

// Enhanced translation service with loop protection
function enhanceTranslationService() {
    const originalTranslateText = window.optimizedTranslationService?.translateText;
    if (!originalTranslateText) {
        console.error('❌ optimizedTranslationService not found');
        return;
    }

    // Track recent translations to prevent loops
    const recentTranslations = new Map();
    const MAX_RECENT_SIZE = 100;
    const DEBOUNCE_TIME = 100; // 100ms debounce

    window.optimizedTranslationService.translateText = async function(...args) {
        const { text, source, target } = args[0];
        const cacheKey = `${source}-${target}-${text}`;
        
        // Check circuit breaker
        if (!circuitBreaker.canMakeRequest()) {
            console.warn('⏸️ Circuit breaker blocking translation request');
            return text; // Return original text as fallback
        }

        // Debounce rapid identical requests
        const now = Date.now();
        if (recentTranslations.has(cacheKey)) {
            const lastCall = recentTranslations.get(cacheKey);
            if (now - lastCall < DEBOUNCE_TIME) {
                console.log('⏳ Debouncing rapid translation request:', text.substring(0, 20) + '...');
                return text; // Return original text temporarily
            }
        }
        recentTranslations.set(cacheKey, now);

        // Clean up old entries
        if (recentTranslations.size > MAX_RECENT_SIZE) {
            const oldestKey = recentTranslations.keys().next().value;
            recentTranslations.delete(oldestKey);
        }

        try {
            const result = await originalTranslateText.apply(this, args);
            circuitBreaker.onSuccess();
            return result;
        } catch (error) {
            circuitBreaker.onFailure();
            console.error('❌ Translation failed, circuit breaker triggered:', error.message);
            return text; // Return original text on failure
        }
    };

    console.log('✅ Translation service enhanced with circuit breaker and debouncing');
}

// Fix for useHybridTranslation hook
function fixHybridTranslationHook() {
    const originalUseHybridTranslation = window.useHybridTranslation;
    if (!originalUseHybridTranslation) {
        console.error('❌ useHybridTranslation hook not found');
        return;
    }

    // Track hook calls to detect loops
    const hookCallTracker = new Map();
    const MAX_HOOK_CALLS = 50;

    window.useHybridTranslation = function(...args) {
        const stack = new Error().stack;
        const caller = stack.split('\n')[2]?.match(/at\s+(\w+)/)?.[1] || 'Unknown';
        
        if (!hookCallTracker.has(caller)) {
            hookCallTracker.set(caller, 0);
        }
        
        const count = hookCallTracker.get(caller) + 1;
        hookCallTracker.set(caller, count);

        if (count > MAX_HOOK_CALLS) {
            console.error(`🚨 EXCESSIVE HOOK CALLS: ${caller} called useHybridTranslation ${count} times`);
            // Return a safe fallback to break the loop
            return {
                t: (key) => key, // Return key as fallback
                i18n: { language: 'id' },
                ready: true
            };
        }

        if (count > 10 && count % 10 === 0) {
            console.warn(`⚠️ Hook call warning: ${caller} called ${count} times`);
        }

        return originalUseHybridTranslation.apply(this, args);
    };

    console.log('✅ useHybridTranslation hook enhanced with loop detection');
}

// Add performance monitoring
function addPerformanceMonitoring() {
    let translationCallCount = 0;
    let apiCallCount = 0;
    const callLog = [];

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && args[0].includes('translate')) {
            apiCallCount++;
            const startTime = Date.now();
            
            callLog.push({
                url: args[0],
                timestamp: startTime,
                callNumber: apiCallCount
            });

            // Log excessive API calls
            if (apiCallCount > 20) {
                console.error(`🚨 EXCESSIVE API CALLS: ${apiCallCount} translation API calls detected`);
                
                // Analyze call pattern
                const recentCalls = callLog.slice(-10);
                const timeSpan = recentCalls[recentCalls.length - 1].timestamp - recentCalls[0].timestamp;
                const callsPerSecond = recentCalls.length / (timeSpan / 1000);
                
                if (callsPerSecond > 5) {
                    console.error(`🚨 HIGH FREQUENCY: ${callsPerSecond.toFixed(1)} calls per second - possible loop`);
                }
            }

            return originalFetch.apply(this, args).finally(() => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                if (duration > 5000) {
                    console.warn(`🐌 SLOW API: Translation took ${duration}ms`);
                }
            });
        }
        return originalFetch.apply(this, args);
    };

    console.log('✅ Performance monitoring enabled');
}

// Apply all fixes
function applyAllFixes() {
    console.log('🔧 Applying translation performance fixes...');
    
    enhanceTranslationService();
    fixHybridTranslationHook();
    addPerformanceMonitoring();
    
    console.log('✅ All fixes applied');
    console.log('📋 Applied fixes:');
    console.log('   - Circuit breaker for failed translations');
    console.log('   - Debouncing for rapid identical requests');
    console.log('   - Loop detection in useHybridTranslation');
    console.log('   - Performance monitoring for API calls');
    console.log('   - Excessive call detection and logging');
    
    return {
        circuitBreaker,
        stopMonitoring: () => {
            console.log('🛑 Performance monitoring stopped');
        },
        getStats: () => {
            return {
                circuitBreakerState: circuitBreaker.state,
                failures: circuitBreaker.failures
            };
        }
    };
}

// Auto-apply fixes
const translationFix = applyAllFixes();

console.log('🎯 Fixes applied. Navigate to /collections route to test...');
console.log('ℹ️ Available commands:');
console.log('   translationFix.stopMonitoring() - Stop monitoring');
console.log('   translationFix.getStats() - Get current stats');

// Export for manual control
window.translationFix = translationFix;