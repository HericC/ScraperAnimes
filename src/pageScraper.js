const scraperObject = {
  async scraper(browser, status, years, genres, notGenres) {
    const urlStatus = `&status=${status}`;

    const urlGenres = genres.reduce(
      (url, genre) => url + `&genre%5B%5D=${genre}`,
      ""
    );

    const urlNotGenres = notGenres.reduce(
      (url, genre) => url + `&genre_ex%5B%5D=${genre}`,
      ""
    );

    const url = `https://myanimelist.net/anime.php?cat=anime&q=&type=1&score=0${urlStatus}&p=0&r=0&sm=1&sd=1&sy=${years.start}&em=12&ed=31&ey=${years.end}&c%5B%5D=d&c%5B%5D=e${urlGenres}${urlNotGenres}`;

    async function scrapeCurrentPage(show = 0) {
      console.log(`Navigating to ${url}...`);
      console.log("Show:", show + 1, "-", show + 50);
      const page = await browser.newPage();
      await page.goto(`${url}&show=${show}`);
      await page.waitForSelector("#content");

      const titles = await page.$$eval(".js-categories-seasonal tr", (cards) =>
        cards.map((el) => {
          return {
            title: el.querySelector(".title a strong")?.textContent,
            start: el.querySelector("td:nth-child(3)")?.textContent.trim(),
            end: el.querySelector("td:nth-child(4)")?.textContent.trim(),
          };
        })
      );

      titles.shift();
      await page.close();

      if (titles.length === 50)
        return titles.concat(await scrapeCurrentPage(show + 50));
      return titles;
    }

    console.log(`Extracting between the years ${years.start} to ${years.end}`);
    const data = await scrapeCurrentPage();

    console.log("Finished!");
    console.log("");
    return data;
  },
};

module.exports = scraperObject;
