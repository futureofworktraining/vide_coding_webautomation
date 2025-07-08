// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs';
// Do not change imports
// import utilities
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';

// import automation componets files
import { startRecording, stopRecording } from './utils/video_recorder.js';

(async () => {
    let browser;
    let page;
    let recorder;

    try {
    // INITIALIZATION SECTION
    // DO NOT CHANGE INITIALIZATION SECTION
        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });

        page = await browser.newPage();
        page.setDefaultTimeout(10000);

        recorder = await startRecording(page);
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
        await stopRecording(recorder);
        console.log('Recording of the automation execusion has been taken and saved: to "./screenshots/recording.mp4"');
        if (browser && page) { 
          try {
            setTimeout(async () => {
              await page.screenshot({ path: 'screenshots/final_screenshot.png' });
              console.log('Screenshot of the web page has been taken and saved to "./screenshots/final_screenshot.png"');
              const clearedHTML = await page.evaluate(get_cleared_HTML_code);
              
              fs.writeFile('html_code_of_the_web_page.html', clearedHTML, { encoding: 'utf8', flag: 'w' }, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('HTML code of the web page saved in html_code_of_the_web_page.html file');
                }
              });

              browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
            }, 2000); // 2000 milliseconds = 2 seconds
          } catch(e) {
            console.error("Error in finally:", e);
          }
        }
    }
})();

