/**
 * Performance test for on-demand translation system
 * This script tests the efficiency of the translation system
 */

import { optimizedTranslationService } from './optimized-translation-service';

interface PerformanceMetrics {
  totalRequests: number;
  cacheHits: number;
  apiCalls: number;
  averageResponseTime: number;
  memoryUsage: number;
  errors: number;
}

class TranslationPerformanceTester {
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    apiCalls: 0,
    averageResponseTime: 0,
    memoryUsage: 0,
    errors: 0
  };

  private startTime: number = 0;
  private testTexts: string[] = [
    'Tentang Kami',
    'Destinasi',
    'Museum',
    'Warisan Budaya',
    'Koleksi',
    'Koleksi MCB',
    'Memory Of the World',
    'Agenda',
    'Struktur Organisasi',
    'Layanan Konservasi',
    'Media & Publikasi',
    'Peraturan',
    'Hubungi Kami',
    'Karir',
    'PPID',
    'SOP',
    'Admin',
    'Pemanfaatan Aset',
    'Merchandise',
    'Beranda'
  ];

  async runPerformanceTest() {
    console.log('🚀 Starting Translation Performance Test...');
    this.startTime = Date.now();

    // Test 1: Individual translations (simulating old behavior)
    console.log('\n📊 Test 1: Individual Translations');
    await this.testIndividualTranslations();

    // Test 2: Batch translations (new optimized behavior)
    console.log('\n📊 Test 2: Batch Translations');
    await this.testBatchTranslations();

    // Test 3: Cache performance
    console.log('\n📊 Test 3: Cache Performance');
    await this.testCachePerformance();

    // Test 4: Concurrent requests
    console.log('\n📊 Test 4: Concurrent Requests');
    await this.testConcurrentRequests();

    this.calculateMetrics();
    this.printResults();
  }

  private async testIndividualTranslations() {
    const startTime = Date.now();
    let individualApiCalls = 0;
    let individualCacheHits = 0;

    for (const text of this.testTexts) {
      try {
        const result = await optimizedTranslationService.translateText({
          text,
          source: 'id',
          target: 'en'
        });
        
        if (result === text) {
          individualCacheHits++;
        } else {
          individualApiCalls++;
        }
        
        this.metrics.totalRequests++;
      } catch (error) {
        this.metrics.errors++;
        console.error(`❌ Error translating "${text}":`, error);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`   ⏱️  Time: ${duration}ms`);
    console.log(`   📞 API Calls: ${individualApiCalls}`);
    console.log(`   💾 Cache Hits: ${individualCacheHits}`);
  }

  private async testBatchTranslations() {
    const startTime = Date.now();
    
    try {
      const result = await optimizedTranslationService.translateBatch({
        texts: this.testTexts,
        source: 'id',
        target: 'en'
      });

      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`   ⏱️  Time: ${duration}ms`);
      console.log(`   📞 API Calls: ${result.apiCalls}`);
      console.log(`   💾 Cache Hits: ${result.cacheHits}`);
      console.log(`   📝 Translated: ${result.translations.length} texts`);
      
      this.metrics.totalRequests += this.testTexts.length;
      this.metrics.cacheHits += result.cacheHits;
      this.metrics.apiCalls += result.apiCalls;
    } catch (error) {
      this.metrics.errors++;
      console.error('❌ Batch translation failed:', error);
    }
  }

  private async testCachePerformance() {
    console.log('   🔄 Testing cache performance...');
    
    // First call - should hit API
    const startTime1 = Date.now();
    const result1 = await optimizedTranslationService.translateBatch({
      texts: this.testTexts.slice(0, 5),
      source: 'id',
      target: 'en'
    });
    const duration1 = Date.now() - startTime1;
    
    // Second call - should hit cache
    const startTime2 = Date.now();
    const result2 = await optimizedTranslationService.translateBatch({
      texts: this.testTexts.slice(0, 5),
      source: 'id',
      target: 'en'
    });
    const duration2 = Date.now() - startTime2;

    console.log(`   📊 First call: ${duration1}ms, API Calls: ${result1.apiCalls}`);
    console.log(`   📊 Second call: ${duration2}ms, API Calls: ${result2.apiCalls}`);
    console.log(`   🚀 Performance improvement: ${((duration1 - duration2) / duration1 * 100).toFixed(1)}% faster`);
  }

  private async testConcurrentRequests() {
    console.log('   🔄 Testing concurrent requests...');
    
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        optimizedTranslationService.translateBatch({
          texts: this.testTexts.slice(0, 3),
          source: 'id',
          target: 'en'
        })
      );
    }

    const startTime = Date.now();
    const results = await Promise.allSettled(promises);
    const duration = Date.now() - startTime;

    let successful = 0;
    let failed = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful++;
        this.metrics.totalRequests += this.testTexts.slice(0, 3).length;
        this.metrics.cacheHits += result.value.cacheHits;
        this.metrics.apiCalls += result.value.apiCalls;
      } else {
        failed++;
        this.metrics.errors++;
      }
    });

    console.log(`   ⏱️  Time: ${duration}ms`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Average time per batch: ${(duration / promises.length).toFixed(2)}ms`);
  }

  private calculateMetrics() {
    const totalTime = Date.now() - this.startTime;
    this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;
    
    // Simulate memory usage (in a real scenario, you'd use performance.memory)
    this.metrics.memoryUsage = process.memoryUsage?.().heapUsed / 1024 / 1024 || 0;
  }

  private printResults() {
    console.log('\n🎯 PERFORMANCE TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`📊 Total Requests: ${this.metrics.totalRequests}`);
    console.log(`💾 Cache Hits: ${this.metrics.cacheHits}`);
    console.log(`📞 API Calls: ${this.metrics.apiCalls}`);
    console.log(`📈 Cache Hit Rate: ${((this.metrics.cacheHits / this.metrics.totalRequests) * 100).toFixed(1)}%`);
    console.log(`⏱️  Average Response Time: ${this.metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`💾 Memory Usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    console.log(`❌ Errors: ${this.metrics.errors}`);
    console.log('='.repeat(50));

    // Performance recommendations
    if (this.metrics.apiCalls > this.metrics.totalRequests * 0.3) {
      console.log('⚠️  Recommendation: Consider adding more common translations to reduce API calls');
    }
    
    if (this.metrics.averageResponseTime > 100) {
      console.log('⚠️  Recommendation: Response time is high, consider optimizing batch size');
    }
    
    if (this.metrics.errors > 0) {
      console.log('⚠️  Recommendation: Check translation service health and retry logic');
    }

    console.log('✅ Performance test completed!');
  }
}

// Run the test
const tester = new TranslationPerformanceTester();
tester.runPerformanceTest().catch(console.error);