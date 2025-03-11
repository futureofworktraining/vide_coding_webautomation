// main.js
import puppeteer from 'puppeteer';
import fs from 'fs';
// import utilities
import extractClearedHTMLFunction from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';

// Component import from the components folder.
// ex.: import { componentToImport } from './components/[component to import].js';

(async () => {
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });

        await DialogHandler.setupDialogHandler(browser); // Access via the object

        page = await browser.newPage();

        const targetURL = 'https://acme-test.uipath.com/login';
        await page.goto(targetURL);

        // Corrected: No need to pass function to page.evaluate, it can access it directly
        const clearedHTML = await page.evaluate(extractClearedHTMLFunction);
        console.log(clearedHTML);


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
          } catch(e) {
            console.error("Error in finally:", e);
          }

        }
         //No need to close the browser, just for test. 
         // await browser?.close(); // Optional chaining for safety
    }
})();