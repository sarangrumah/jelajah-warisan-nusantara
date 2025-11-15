// Script to update all files from react-i18next to hybrid translation system
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to update
const filesToUpdate = [
  'src/pages/Collection.tsx',
  'src/pages/CollectionDetail.tsx',
  'src/pages/MemoryOfWorld.tsx',
  'src/pages/Merchandise.tsx',
  'src/pages/MerchandiseDetail.tsx',
  'src/pages/HeritageDetail.tsx',
  'src/pages/Heritage.tsx',
  'src/pages/EventDetail.tsx',
  'src/pages/CompanyProfile.tsx',
  'src/pages/SitesDetail.tsx',
  'src/pages/Sites.tsx',
  'src/pages/PemanfaatanAsetDetail.tsx',
  'src/pages/PemanfaatanAset.tsx',
  
  'src/components/contact/ContactSection.tsx',
  'src/components/AgendaSection.tsx',
  'src/components/about/Services.tsx',
  'src/components/about/RulesAndSOP.tsx',
  'src/components/ManagementSectionDebug.tsx',
  'src/components/MerchandiseBanner.tsx',
  'src/components/ppid/PPIDSection.tsx',
  'src/components/NewsSection.tsx',
  'src/components/MerchandiseProductList.tsx',
  'src/components/ManagementSection.tsx',
  'src/components/layanan-konservasi/BannerSection.tsx',
  'src/components/HeroSection copy.tsx',
  'src/components/HeaderTranslationTest.tsx'
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace import statement
    const oldImport = "import { useTranslation } from 'react-i18next';";
    const newImport = "import { useHybridTranslation } from '@/components/HybridTranslationProvider';";
    
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport);
      
      // Replace usage
      const oldUsage = "const { t } = useTranslation();";
      const newUsage = "const { t } = useHybridTranslation();";
      
      if (content.includes(oldUsage)) {
        content = content.replace(oldUsage, newUsage);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`⚠️  No useTranslation hook found in: ${filePath}`);
      }
    } else {
      console.log(`ℹ️  No react-i18next import found in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🚀 Starting translation system migration...\n');

filesToUpdate.forEach(file => {
  updateFile(file);
});

console.log('\n🎉 Migration completed!');
console.log('\n📝 Next steps:');
console.log('1. Run the application to test the new hybrid translation system');
console.log('2. Monitor performance improvements');
console.log('3. Gradually update remaining components as needed');