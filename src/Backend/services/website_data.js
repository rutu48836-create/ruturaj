import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

export async function scrapeWebsite(startUrl, maxPages = 12) {
 const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: puppeteer.executablePath(),
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
})

  const visited = new Set()
  const queue = [startUrl]
  const allText = []

  const base = new URL(startUrl).origin

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift()
    if (visited.has(url)) continue
    visited.add(url)

    try {
      const page = await browser.newPage()

      await page.goto(url, {
        waitUntil: 'domcontentloaded', // faster + more reliable than networkidle2
        timeout: 15000
      })

      const html = await page.content()
      await page.close()

      const $ = cheerio.load(html)

      // Clean unwanted elements
      $('script, style, nav, footer, header, noscript').remove()

      const text = $('body')
        .text()
        .replace(/\s+/g, ' ')
        .trim()

      allText.push({ url, text })

      // Extract links
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')
        try {
          const full = new URL(href, base).href

          if (
            full.startsWith(base) &&
            !visited.has(full) &&
            !queue.includes(full)
          ) {
            queue.push(full)
          }
        } catch {}
      })

    } catch (err) {
      console.log(`❌ Failed to scrape ${url}:`, err.message)
    }
  }

  await browser.close()
  return allText
}
