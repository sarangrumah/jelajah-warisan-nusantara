import puppeteer from 'puppeteer';

const BASE_URL = 'https://museumcagarbudaya.kemenbud.go.id';
const PAGES = [
  { name: 'museum', path: '/museum', cardSelector: '.card, [class*=Card]' },
  { name: 'heritage', path: '/heritage', cardSelector: '.card, [class*=Card]' },
  { name: 'collection', path: '/collection', cardSelector: '.card, [class*=Card]' },
  { name: 'news', path: '/media-publikasi', cardSelector: '.card, [class*=Card]' },
];

const LANGUAGES = [
  { code: 'id', label: 'Indonesian' },
  { code: 'en', label: 'English' },
];

async function switchLanguage(page, langCode) {
  await page.waitForSelector('[data-testid="language-switcher"],[class*=LanguageSwitcher]');
  await page.click('[data-testid="language-switcher"],[class*=LanguageSwitcher]');
  await page.waitForTimeout(500);
  await page.evaluate((code) => {
    const items = Array.from(document.querySelectorAll('button,div,li,a'));
    const target = items.find(el => el.textContent && (el.textContent.toLowerCase().includes('english') && code === 'en' || el.textContent.toLowerCase().includes('indonesia') && code === 'id'));
    if (target) target.click();
  }, langCode);
  await page.waitForTimeout(1500);
}

async function screenshotCards(page, pageName, langCode) {
  await page.waitForSelector('.card, [class*=Card]');
  const cards = await page.$$('.card, [class*=Card]');
  if (cards.length > 0) {
    await cards[0].screenshot({ path: `screenshots/${pageName}_${langCode}_card1.png` });
    if (cards[1]) await cards[1].screenshot({ path: `screenshots/${pageName}_${langCode}_card2.png` });
  } else {
    await page.screenshot({ path: `screenshots/${pageName}_${langCode}_full.png` });
  }
}

const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1280, height: 900 } });
const page = await browser.newPage();

for (const { name, path, cardSelector } of PAGES) {
  for (const { code: langCode } of LANGUAGES) {
    await page.goto(BASE_URL + path, { waitUntil: 'networkidle2' });
    await switchLanguage(page, langCode);
    await page.waitForSelector(cardSelector, { timeout: 5000 }).catch(() => {});
    await screenshotCards(page, name, langCode);
    console.log(`Screenshot for ${name} (${langCode}) saved.`);
  }
}

await browser.close();