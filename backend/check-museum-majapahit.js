// Check Museum Majapahit data directly from database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMuseumMajapahit() {
    console.log('🔍 Checking Museum Majapahit in database...\n');
    
    try {
        // Check tb_sites table for Museum Majapahit
        console.log('1. Searching for Museum Majapahit in tb_sites table...');
        const { data: sites, error: sitesError } = await supabase
            .from('tb_sites')
            .select(`
                *,
                type_relation:tb_type_sites(id, name)
            `)
            .or('name.ilike.%majapahit%,title.ilike.%majapahit%,description.ilike.%majapahit%');
        
        if (sitesError) {
            console.error('❌ Error fetching sites:', sitesError);
            return;
        }
        
        console.log('✅ Query executed successfully');
        console.log(`📊 Found ${sites?.length || 0} results for "majapahit"`);
        
        if (sites && sites.length > 0) {
            console.log('\n🎯 Museum Majapahit found:');
            sites.forEach((site, index) => {
                console.log(`\n--- Museum ${index + 1} ---`);
                console.log('ID:', site.id);
                console.log('Name:', site.name);
                console.log('Title:', site.title);
                console.log('Type ID:', site.type);
                console.log('Type Name:', site.type_relation?.name || 'No type relation');
                console.log('Is Active:', site.is_active);
                console.log('Is Approved:', site.is_approved);
                console.log('Is Rejected:', site.is_rejected);
                console.log('Location:', site.location);
                console.log('Subtitle:', site.subtitle);
                console.log('Phone:', site.phone);
                console.log('Website:', site.website);
                console.log('Has Images:', site.images ? site.images.length : 0);
                console.log('Created At:', site.created_at);
                console.log('Updated At:', site.updated_at);
            });
        } else {
            console.log('❌ Museum Majapahit NOT found in database');
            
            // Show all museums for comparison
            console.log('\n📋 All museums in database:');
            const { data: allSites, error: allError } = await supabase
                .from('tb_sites')
                .select('id, name, title, is_active, is_approved, is_rejected')
                .order('name', { ascending: true });
            
            if (allError) {
                console.error('Error fetching all sites:', allError);
                return;
            }
            
            allSites?.forEach((site, index) => {
                console.log(`${index + 1}. ${site.name || site.title || 'NO NAME'} (ID: ${site.id}) - Active: ${site.is_active} - Approved: ${site.is_approved}`);
            });
        }
        
        // Check museum types
        console.log('\n2. Checking museum types...');
        const { data: types, error: typesError } = await supabase
            .from('tb_type_sites')
            .select('*')
            .order('name', { ascending: true });
        
        if (typesError) {
            console.error('Error fetching types:', typesError);
            return;
        }
        
        console.log('Available museum types:');
        types?.forEach(type => {
            console.log(`- ${type.name} (ID: ${type.id})`);
        });
        
    } catch (error) {
        console.error('❌ Error during database check:', error);
    }
}

// Check environment variables
console.log('Environment check:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey || supabaseKey === 'your-service-role-key') {
    console.log('\n⚠️  Warning: Missing or placeholder Supabase credentials');
    console.log('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
    process.exit(1);
}

checkMuseumMajapahit().then(() => {
    console.log('\n🏁 Database check completed');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});