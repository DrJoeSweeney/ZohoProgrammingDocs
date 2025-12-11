const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to example.com...');
  await page.goto('https://example.com');

  const title = await page.title();
  console.log('Page title:', title);

  const content = await page.textContent('h1');
  console.log('Main heading:', content);

  await page.screenshot({ path: 'example-screenshot.png' });
  console.log('Screenshot saved to example-screenshot.png');

  await browser.close();
  console.log('Done!');
})();
