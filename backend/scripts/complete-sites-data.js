const { Pool } = require('pg');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

class SitesDataCompleter {
    constructor() {
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
        
        this.pool = new Pool(poolConfig);

        // Data sources for different types of information
        this.sources = {
            // Indonesian tourism and heritage sites
            indonesia: {
                tourism: 'https://www.indonesia.travel/gb/en',
                kemdikbud: 'https://www.kemdikbud.go.id',
                bpcb: 'https://www.bpcb.kemdikbud.go.id'
            },
            // Search engines and directories
            search: {
                google: 'https://www.google.com/search',
                wikidata: 'https://www.wikidata.org',
                wikipedia: 'https://en.wikipedia.org'
            }
        };

        // Common data patterns
        this.patterns = {
            phone: /(\+62|62|0)[-\s]?8[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{3,4}/g,
            whatsapp: /(\+62|62|0)8[0-9]{2}[0-9]{3,4}/g,
            website: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            ticket: /(Rp|rp|RP)[\s]?[\d,.]+|\d+[\s]?(rupiah|thousand|k|ribu)/gi
        };
    }

    async initialize() {
        try {
            await this.pool.connect();
            console.log('✅ Database connection established');
            
            // Test connection
            const result = await this.pool.query('SELECT COUNT(*) as count FROM tb_sites');
            console.log(`📊 Found ${result.rows[0].count} sites in database`);
            
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
    }

    async getSitesWithMissingData() {
        const query = `
            SELECT id, name, type, address, description, phone, whatsapp, website, 
                   opening_hours, facilities, ticket_price, ticket_url
            FROM tb_sites 
            WHERE (
                phone IS NULL OR phone = '' OR 
                whatsapp IS NULL OR whatsapp = '' OR 
                website IS NULL OR website = '' OR 
                description IS NULL OR description = '' OR 
                opening_hours IS NULL OR opening_hours = '{}'::jsonb OR
                facilities IS NULL OR facilities = '{}' OR
                ticket_price IS NULL OR ticket_price = '' OR
                ticket_url IS NULL OR ticket_url = ''
            )
            ORDER BY updated_at ASC
            LIMIT 50
        `;
        
        try {
            const result = await this.pool.query(query);
            console.log(`🔍 Found ${result.rows.length} sites with missing data`);
            return result.rows;
        } catch (error) {
            console.error('❌ Error fetching sites:', error.message);
            return [];
        }
    }

    async searchSiteInformation(site) {
        const results = {};
        const searchQueries = [
            `${site.name} ${site.type} Indonesia`,
            `${site.name} heritage site Indonesia`,
            `${site.address} museum Indonesia`,
            `${site.name} visit information Indonesia`
        ];

        try {
            // Search multiple sources in parallel
            const searchPromises = searchQueries.map(query => 
                this.searchWeb(query, site)
            );
            
            const searchResults = await Promise.allSettled(searchPromises);
            
            // Process results
            for (const result of searchResults) {
                if (result.status === 'fulfilled') {
                    Object.assign(results, result.value);
                }
            }

            return results;
        } catch (error) {
            console.error(`❌ Error searching for ${site.name}:`, error.message);
            return {};
        }
    }

    async searchWeb(query, site) {
        const results = {};
        
        try {
            // Use a public search API or scraping service
            // For demo purposes, using DuckDuckGo's instant answer API
            const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
            
            const response = await axios.get(searchUrl, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const data = response.data;
            
            // Extract information from different sources
            if (data.Abstract) {
                results.description = this.cleanText(data.Abstract);
            }
            
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                const topic = data.RelatedTopics[0];
                if (topic.Text) {
                    results.description = this.cleanText(topic.Text);
                }
            }

            // Extract specific information from the content
            if (data.AbstractText) {
                const extracted = this.extractInformation(data.AbstractText);
                Object.assign(results, extracted);
            }

            // Search for Wikipedia page if available
            if (data.Results && data.Results.length > 0) {
                const wikipediaResult = data.Results.find(r => 
                    r.FirstURL && r.FirstURL.includes('wikipedia.org')
                );
                
                if (wikipediaResult) {
                    const wikiInfo = await this.getWikipediaInfo(wikipediaResult.FirstURL);
                    Object.assign(results, wikiInfo);
                }
            }

        } catch (error) {
            console.error(`❌ Web search failed for query: ${query}`, error.message);
        }

        return results;
    }

    async getWikipediaInfo(url) {
        try {
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const $ = cheerio.load(response.data);
            const results = {};

            // Extract basic information
            const intro = $('#mw-content-text p').first().text().trim();
            if (intro) {
                results.description = this.cleanText(intro);
            }

            // Extract table information (if it's an infobox)
            $('.infobox td').each((i, element) => {
                const label = $(element).prev('th').text().toLowerCase().trim();
                const value = $(element).text().trim();

                if (label.includes('phone') || label.includes('contact')) {
                    const phone = this.extractPhone(value);
                    if (phone) results.phone = phone;
                }

                if (label.includes('website') || label.includes('url')) {
                    const website = this.extractWebsite(value);
                    if (website) results.website = website;
                }

                if (label.includes('address')) {
                    results.address = value;
                }

                if (label.includes('hours') || label.includes('time')) {
                    results.opening_hours = this.parseOpeningHours(value);
                }

                if (label.includes('ticket') || label.includes('admission')) {
                    const ticket = this.extractTicketPrice(value);
                    if (ticket) results.ticket_price = ticket;
                }
            });

            return results;
        } catch (error) {
            console.error('❌ Wikipedia extraction failed:', error.message);
            return {};
        }
    }

    extractInformation(text) {
        const results = {};
        
        // Extract phone number
        const phoneMatch = text.match(this.patterns.phone);
        if (phoneMatch) {
            results.phone = phoneMatch[0];
        }

        // Extract WhatsApp
        const whatsappMatch = text.match(this.patterns.whatsapp);
        if (whatsappMatch) {
            results.whatsapp = whatsappMatch[0];
        }

        // Extract website
        const websiteMatch = text.match(this.patterns.website);
        if (websiteMatch) {
            results.website = websiteMatch[0];
        }

        // Extract email
        const emailMatch = text.match(this.patterns.email);
        if (emailMatch) {
            results.email = emailMatch[0];
        }

        // Extract ticket price
        const ticketMatch = text.match(this.patterns.ticket);
        if (ticketMatch) {
            results.ticket_price = ticketMatch[0];
        }

        return results;
    }

    extractPhone(text) {
        const phones = text.match(this.patterns.phone);
        return phones ? phones[0] : null;
    }

    extractWebsite(text) {
        const websites = text.match(this.patterns.website);
        return websites ? websites[0] : null;
    }

    extractTicketPrice(text) {
        const prices = text.match(this.patterns.ticket);
        return prices ? prices[0] : null;
    }

    parseOpeningHours(text) {
        // Simple parser for opening hours
        const hours = {};
        const lines = text.split('\n');
        
        for (const line of lines) {
            const match = line.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:?\s*(.+)/i);
            if (match) {
                hours[match[1].toLowerCase()] = match[2].trim();
            }
        }
        
        return Object.keys(hours).length > 0 ? hours : null;
    }

    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\[.*?\]/g, '')
            .trim();
    }

    async updateSiteData(siteId, newData) {
        if (Object.keys(newData).length === 0) return false;

        try {
            // Build dynamic update query
            const fields = [];
            const values = [];
            let paramCount = 1;

            for (const [field, value] of Object.entries(newData)) {
                if (value && value.trim() !== '') {
                    fields.push(`${field} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            }

            if (fields.length === 0) return false;

            fields.push(`updated_at = NOW()`);
            
            const query = `
                UPDATE tb_sites 
                SET ${fields.join(', ')}
                WHERE id = $${paramCount}
            `;
            values.push(siteId);

            const result = await this.pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            console.error(`❌ Error updating site ${siteId}:`, error.message);
            return false;
        }
    }

    async processSitesBatch(batchSize = 5) {
        const sites = await this.getSitesWithMissingData();
        
        if (sites.length === 0) {
            console.log('✅ All sites have complete data!');
            return;
        }

        console.log(`🚀 Starting to process ${sites.length} sites...`);
        
        // Process in batches to avoid overwhelming external services
        for (let i = 0; i < sites.length; i += batchSize) {
            const batch = sites.slice(i, i + batchSize);
            console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sites.length/batchSize)}`);
            
            const batchPromises = batch.map(site => this.processSingleSite(site));
            await Promise.allSettled(batchPromises);
            
            // Rate limiting - wait between batches
            if (i + batchSize < sites.length) {
                console.log('⏳ Waiting 2 seconds before next batch...');
                await this.sleep(2000);
            }
        }

        console.log('\n✅ Processing completed!');
    }

    async processSingleSite(site) {
        console.log(`🔍 Processing: ${site.name}`);
        
        try {
            const newData = await this.searchSiteInformation(site);
            
            if (Object.keys(newData).length > 0) {
                console.log(`📝 Found data for ${site.name}:`, Object.keys(newData));
                const updated = await this.updateSiteData(site.id, newData);
                
                if (updated) {
                    console.log(`✅ Updated ${site.name}`);
                } else {
                    console.log(`❌ Failed to update ${site.name}`);
                }
            } else {
                console.log(`⚠️ No additional data found for ${site.name}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${site.name}:`, error.message);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async generateReport() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_sites,
                    COUNT(CASE WHEN phone IS NOT NULL AND phone != '' THEN 1 END) as has_phone,
                    COUNT(CASE WHEN whatsapp IS NOT NULL AND whatsapp != '' THEN 1 END) as has_whatsapp,
                    COUNT(CASE WHEN website IS NOT NULL AND website != '' THEN 1 END) as has_website,
                    COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as has_description,
                    COUNT(CASE WHEN opening_hours IS NOT NULL AND opening_hours != '{}'::jsonb THEN 1 END) as has_opening_hours,
                    COUNT(CASE WHEN facilities IS NOT NULL AND facilities != '{}' THEN 1 END) as has_facilities,
                    COUNT(CASE WHEN ticket_price IS NOT NULL AND ticket_price != '' THEN 1 END) as has_ticket_price
                FROM tb_sites
            `;
            
            const result = await this.pool.query(query);
            const stats = result.rows[0];
            
            console.log('\n📊 SITE DATA COMPLETION REPORT');
            console.log('=================================');
            console.log(`Total Sites: ${stats.total_sites}`);
            console.log(`Phone Numbers: ${stats.has_phone}/${stats.total_sites} (${((stats.has_phone/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`WhatsApp: ${stats.has_whatsapp}/${stats.total_sites} (${((stats.has_whatsapp/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`Website: ${stats.has_website}/${stats.total_sites} (${((stats.has_website/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`Description: ${stats.has_description}/${stats.total_sites} (${((stats.has_description/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`Opening Hours: ${stats.has_opening_hours}/${stats.total_sites} (${((stats.has_opening_hours/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`Facilities: ${stats.has_facilities}/${stats.total_sites} (${((stats.has_facilities/stats.total_sites)*100).toFixed(1)}%)`);
            console.log(`Ticket Price: ${stats.has_ticket_price}/${stats.total_sites} (${((stats.has_ticket_price/stats.total_sites)*100).toFixed(1)}%)`);
            
        } catch (error) {
            console.error('❌ Error generating report:', error.message);
        }
    }

    async close() {
        await this.pool.end();
        console.log('🔌 Database connection closed');
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting Sites Data Completion Process...\n');
    
    const completer = new SitesDataCompleter();
    
    try {
        const initialized = await completer.initialize();
        if (!initialized) {
            console.log('❌ Failed to initialize. Exiting...');
            return;
        }

        // Generate initial report
        await completer.generateReport();
        
        // Process sites
        await completer.processSitesBatch(3); // Process 3 sites at a time
        
        // Generate final report
        console.log('\n📋 FINAL REPORT:');
        await completer.generateReport();
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
    } finally {
        await completer.close();
    }
}

// Export for use as module
module.exports = SitesDataCompleter;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}