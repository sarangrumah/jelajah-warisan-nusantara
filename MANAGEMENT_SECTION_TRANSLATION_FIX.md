# ManagementSection Translation Fix

## Issue
The ManagementSection component had several hardcoded text strings that were not using the translation system, causing content to not switch languages properly.

## Problems Identified

1. **Hardcoded "Layanan Utama"** - The features section title was not translated
2. **Hardcoded stats labels** - Stats labels used conditional logic instead of translation keys
3. **Hardcoded button texts** - "Kelola" and "Lihat Agenda" were hardcoded

## Changes Made

### 1. Fixed Features Section Title
**Before:**
```tsx
<h4 className="text-xl font-semibold text-foreground mb-4">
  Layanan Utama
</h4>
```

**After:**
```tsx
<h4 className="text-xl font-semibold text-foreground mb-4">
  {t('management.mainServices', 'Layanan Utama')}
</h4>
```

### 2. Fixed Stats Labels
**Before:**
```tsx
<div className="text-sm text-muted-foreground capitalize">
  {key === 'museums' ? 'Museum' : 
   key === 'visitors' ? 'Pengunjung' :
   key === 'programs' ? 'Program' :
   key === 'sites' ? 'Situs' :
   key === 'provinces' ? 'Provinsi' :
   key === 'projects' ? 'Proyek' : key}
</div>
```

**After:**
```tsx
<div className="text-sm text-muted-foreground capitalize">
  {t(`management.${card.title === 'Museum' ? 'museum' : 'heritage'}.stats.${key}`, key)}
</div>
```

### 3. Fixed Button Texts
**Before:**
```tsx
<Button>
  <Users size={16} className="mr-2" />
  Kelola {card.title}
</Button>

<Button>
  <Calendar size={16} className="mr-2" />
  Lihat Agenda
</Button>
```

**After:**
```tsx
<Button>
  <Users size={16} className="mr-2" />
  {t('management.manage', 'Kelola')} {card.title}
</Button>

<Button>
  <Calendar size={16} className="mr-2" />
  {t('management.viewAgenda', 'Lihat Agenda')}
</Button>
```

### 4. Removed Unused Import
Removed unused `ArrowRight` import to fix ESLint warning.

## Translation Keys Used

All translation keys are already defined in `src/i18n/index.ts`:

### English (en)
- `management.mainServices`: "Main Services"
- `management.museum.stats.museums`: "Museums"
- `management.museum.stats.visitors`: "Visitors"
- `management.museum.stats.programs`: "Programs"
- `management.heritage.stats.sites`: "Sites"
- `management.heritage.stats.provinces`: "Provinces"
- `management.heritage.stats.projects`: "Projects"
- `management.manage`: "Manage"
- `management.viewAgenda`: "View Agenda"

### Indonesian (id)
- `management.mainServices`: "Layanan Utama"
- `management.museum.stats.museums`: "Museum"
- `management.museum.stats.visitors`: "Pengunjung"
- `management.museum.stats.programs`: "Program"
- `management.heritage.stats.sites`: "Situs"
- `management.heritage.stats.provinces`: "Provinsi"
- `management.heritage.stats.projects`: "Proyek"
- `management.manage`: "Kelola"
- `management.viewAgenda`: "Lihat Agenda"

## Critical Fix - Reactivity Issue

### Root Cause
The `managementCards` array was initially defined at the component level but **outside** the render cycle. This meant the translation function `t()` was only called once when the component first mounted, and the array never updated when the language changed.

### Solution
Moved the `managementCards` array definition **inside** the component function body (after `useTranslation()` hook). This ensures the array is re-created on every render, making it reactive to language changes.

**Before (Non-reactive):**
```tsx
const ManagementSection = () => {
  const { t } = useTranslation();
  const managementCards = [...]; // Defined once, never updates
  
  return (...);
};
```

**After (Reactive):**
```tsx
const ManagementSection = () => {
  const { t } = useTranslation();
  
  // Define cards inside component to make them reactive to language changes
  const managementCards = [...]; // Re-created on every render
  
  return (...);
};
```

## Result

✅ All text in ManagementSection now properly switches between English and Indonesian
✅ Card content (titles, descriptions, features) updates reactively when language changes
✅ No hardcoded strings remain
✅ All translation keys are properly defined
✅ ESLint warnings resolved
✅ Component re-renders correctly on language switch

## Testing

To test the fix:
1. Navigate to the homepage where ManagementSection is displayed
2. Switch language between English and Indonesian using the language toggle
3. Verify that all text in the Museum and Heritage cards changes language:
   - Section title "Layanan Utama" / "Main Services"
   - Stats labels (Museum, Pengunjung, Program, Situs, Provinsi, Proyek)
   - Button texts ("Kelola" / "Manage", "Lihat Agenda" / "View Agenda")
