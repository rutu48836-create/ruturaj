import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url, maxPages = 12) {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;
  const visited = new Set();
  const results = [];

  async function scrapePage(pageUrl) {
    if (visited.has(pageUrl) || visited.size >= maxPages) return;
    visited.add(pageUrl);

    try {
      const { data } = await axios.get(pageUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      });

      const $ = cheerio.load(data);

      // Collect internal links for crawling
      const baseHostname = new URL(fullUrl).hostname;
      const internalLinks = [];

      $('a[href]').each((_, el) => {
        try {
          const href = $(el).attr('href');
          const absolute = new URL(href, pageUrl).toString();
          if (
            new URL(absolute).hostname === baseHostname &&
            !visited.has(absolute) &&
            !absolute.includes('#') &&
            !absolute.match(/\.(pdf|jpg|jpeg|png|gif|svg|css|js|zip)$/i)
          ) {
            internalLinks.push(absolute);
          }
        } catch (_) {}
      });

      // Extract text
      $('script, style, nav, footer, iframe, noscript, head').remove();
      const text = $('body').text()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000);

      if (text.length > 100) {
        results.push({ url: pageUrl, text });
      }

      // Crawl internal links up to maxPages
      for (const link of internalLinks.slice(0, 3)) {
        if (visited.size >= maxPages) break;
        await scrapePage(link);
      }

    } catch (error) {
      console.error(`Scrape error on ${pageUrl}:`, error.message);
    }
  }

  await scrapePage(fullUrl);

  // Always return an array, even if empty
  return results;
}
