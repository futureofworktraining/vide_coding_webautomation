// Do not change imports
import puppeteer from 'puppeteer';
import fs from 'fs';
// Do not change imports
// import utilities
import get_cleared_HTML_code from './utils/get_cleared_HTML_code.js';
import DialogHandler from './utils/dialog_handler.js';
import { startRecording, stopRecording } from './utils/video_recorder.js';

// import automation componets files
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
        const startingURL = 'https://example.com/';// Replace the value of the starting URL with the one provided by the user.
        await page.goto(startingURL);

    // AUTOMATION LOGIC START
    // Build the automation here by calling here automation components files here in this section.


        
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
              
              if (DialogHandler.dialogDetails) {
                const { type, message } = DialogHandler.dialogDetails;
                let options = '';
                if (type === 'alert') options = 'OK';
                if (type === 'confirm') options = 'OK, Cancel';
                if (type === 'prompt') options = 'OK, Cancel, Text Input';
                const dialogNotification = `<Attention! There is a JS dialoge pop-up: {type: "${type}", message: "${message}", options: "${options}"} >\n`;
                
                const insertionPoint = '</URL_ADDRESS><HTML OF THE WEBPAGE>';
                const insertionIndex = clearedHTML.indexOf(insertionPoint) + insertionPoint.length;
                clearedHTML = clearedHTML.slice(0, insertionIndex) + '\n' + dialogNotification + clearedHTML.slice(insertionIndex);
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
