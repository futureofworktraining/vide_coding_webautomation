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
        // INITIALIZATION SECTION
        // DO NOT change INITIALIZATION SECTION
        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
        await DialogHandler.setupDialogHandler(browser); 

        page = await browser.newPage();
        page.setDefaultTimeout(10000);
        // INITIALIZATION SECTION END

        const startingURL = 'https://example.com/'; // Replace the value of the starting URL with the one provided ny the user.
        await page.goto(startingURL);

        // AUTOMATION LOGIC
        // Build the automation here by puting here automation components invokes.



        // AUTOMATION LOGIC END


    // DO NOT CHANGE THE EXCEPTION HANDLING SECTION
    } catch (error) { // Do not edit the exception handling and finally part
        console.error('An error occurred:', error);
        if (!page) {
            console.log("Page was closed. Critical error occurred!");
        }
    } finally { // Do not edit the exception handling and finally part
        if (browser && page) { 
          try {
            setTimeout(async () => {
              const clearedHTML = await page.evaluate(extractClearedHTMLFunction);
              console.log(clearedHTML);
              browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
            }, 2000); // 2000 milliseconds = 2 seconds
          } catch(e) {
            console.error("Error in finally:", e);
          }

        }
    }
})();
