# Translation System Migration Guide

## Overview

This guide provides instructions for migrating from the current i18n system to the new hybrid translation system that combines:

1. **Hardcoded translations** from i18n resources (for static content)
2. **LibreTranslate API** (for dynamic content)
3. **Memory caching** for performance optimization
4. **Batch processing** to minimize API calls

## Benefits

- **Faster translations**: Caching and batch processing reduce API calls
- **Fallback system**: Uses hardcoded translations when available, falls back to API
- **Seamless migration**: Compatible with existing `useTranslation` usage
- **Performance monitoring**: Built-in cache statistics and performance tracking

## Migration Steps

### Step 1: Update Imports

Replace existing `react-i18next` imports with hybrid translation imports:

**Before:**
```typescript
import { useTranslation } from 'react-i18next';
```

**After:**
```typescript
import { useHybridTranslation } from '@/components/HybridTranslationProvider';
// OR
import { useHybridTranslationContext } from '@/components/HybridTranslationProvider';
```

### Step 2: Update Hook Usage

**Before:**
```typescript
const { t, i18n } = useTranslation();
```

**After:**
```typescript
const { t, i18n } = useHybridTranslation();
// OR
const { t, i18n } = useHybridTranslationContext();
```

### Step 3: Update Component Structure

**Before:**
```typescript
const MyComponent = () => {
  const { t } = useTranslation();
  return <div>{t('nav.beranda')}</div>;
};
```

**After:**
```typescript
const MyComponent = () => {
  const { t } = useHybridTranslation();
  return <div>{t('nav.beranda')}</div>;
};
```

### Step 4: For Higher Order Components

**Before:**
```typescript
export default MyComponent;
```

**After:**
```typescript
import { withHybridTranslation } from '@/components/HybridTranslationProvider';
export default withHybridTranslation(MyComponent);
```

## Available Services

### 1. Hybrid Translation Service (`hybridTranslationService`)
- **Primary method**: `translateText({ text, source, target })`
- **Batch method**: `translateMultipleTexts({ texts, source, target })`
- **Cache management**: `clearCache()`, `getCacheStats()`

### 2. Optimized Translation Service (`optimizedTranslationService`)
- **Single translation**: `translateText({ text, source, target })`
- **Batch translation**: `translateBatch({ texts, source, target })`
- **Performance features**: Caching, retry logic, common translations

### 3. Translation Hooks

#### `useHybridTranslation()`
- Drop-in replacement for `useTranslation()`
- Uses hardcoded translations first, falls back to API
- Compatible with existing code

#### `useHybridTranslationContext()`
- For components that need context access
- Same interface as `useHybridTranslation()`

## Performance Optimization

### Cache Strategy
- **Memory cache**: 24-hour TTL for translations
- **Common translations**: Pre-cached navigation and UI text
- **Batch processing**: Multiple texts in single API call

### Batch Translation Example
```typescript
const { translations } = await hybridTranslationService.translateMultipleTexts({
  texts: ['Text 1', 'Text 2', 'Text 3'],
  source: 'id',
  target: 'en'
});
```

### Cache Management
```typescript
// Clear cache
hybridTranslationService.clearCache();

// Get cache statistics
const stats = hybridTranslationService.getCacheStats();
console.log('Cache entries:', stats.totalEntries);
