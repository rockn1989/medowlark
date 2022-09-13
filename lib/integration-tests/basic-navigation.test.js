"use strict";

const portfinder = require("portfinder");
const puppeteer = require("puppeteer");

const {startServer: app} = require("../../meadowlark");

let server = null;
let port = null;

beforeEach(async () => {
  port = await portfinder.getPortPromise();
  server = await app.listen(port);
});

afterEach(() => {
  server.close();
});

test("Homepage has link to about page", async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);

  await Promise.all([
    page.waitForNavigation(),
    page.click('[data-test-id="about"]'),
  ]);

  expect(page.url()).toBe(`http://localhost:${port}/about`);
  await browser.close();
});
