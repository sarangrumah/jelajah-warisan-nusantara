# Sites Data Completion Script

An automated script to find and complete missing information in your `tb_sites` table using web scraping and data extraction techniques.

## Features

- 🔍 **Automated Data Discovery**: Searches for missing site information across multiple sources
- 📱 **Contact Information**: Finds phone numbers, WhatsApp, and websites
- 🏛️ **Site Details**: Retrieves descriptions, opening hours, facilities, and ticket prices
- 🌍 **Multi-Source Search**: Uses Wikipedia, search engines, and official tourism sources
- 📊 **Progress Reporting**: Generates detailed completion reports
- ⚡ **Batch Processing**: Processes sites in batches to avoid overwhelming external services
- 🛡️ **Rate Limiting**: Includes delays between requests to respect external services

## Installation

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Run installation script
chmod +x scripts/install-dependencies.sh
./scripts/install-dependencies.sh
```

### 2. Configure Database Connection

Update your `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=false

# Optional: Custom User-Agent for web scraping
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

## Usage

### Basic Usage

```bash
# Run the complete script
node scripts/complete-sites-data.js
```

### Advanced Usage

```javascript
// Import and use programmatically
const SitesDataCompleter = require('./scripts/complete-sites-data');

const completer = new SitesDataCompleter();

// Initialize and process sites
await completer.initialize();
await completer.processSitesBatch(3); // Process 3 sites at a time
await completer.generateReport();
await completer.close();
```

## Data Fields Processed

The script can complete the following fields in your `tb_sites` table:

| Field | Type | Description | Sources |
|-------|------|-------------|---------|
| `phone` | TEXT | Phone numbers | Search results, official sites |
| `whatsapp` | TEXT | WhatsApp numbers | Search results, contact pages |
| `website` | TEXT | Official website URLs | Wikipedia, search results |
| `description` | TEXT | Site descriptions | Wikipedia, tourism sites |
| `opening_hours` | JSONB | Operating hours by day | Official sites, Wikipedia |
| `facilities` | TEXT[] | Available facilities | Official sites, reviews |
| `ticket_price` | TEXT | Admission prices | Official sites, tourism portals |
| `ticket_url` | TEXT | Ticket booking URL | Official sites |

## Data Sources

The script uses multiple sources to gather information:

1. **Wikipedia**: Rich information including descriptions, contact details, and operating hours
2. **DuckDuckGo Instant Answer API**: Quick search results and summaries
3. **Official Tourism Sites**: Indonesian tourism and heritage sites
4. **Government Sources**: Ministry of Education and Culture databases
5. **Search Results**: General web search for missing details

## Processing Workflow

```
1. Connect to Database
   ↓
2. Find Sites with Missing Data
   ↓
3. Search Multiple Sources
   ↓
4. Extract Relevant Information
   ↓
5. Validate and Clean Data
   ↓
6. Update Database Records
   ↓
7. Generate Progress Report
```

## Rate Limiting & Ethics

- **Batch Processing**: Processes 3 sites at a time by default
- **Request Delays**: 2-second delays between batches
- **Respectful Scraping**: Uses appropriate User-Agent headers
- **Error Handling**: Continues processing even if individual requests fail
- **Data Validation**: Cleans and validates extracted data before saving

## Sample Output

```
🚀 Starting Sites Data Completion Process...

✅ Database connection established
📊 Found 150 sites in database

🔍 Found 45 sites with missing data

📊 SITE DATA COMPLETION REPORT
=================================
Total Sites: 150
Phone Numbers: 78/150 (52.0%)
WhatsApp: 45/150 (30.0%)
Website: 92/150 (61.3%)
Description: 120/150 (80.0%)
Opening Hours: 34/150 (22.7%)
Facilities: 67/150 (44.7%)
Ticket Price: 89/150 (59.3%)

🚀 Starting to process 45 sites...

📦 Processing batch 1/15
🔍 Processing: Candi Borobudur
📝 Found data for Candi Borobudur: ["description", "phone", "website"]
✅ Updated Candi Borobudur

🔍 Processing: Candi Prambanan
📝 Found data for Candi Prambanan: ["opening_hours", "ticket_price"]
✅ Updated Candi Prambanan

⏳ Waiting 2 seconds before next batch...

✅ Processing completed!

📋 FINAL REPORT:
Total Sites: 150
Phone Numbers: 98/150 (65.3%)
WhatsApp: 58/150 (38.7%)
Website: 105/150 (70.0%)
Description: 135/150 (90.0%)
Opening Hours: 67/150 (44.7%)
Facilities: 89/150 (59.3%)
Ticket Price: 108/150 (72.0%)
```

## Configuration Options

You can customize the script behavior by modifying these parameters:

```javascript
// In the SitesDataCompleter constructor
batchSize: 5,           // Sites to process simultaneously
requestTimeout: 10000,   // Request timeout in milliseconds
delayBetweenBatches: 2000, // Delay in milliseconds

// Search query patterns
searchQueries: [
    `${site.name} ${site.type} Indonesia`,
    `${site.name} heritage site Indonesia`,
    `${site.address} museum Indonesia`,
    `${site.name} visit information Indonesia`
]
```

## Error Handling

The script includes comprehensive error handling:

- **Database Connection Failures**: Attempts reconnection with fallback
- **Network Timeouts**: Continues with next source if one fails
- **Invalid Data**: Validates and cleans extracted information
- **Partial Updates**: Updates available fields even if some fail

## Monitoring and Logging

The script provides detailed logging:

- ✅ Successful operations
- ⚠️ Warnings for missing data
- ❌ Error messages with details
- 📊 Progress updates and statistics

## Security Considerations

- **Database Security**: Uses parameterized queries to prevent SQL injection
- **Data Validation**: Sanitizes extracted text before database updates
- **Rate Limiting**: Respects external service limits
- **No Sensitive Data**: Doesn't log passwords or sensitive information

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your `.env` file configuration
   - Verify database server is running
   - Ensure database credentials are correct

2. **No Data Found for Sites**
   - Some sites may have very specific names
   - Check internet connection
   - Verify site names are correct in database

3. **Script Runs Slowly**
   - This is normal for rate limiting
   - Consider reducing batch size for faster processing
   - Process smaller batches during off-peak hours

### Performance Optimization

- **Run during off-peak hours** for faster external service responses
- **Use smaller batch sizes** for better rate limiting
- **Process sites by priority** (most important first)
- **Run multiple instances** for different site categories

## Customization

You can extend the script by:

1. **Adding New Data Sources**: Modify the `sources` object
2. **Custom Data Extractors**: Add new extraction patterns
3. **Different Processing Logic**: Override the `processSingleSite` method
4. **Additional Validation**: Enhance the data cleaning functions

## Support

For issues or questions:

1. Check the console output for detailed error messages
2. Verify your database connection and configuration
3. Test with a small batch first (modify the LIMIT in the query)
4. Review the generated reports for completion statistics

## License

This script is designed for use with the Jelajah Warisan Nusantara project. Ensure compliance with terms of service of external data sources when using this script.