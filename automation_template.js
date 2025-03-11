// main.js
import puppeteer from 'puppeteer';
import fs from 'fs';
// import utilities
import extractClearedHTMLFunction from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';

// Define components import from the components folder here.
// ex.: import { componentToImport } from './components/component_to_import.js';

(async () => {
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });

        await DialogHandler.setupDialogHandler(browser); 

        page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setDefaultTimeout(10000);

        const startingURL = '[starting URL]';
        await page.goto(startingURL);

        // AUTOMATION LOGIC
        // Build the automation here by puting here the automation components files.



        // AUTOMATION LOGIC END

    } catch (error) {
        console.error('An error occurred:', error);
        if (!page) {
            console.log("Page was closed. Critical error occurred!");
        }
    } finally {
        if (browser && page) { // Check if both browser and page exist
          try {
            const clearedHTML = await page.evaluate(extractClearedHTMLFunction);
            console.log(clearedHTML);
            browser.close();
          } catch(e) {
            console.error("Error in finally:", e);
          }

        }
    }
})();
