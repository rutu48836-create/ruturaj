// services/website_data.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url) {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    
    const { data } = await axios.get(fullUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'
      }
    });

    const $ = cheerio.load(data);

    $('script, style, nav, footer, iframe, noscript, head').remove();

    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);

    return text;
  } catch (error) {
    console.error('Scrape error:', error.message);
    return '';
  }
}
