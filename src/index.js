const browserObject = require("./browser");
const scraperController = require("./pageController");
const fs = require("fs");

const status = {
  finished: 2,
  currently: 1,
};

const genres = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Fantasy: 10,
  Gourmet: 47,
  Horror: 14,
  Mystery: 7,
  Romance: 22,
  SciFi: 24,
  SliceOfLife: 36,
  Sports: 30,
  Supernatural: 36,
  Suspense: 41,
  Ecchi: 9,
};

const format = (anime) => ` ${anime.start} | ${anime.end} - ${anime.title} `;
const sort = (anime) =>
  anime.sort((a, b) => {
    if (a.start > b.start) return 1;
    if (a.start < b.start) return -1;
    return 0;
  });

const scraper = async (status, years, genres, notGenres) => {
  const browserInstance = browserObject.startBrowser();
  await scraperController(browserInstance, status, years, genres, notGenres);
};

const compare = () => {
  try {
    let list = fs.readFileSync("./json/List").toString();
    let animes = JSON.parse(fs.readFileSync("./data/Animes.json"));

    const match = [];
    const not = [];

    for (const anime of animes) {
      if (list.includes(anime.title)) match.push(anime);
      else not.push(anime);
    }

    fs.writeFileSync("data/match.txt", JSON.stringify(match), "utf8");
    fs.writeFileSync("data/not.txt", JSON.stringify(not)), "utf8";

    console.log(
      "match:",
      match.length,
      sort(match).map((anime) => format(anime))
    );

    console.log(
      "not:",
      not.length,
      sort(not).map((anime) => format(anime))
    );
  } catch (error) {
    console.log(error);
  }
};

const start = async () => {
  await scraper(
    status.finished,
    { start: 2024, end: 2024 },
    [genres.Fantasy],
    [genres.Horror, genres.Mystery, genres.Suspense]
  );
  compare();
};

start();
