// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs';
// Do not change imports
// import utilities
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';

// import automation componets files
// ex.: import { componentToImport } from './components/component_to_import.js';

(async () => {
    let browser;
    let page;

    try {
    // INITIALIZATION SECTION
    // DO NOT CHANGE INITIALIZATION SECTION
        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
        await DialogHandler.setupDialogHandler(browser); 

        page = await browser.newPage();
        page.setDefaultTimeout(10000);
    // INITIALIZATION SECTION END

    // SETTING UP THE STARTING URL
        const startingURL = 'https://example.com/'; // Replace the value of the starting URL with the one provided ny the user.
        await page.goto(startingURL);

    // AUTOMATION LOGIC
    // Build the automation here below the automation by invoking components files in this section.






    




    // AUTOMATION LOGIC END
    // Build the automation here by invoking here automation components files here in this section.

    // EXCEPTION HANDLING SECTION
    // DO NOT CHANGE THIS SECTION
       
    // console.log('NO error in the process execusion. Find the latest web site HTML code below:');
    } catch (error) { // Do not edit the exception handling and finally part
        console.error('An error occurred:', error);
        if (!page) {
            console.log("Page was closed. Critical error occurred!");
        }
    } finally { // Do not edit the exception handling and finally part      
        if (browser && page) { 
          try {
            setTimeout(async () => {
              const clearedHTML = await page.evaluate(get_cleared_HTML_code);
              console.log(clearedHTML);
              browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
            }, 2000); // 2000 milliseconds = 2 seconds
          } catch(e) {
            console.error("Error in finally:", e);
          }
        }
    }
})();
