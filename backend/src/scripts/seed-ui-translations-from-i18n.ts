import path from 'path';
import pool from '../config/database';

/**
 * Seed ALL static UI i18n keys (frontend src/i18n/resources.ts) into the translations table
 * so TranslationManagement becomes the CMS for every visitor-facing text.
 *
 * Key mapping must match how the frontend resolves DB rows:
 *   flat key = `${module}.${page}.${key}` and the frontend strips a leading "translation." prefix
 *   (see backend translationController.getTranslationsByLanguage + src/i18n/i18n-backend.ts).
 *   So a static key "profile.stats.museums" is stored as
 *   module='translation', page='profile', key='stats.museums'.
 *
 * Run with: npm run seed:ui-translations (uses tsx; do not import the frontend file statically —
 * it lives outside backend rootDir and would break `tsc` build).
 */

type FlatEntry = { page: string; key: string; text: string };

function flatten(obj: any, prefix: string[] = [], out: Record<string, string> = {}, skipped: string[] = []): Record<string, string> {
  for (const [k, v] of Object.entries(obj)) {
    const keyPath = [...prefix, k];
    if (typeof v === 'string') {
      out[keyPath.join('.')] = v;
    } else if (Array.isArray(v)) {
      // Arrays (e.g. profile.missionItems) stay static-only: flattening them to numeric
      // keys would make i18next returnObjects yield an object instead of an array.
      skipped.push(keyPath.join('.'));
    } else if (v && typeof v === 'object') {
      flatten(v, keyPath, out, skipped);
    }
  }
  return out;
}

function toDbEntry(flatKey: string, text: string): FlatEntry | null {
  const parts = flatKey.split('.');
  if (parts.length < 2) {
    // 1-segment keys cannot be represented as module.page.key — leave static-only
    return null;
  }
  return { page: parts[0], key: parts.slice(1).join('.'), text };
}

async function seed() {
  // Dynamic import with computed path so tsc (rootDir=src) never tries to compile the frontend file
  const resourcesPath = path.resolve(__dirname, '../../../src/i18n/resources.ts');
  const { resources } = await import(/* @vite-ignore */ resourcesPath);

  const languages: Array<'id' | 'en'> = ['id', 'en'];
  let inserted = 0;
  const skippedArrays: string[] = [];
  const skippedShallow: string[] = [];

  for (const lang of languages) {
    const tree = resources[lang]?.translation;
    if (!tree) {
      console.warn(`⚠️  No static resources for language: ${lang}`);
      continue;
    }

    const flat = flatten(tree, [], {}, skippedArrays);
    console.log(`🌐 ${lang}: ${Object.keys(flat).length} string keys found`);

    for (const [flatKey, text] of Object.entries(flat)) {
      const entry = toDbEntry(flatKey, text);
      if (!entry) {
        skippedShallow.push(flatKey);
        continue;
      }

      await pool.query(
        `INSERT INTO translations (module, page, key, language_code, text, auto_translated)
         VALUES ('translation', $1, $2, $3, $4, false)
         ON CONFLICT (module, page, key, language_code)
         DO NOTHING`,
        [entry.page, entry.key, lang, text]
      );
      inserted++;
    }
  }

  console.log('');
  console.log(`✅ Seed complete. Processed ${inserted} key/language pairs (existing DB values kept — ON CONFLICT DO NOTHING so admin edits are never overwritten).`);
  if (skippedArrays.length > 0) {
    console.log(`ℹ️  Skipped array keys (static-only): ${[...new Set(skippedArrays)].join(', ')}`);
  }
  if (skippedShallow.length > 0) {
    console.log(`ℹ️  Skipped 1-segment keys (static-only): ${[...new Set(skippedShallow)].join(', ')}`);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
