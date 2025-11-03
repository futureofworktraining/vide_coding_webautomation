// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs'; // Using regular fs as requested
// Do not change these imports
// import utilities
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';

// import automation componets files here

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
        const startingURL = 'https://example.com';
        await page.goto(startingURL);

        // AUTOMATION LOGIC
        // Build the automation here by invoking here automation components files here in this section.

        // AUTOMATION LOGIC END
        

    } catch (error) { // Do not edit the exception handling and finally part
        console.error('An error occurred:', error);
        if (!page) {
            console.log("Page was closed. Critical error occurred!");
        }
    } finally { // Do not edit the exception handling and finally part
        if (browser) {
            try {
                setTimeout(async () => {
                    const allPages = await browser.pages();
                    console.log('Saving HTML from ' + allPages.length + ' tabs/windows...');

                    // Save HTML from each tab
                    for (let i = 0; i < allPages.length; i++) {
                        try {
                            const clearedHTML = await allPages[i].evaluate(get_cleared_HTML_code);
                            const filename = 'html_code_of_the_web_page_' + (i + 1) + '.html';
                            const pageUrl = allPages[i].url();

                            fs.writeFile(filename, clearedHTML, { encoding: 'utf8', flag: 'w' }, (err) => {
                                if (err) {
                                    console.error('Error writing ' + filename + ':', err);
                                } else {
                                    console.log('HTML saved: ' + filename + ' (URL: ' + pageUrl + ')');
                                }
                            });
                        } catch (err) {
                            console.error('Error processing tab ' + (i + 1) + ':', err.message);
                        }
                    }

                    // Also save the main/active page separately for backward compatibility
                    if (page) {
                        const clearedHTML = await page.evaluate(get_cleared_HTML_code);
                        fs.writeFile('html_code_of_the_web_page.html', clearedHTML, { encoding: 'utf8', flag: 'w' }, (err) => {
                            if (err) {
                                console.error('Error writing main HTML file:', err);
                            } else {
                                console.log('Main HTML saved: html_code_of_the_web_page.html');
                            }
                        });
                    }

                    browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
                }, 2000); // 2000 milliseconds = 2 seconds
            } catch(e) {
                console.error("Error in finally:", e);
            }
        }
    }
})();
