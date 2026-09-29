const puppeteer = require("puppeteer");

async function startBrowser() {
  try {
    console.log("Opening the browser......");
    console.log("");

    const launchOptions = {
      headless: true,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    };

    return await puppeteer.launch(launchOptions);
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
}

module.exports = {
  startBrowser,
};
