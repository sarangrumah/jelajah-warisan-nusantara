import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Import the content translation service
import contentTranslationService from './backend/src/services/contentTranslationService.js';

async function testBackendTranslation() {
  try {
    console.log('🧪 Testing Backend Translation Service...\n');

    // Test the HTML stripping with actual museum data
    console.log('1. Testing HTML stripping with real museum data...');
    
    const museumResult = await pool.query(
      "SELECT id, name, description FROM tb_sites WHERE id = 'a9de131a-05f9-41ff-9353-18c2126c1a9e'"
    );

    if (museumResult.rows.length > 0) {
      const museum = museumResult.rows[0];
      console.log(`✅ Found museum: ${museum.name}`);
      console.log(`   Original description: ${museum.description.substring(0, 100)}...`);
      
      // Test the translateField method which now includes HTML stripping
      console.log('\n2. Testing translateField with HTML stripping...');
      const translated = await contentTranslationService.translateField(
        museum.description,
        'en', // target language
        'id'  // source language
      );
      
      console.log('✅ Translation completed:');
      console.log(`   Translated description: ${translated.substring(0, 100)}...`);
      
      // Check if HTML tags are present
      const hasHtml = translated.includes('<');
      console.log(`   HTML tags present: ${hasHtml ? '❌ Yes' : '✅ No'}`);
      
      if (!hasHtml) {
        console.log('🎉 SUCCESS: HTML tags have been stripped from translated text!');
      } else {
        console.log('⚠️  WARNING: HTML tags still present in translated text');
      }
    } else {
      console.log('❌ Museum not found');
    }

    console.log('\n3. Testing with sample HTML content...');
    
    // Test with known HTML content
    const htmlContent = '<p>This is a <strong>test</strong> description with <em>HTML</em> tags</p>';
    console.log(`   Original: ${htmlContent}`);
    
    const translatedSample = await contentTranslationService.translateField(
      htmlContent,
      'en',
      'id'
    );
    
    console.log(`   Translated: ${translatedSample}`);
    console.log(`   HTML stripped: ${translatedSample.includes('<') ? '❌ No' : '✅ Yes'}`);

    console.log('\n✅ Backend translation test completed!');

  } catch (error) {
    console.error('❌ Error testing backend translation:', error);
    console.log('\n💡 Note: This test requires the backend to be properly configured');
  } finally {
    await pool.end();
  }
}

testBackendTranslation();