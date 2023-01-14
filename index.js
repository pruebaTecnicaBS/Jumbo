const puppeteer = require("puppeteer");
const cors = require("cors");
var express = require("express");
var $ = require("jquery");
var app = express();
app.use(cors());
app.options("*", cors());
var url =
  "https://www.tiendasjumbo.co/supermercado/despensa/enlatados-y-conservas";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  );
  await page.goto(url);

  await page.waitForSelector(".vtex-search-result-3-x-filterPopupButton");
  //await page.waitFor(3000);
  let objMain = { url: url };
  objMain.products = await page.evaluate(() => {
    links = [];

    var li = $("#gallery-layout-container").find(
      ".vtex-product-summary-2-x-productNameContainer span"
    );
    li.each(function () {
      price = $(this)
        //.closest(".vtex-flex-layout-0-x-flexColChild")
        .parent()
        .parent()
        .parent()
        .next()
        .next()
        .next()
        .find(".tiendasjumboqaio-jumbo-minicart-2-x-price")
        // .css({ color: "red", border: "2px solid red" });
        .text();
      links.push(
        JSON.stringify({
          name: $(this).text().replace(/\n/g, ""),
          price: price,
        })
      );
    });

    return links;
  });

  console.log(objMain);
  //await browser.close();
})();
