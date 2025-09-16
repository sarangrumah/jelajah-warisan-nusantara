// translation-api.js (ESM version)
import express from 'express';
import bodyParser from 'body-parser';
import {Translate} from '@google-cloud/translate';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// --- DB SETUP (adjust connection as needed) ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- Google Translate API (using @google-cloud/translate) ---
const translate = new Translate();

async function autoTranslate(text, targetLang = 'en') {
  const [translation] = await translate.translate(text, targetLang);
  return translation;
}

// --- CRUD ENDPOINTS ---

// Get all active languages
app.get('/api/translations/languages', async (req, res) => {
  try {
    const result = await pool.query('SELECT code, name, flag FROM languages WHERE is_active = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get translations for a module/page/key/lang
app.get('/api/translations', async (req, res) => {
  const { module, page, key, lang } = req.query;
  try {
    const result = await pool.query(
      'SELECT text FROM translations WHERE module = $1 AND page = $2 AND key = $3 AND language_code = $4',
      [module, page, key, lang]
    );
    if (result.rows.length > 0) {
      res.json({ translation: result.rows[0].text });
    } else {
      res.status(404).json({ error: 'Translation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create translation (auto-translate if not original language)
app.post('/api/translations', async (req, res) => {
  const { module, page, key, language_code, text } = req.body;
  let auto_translated = false;
  let translatedText = text;

  try {
    if (language_code !== 'id') {
      translatedText = await autoTranslate(text, language_code);
      auto_translated = true;
    }

    await pool.query(
      'INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (module, page, key, language_code) DO UPDATE SET text = $5, auto_translated = $6, last_updated = NOW()',
      [module, page, key, language_code, translatedText, auto_translated]
    );
    res.json({ success: true, translatedText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update translation (auto-translate if original changes)
app.put('/api/translations/:id', async (req, res) => {
  const { text, language_code } = req.body;
  let auto_translated = false;
  let translatedText = text;

  try {
    if (language_code !== 'id') {
      translatedText = await autoTranslate(text, language_code);
      auto_translated = true;
    }

    await pool.query(
      'UPDATE translations SET text = $1, auto_translated = $2, last_updated = NOW() WHERE id = $3',
      [translatedText, auto_translated, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete translation
app.delete('/api/translations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM translations WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Translation API running on port ${PORT}`);
});