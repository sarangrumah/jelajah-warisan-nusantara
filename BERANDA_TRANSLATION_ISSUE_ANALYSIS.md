# Beranda Translation Issue Analysis

## Problem Identified

The sections in `Beranda.tsx` are not translating properly when switching languages because the child components have **hardcoded text** instead of using the translation system.

## Affected Components

### 1. ManagementSection.tsx
**Issues:**
- Hardcoded Indonesian text in `managementCards` array:
  - `title: 'Museum'` and `title: 'Cagar Budaya'`
  - `description` fields with Indonesian text
  - `features` array with Indonesian text
  - Stats labels: 'Museum', 'Pengunjung', 'Program', 'Situs', 'Provinsi', 'Proyek'
  - Button text: "Layanan Utama", "Kelola {title}", "Lihat Agenda"

**Current Code Pattern:**
```typescript
const managementCards = [
  {
    title: 'Museum',  // ❌ Hardcoded
    description: 'Pengelolaan koleksi...',  // ❌ Hardcoded
    features: ['Sistem koleksi digital', ...]  // ❌ Hardcoded
  }
];
```

**Should Be:**
```typescript
// Use translation keys
<h3>{t('management.museum.title')}</h3>
<p>{t('management.museum.description')}</p>
```

### 2. DistributionSection.tsx
**Issues:**
- Hardcoded title: "Sebaran Museum dan Cagar Budaya"
- Hardcoded subtitle
- Hardcoded region names and labels

## Root Cause

The components are importing `useTranslation` hook but **NOT using it** to translate the content. Instead, they have hardcoded Indonesian strings directly in the component.

## Solution

You have two options:

### Option A: Use Translation Keys (Recommended)
Update the components to use `t()` function with translation keys that are already defined in `src/i18n/index.ts`.

**Example for ManagementSection:**
```typescript
// Instead of hardcoded data
const card = {
  title: 'Museum',
  description: 'Pengelolaan koleksi...'
};

// Use translation keys
<h3>{t('management.museum.title')}</h3>
<p>{t('management.museum.description')}</p>
```

### Option B: Keep Hardcoded Text + Add LibreTranslate API
If you want to keep the hardcoded Indonesian text and translate it dynamically:
1. The text would need to be sent to LibreTranslate API
2. This adds API calls and latency
3. Not recommended for static UI text

## Translation Keys Already Available

I've already added these translation keys to `src/i18n/index.ts`:

```typescript
management: {
  mainServices: "Main Services" / "Layanan Utama",
  museum: {
    title: "Museum",
    description: "Management of collections...",
    features: [...],
    stats: { museums, visitors, programs }
  },
  heritage: {
    title: "Cultural Heritage" / "Cagar Budaya",
    description: "Preservation and protection...",
    features: [...],
    stats: { sites, provinces, projects }
  },
  manage: "Manage" / "Kelola",
  viewAgenda: "View Agenda" / "Lihat Agenda"
}
```

## Recommended Fix

Update `ManagementSection.tsx` to use the translation keys:

```typescript
// Change from hardcoded array to using translations
const managementCards = [
  {
    icon: Building2,
    type: 'museum',  // Use type to reference translation keys
    stats: { museums: museumStat.museums, visitors: museumStat.visitors, programs: museumStat.programs },
    gradient: 'from-primary to-primary-glow'
  },
  {
    icon: Landmark,
    type: 'heritage',
    stats: { sites: museumStat.sites, provinces: museumStat.provinces, projects: museumStat.projects },
    gradient: 'from-accent to-secondary'
  }
];

// Then in JSX, use:
<h3>{t(`management.${card.type}.title`)}</h3>
<p>{t(`management.${card.type}.description`)}</p>
{t(`management.${card.type}.features`, { returnObjects: true }).map(...)}
```

## Why LibreTranslate Isn't Helping

LibreTranslate is for **dynamic content** from the database (like museum descriptions, news articles, etc.). It won't automatically translate **hardcoded UI text** in your React components.

For UI text:
- ✅ Use i18n translation keys (fast, no API calls)
- ❌ Don't use LibreTranslate API (slow, unnecessary)

For database content:
- ✅ Use LibreTranslate API
- ✅ Store translations in database

## Next Steps

1. **Keep the existing text** - Don't remove anything
2. **Add translation usage** - Wrap the hardcoded text with `t()` function
3. **Test language switching** - Verify translations work

Would you like me to show you exactly which lines to modify in ManagementSection.tsx without removing any existing functionality?
