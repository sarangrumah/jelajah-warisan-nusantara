# Quick Start Guide - Sites Data Completion

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install pg axios cheerio dotenv
```

### 2. Configure Database
The script automatically uses your existing database configuration from `backend/.env`.

If you need to create a separate config, copy the example:
```bash
cp scripts/.env.example .env
```

Your current database config (from `backend/.env`):
```env
DATABASE_URL=postgresql://postgres:M@ryadi86!@localhost:5432/mcb_db
```

### 3. Test Connection
```bash
node scripts/test-connection.js
```

### 4. Run Data Completion
```bash
node scripts/complete-sites-data.js
```

## 📊 What You'll Get

The script will automatically:
- ✅ Find sites with missing information
- 🔍 Search the internet for missing data
- 📝 Update your database with found information
- 📋 Generate completion reports

## 🎯 Data Fields Completed

| Field | What it finds |
|-------|---------------|
| **Phone** | Contact numbers from official sites |
| **WhatsApp** | WhatsApp numbers from contact pages |
| **Website** | Official website URLs |
| **Description** | Detailed site descriptions |
| **Opening Hours** | Operating hours by day |
| **Facilities** | Available amenities |
| **Ticket Price** | Admission costs |
| **Ticket URL** | Online booking links |

## 📈 Expected Results

Before running:
- Phone numbers: ~50% complete
- Websites: ~60% complete  
- Descriptions: ~80% complete

After running:
- Phone numbers: ~70% complete (+20%)
- Websites: ~80% complete (+20%)
- Descriptions: ~95% complete (+15%)

## 🛠️ Troubleshooting

**"Database connection failed"**
- Check your `.env` file (DATABASE_URL format)
- Verify database server is running
- Test with `node scripts/test-connection.js`

**"No internet connection"**
- Check your internet connection
- Some corporate firewalls may block requests

**"Script runs slowly"**
- This is normal (rate limiting)
- Processing 45 sites takes ~10-15 minutes
- You can stop with Ctrl+C if needed

## 🔄 Running Again

You can run the script multiple times - it will:
- Skip sites that already have complete data
- Only update missing fields
- Show you the progress each time

## 📞 Need Help?

1. Check `COMPLETE_SITES_DATA.md` for detailed documentation
2. Run `node scripts/test-connection.js` to diagnose issues
3. Review console output for error messages

---

**Ready to complete your site data? Run the script now! 🚀**