// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs';
// Do not change imports
// import utilities
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';
import { startRecording, stopRecording } from './utils/video_recorder.js';

// import automation componets files
import handleAlert from './components/handleAlert.js';
import fillForm from './components/fillForm.js';
// ex.: import { componentToImport } from './components/component_to_import.js';


(async () => {
    let browser;
    let page;
    let recorder;

    try {
    // INITIALIZATION SECTION
    // DO NOT CHANGE INITIALIZATION SECTION

        browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
        await DialogHandler.setupDialogHandler(browser); 

        page = await browser.newPage();
        page.setDefaultTimeout(10000);

        recorder = await startRecording(page);

    // INITIALIZATION SECTION END

    // SETTING UP THE STARTING URL
        const startingURL = 'http://127.0.0.1:5501/testingPopUpSite.html';// Replace the value of the starting URL with the one provided by the user.
        await page.goto(startingURL);

    // AUTOMATION LOGIC START
    // Build the automation here by calling here automation components files here in this section.

    // [1]. Step: Handle any alert pop-ups
    await handleAlert(page);

    // [2]. Step: Fill the web form
    await fillForm(page, 'John Doe', 'john.doe@example.com', 'This is a test message.');
        
    // AUTOMATION LOGIC END

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

              browser.close(); // DO NOT CHANGE, REMOVE OR COMMENT-OUT
            }, 2000); // 2000 milliseconds = 2 seconds
          } catch(e) {
            console.error("Error in finally:", e);
          }
        }
    }
})();
