// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs';
// Import utilities. Do not change.
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';
import { startRecording, stopRecording, getViewport } from './utils/video_recorder.js';

// import automation componets files here START

// import automation componets files here END

(async () => {
    let browser;
    let page;
    let recorderProcess;
    try {
    // INITIALIZATION SECTION
    // DO NOT MAKE ANY CHANGES TO INITIALIZATION SECTION

        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
        await DialogHandler.setupDialogHandler(browser); // Do not change or remove

        page = await browser.newPage();
        page.setDefaultTimeout(10000); // Increased timeout to 10 seconds
        
        const viewport = await getViewport(page)
        recorderProcess = await startRecording(viewport);

    // DO NOT MAKE ANY CHANGES TO INITIALIZATION SECTION
    // INITIALIZATION SECTION END

    // SETTING UP THE STARTING URL
        const startingURL = 'https://example.com/';
        await page.goto(startingURL);

    // AUTOMATION LOGIC START
    // Build the automation here by calling here automation components files here in this section.

    




    // AUTOMATION LOGIC END

    // EXCEPTION HANDLING SECTION
    // DO NOT CHANGE THIS SECTION      
    } catch (error) { // Do not edit the exception handling and finally part
        console.error('An error occurred:', error);
        if (!page) {
            console.log("Page was closed. Critical error occurred!");
        }
    } finally { // Do not edit the exception handling and finally part
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        // --- IMPLEMENTATION START ---
        if (recorderProcess) {
            await stopRecording(recorderProcess);
        }
        // --- IMPLEMENTATION END ---

        console.log('Recording of the automation execusion has been taken and saved: to "./screenshots/recording.mp4"');
        if (browser && page) { 
          try {
            await page.screenshot({ path: 'screenshots/final_screenshot.png' });
            console.log('Screenshot of the web page has been taken and saved to "./screenshots/final_screenshot.png"');
            let clearedHTML = await page.evaluate(get_cleared_HTML_code);
            
            if (DialogHandler.handledDialogs.length > 0) {
              let allDialogNotifications = '';
              DialogHandler.handledDialogs.forEach(dialog => {
                const { type, message, options, handledBy } = dialog;
                allDialogNotifications += `<JS_DIALOG. There was a JS dialoge pop-up: {type: "${type}", message: "${message}", options: "${options}", handledBy: "${handledBy}"} >\n`;
              });
              
              const insertionPoint = '</URL_ADDRESS><HTML OF THE WEBPAGE>';
              const insertionIndex = clearedHTML.indexOf(insertionPoint) + insertionPoint.length;
              clearedHTML = clearedHTML.slice(0, insertionIndex) + '\n' + allDialogNotifications + clearedHTML.slice(insertionIndex);
            }

            fs.writeFile('html_code_of_the_web_page.html', clearedHTML, { encoding: 'utf8', flag: 'w' }, (err) => {
              if (err) {
                  console.error('Error writing file:', err);
              } else {
                  console.log('HTML code of the web page saved in html_code_of_the_web_page.html file');
              }
            });

            await browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
          } catch(e) {
            console.error("Error in finally:", e);
          }
        }
    }
})();
