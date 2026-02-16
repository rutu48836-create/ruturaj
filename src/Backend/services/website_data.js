
import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Remove scripts & styles
    $("script, style, noscript").remove();

    const text = $("body").text().replace(/\s+/g, " ").trim();

    return text.slice(0, 20000); // limit size
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}
