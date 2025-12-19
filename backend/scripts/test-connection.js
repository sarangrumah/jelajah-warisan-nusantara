const { Pool } = require('pg');
require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🔧 Testing database connection...\n');
    
    // Support both DATABASE_URL and individual DB_* variables
    let poolConfig;
    if (process.env.DATABASE_URL) {
        poolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
        };
    } else {
        poolConfig = {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        };
    }
    
    const pool = new Pool(poolConfig);

    try {
        // Test connection
        console.log('🔌 Attempting to connect to database...');
        const client = await pool.connect();
        console.log('✅ Database connection successful!');
        
        // Test tb_sites table access
        console.log('📊 Checking tb_sites table...');
        const result = await client.query('SELECT COUNT(*) as count FROM tb_sites');
        const siteCount = result.rows[0].count;
        console.log(`📈 Found ${siteCount} sites in tb_sites table`);
        
        // Test for missing data
        const missingQuery = `
            SELECT COUNT(*) as missing_count
            FROM tb_sites 
            WHERE (
                phone IS NULL OR phone = '' OR 
                whatsapp IS NULL OR whatsapp = '' OR 
                website IS NULL OR website = '' OR 
                description IS NULL OR description = '' OR 
                opening_hours IS NULL OR opening_hours = '{}'::jsonb OR
                facilities IS NULL OR facilities = '{}' OR
                ticket_price IS NULL OR ticket_price = ''
            )
        `;
        
        const missingResult = await client.query(missingQuery);
        const missingCount = missingResult.rows[0].missing_count;
        console.log(`⚠️ Found ${missingCount} sites with missing data`);
        
        // Show sample sites with missing data
        if (missingCount > 0) {
            const sampleQuery = `
                SELECT name, type, address 
                FROM tb_sites 
                WHERE (
                    phone IS NULL OR phone = '' OR 
                    website IS NULL OR website = '' OR 
                    description IS NULL OR description = ''
                )
                LIMIT 5
            `;
            
            const sampleResult = await client.query(sampleQuery);
            console.log('\n📋 Sample sites needing completion:');
            sampleResult.rows.forEach((site, index) => {
                console.log(`${index + 1}. ${site.name} (${site.type}) - ${site.address}`);
            });
        }
        
        client.release();
        console.log('\n✅ Database test completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('\n🔧 Please check your configuration:');
        if (process.env.DATABASE_URL) {
            console.error('- DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
        } else {
            console.error('- DB_HOST:', process.env.DB_HOST || 'NOT SET');
            console.error('- DB_PORT:', process.env.DB_PORT || 'NOT SET');
            console.error('- DB_NAME:', process.env.DB_NAME || 'NOT SET');
            console.error('- DB_USER:', process.env.DB_USER || 'NOT SET');
            console.error('- DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
        }
        return false;
    } finally {
        await pool.end();
    }
}

// Test internet connectivity for web scraping
async function testInternetConnection() {
    console.log('\n🌐 Testing internet connection for web scraping...');
    
    try {
        const axios = require('axios');
        const response = await axios.get('https://httpbin.org/get', { timeout: 5000 });
        
        if (response.status === 200) {
            console.log('✅ Internet connection successful!');
            console.log('🌍 Web scraping is possible');
            return true;
        }
    } catch (error) {
        console.error('❌ Internet connection test failed:', error.message);
        console.log('⚠️ Web scraping may not work properly');
        return false;
    }
}

async function main() {
    console.log('🚀 Sites Data Completion - Connection Test\n');
    
    const dbSuccess = await testDatabaseConnection();
    const netSuccess = await testInternetConnection();
    
    console.log('\n📋 TEST SUMMARY:');
    console.log('================');
    console.log(`Database Connection: ${dbSuccess ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Internet Connection: ${netSuccess ? '✅ PASS' : '❌ FAIL'}`);
    
    if (dbSuccess && netSuccess) {
        console.log('\n🎉 Ready to run sites data completion script!');
        console.log('Run: node scripts/complete-sites-data.js');
    } else {
        console.log('\n⚠️ Please fix connection issues before running the main script');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testDatabaseConnection, testInternetConnection };