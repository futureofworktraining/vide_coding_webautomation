// utils/dialog_handler.js

async function handleDialog(dialog) {
    try {
        console.log(`Attention! There is a JS dialoge: ${dialog.type()}`);
        console.log(`Dialog message: ${dialog.message()}`);
        
        let handledBy = 'dialog_handler.js (default) - Create a Custom component instead.';
        let options = '';
        if (dialog.type() === 'alert') options = 'OK';
        if (dialog.type() === 'confirm') options = 'OK, Cancel';
        if (dialog.type() === 'prompt') options = 'OK, Cancel, Text Input';

        // Introduce a delay before dismissing the dialog
        const delayMilliseconds = 2000; // 2 seconds (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, delayMilliseconds));
        try {
            await dialog.dismiss();
        } catch (error) {
            if (error.message && error.message.includes('Cannot dismiss dialog which is already handled')) {
                console.log('Warning: Dialog has already been handled by a custom component.');
                handledBy = 'Custom Component';
            } else {
                throw error;
            }
        }
        
        DialogHandler.handledDialogs.push({
            type: dialog.type(),
            message: dialog.message(),
            options: options,
            handledBy: handledBy
        });
               
    } catch (error) {
        console.error(error);
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
    handledDialogs: [], // Changed to an array to store multiple dialogs
};

export default DialogHandler;
