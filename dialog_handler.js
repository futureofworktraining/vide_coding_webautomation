// utils/dialog_handler.js

async function handleDialog(dialog) {
    try {
        console.log(`Attention! There is a JS dialoge: ${dialog.type()}`);
        console.log(`Dialog message: ${dialog.message()}`);

        // Introduce a delay before dismissing the dialog
        const delayMilliseconds = 2000; // 2 seconds (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, delayMilliseconds));

        await dialog.dismiss();
    } catch (error) {
        console.error("Error handling dialog:", error);
    }
}

async function setupDialogHandler(browser) {
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            newPage.on('dialog', handleDialog);
        }
    });
}

// Export as a single object:
const DialogHandler = {
    handleDialog,
    setupDialogHandler,
};

export default DialogHandler;