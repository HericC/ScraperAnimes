const pageScraper = require("./pageScraper");
const fs = require("fs");

async function scrapeAll(browserInstance, status, years, genres, notGenres) {
  try {
    const browser = await browserInstance;
    const scrapedData = {};

    scrapedData["Animes"] = await pageScraper.scraper(
      browser,
      status,
      years,
      genres,
      notGenres
    );

    console.log("Animes:", scrapedData["Animes"].length);

    console.log("Closing the browser......");
    console.log("");

    await browser.close();

    for (const key in scrapedData) {
      fs.writeFileSync(
        `data/${key}.json`,
        JSON.stringify(scrapedData[key]),
        "utf8"
      );
    }
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance, status, years, genres, notGenres) =>
  scrapeAll(browserInstance, status, years, genres, notGenres);
