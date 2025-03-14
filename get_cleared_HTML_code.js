export default function get_cleared_HTML_code() {
    // Helper function to determine if an element is hidden
    function isHidden(element) {
        let currentElement = element;
        while (currentElement) {
            const style = getComputedStyle(currentElement);
            if (style.display === 'none' || style.visibility === 'hidden') {
                return true;
            }
            currentElement = currentElement.parentElement;
        }
        return false;
    }

    // Helper function to process original and cloned elements in parallel
    function processElement(original, cloned) {
        if (isHidden(original)) {
            cloned.classList.add('hidden');
        }
        const originalChildren = Array.from(original.children);
        const clonedChildren = Array.from(cloned.children);
        originalChildren.forEach((origChild, index) => {
            const clonedChild = clonedChildren[index];
            processElement(origChild, clonedChild);
        });
    }

    function extractClearedHTML() {
        const pageTitle = document.title;
        const currentURL = window.location.href;
        let bodyElement = document.body.cloneNode(true);

        // Mark hidden elements in the cloned body based on original DOM styles
        processElement(document.body, bodyElement);

        // Remove HTML comments from the cloned body
        let commentIterator = document.createNodeIterator(bodyElement, NodeFilter.SHOW_COMMENT);
        let commentNode;
        while (commentNode = commentIterator.nextNode()) {
            commentNode.parentNode.removeChild(commentNode);
        }

        // Define tags and attributes to remove
        const tagsToRemove = ['script', 'svg', 'path', 'template'];
        const attributesToRemove = ['style', 'd', 'viewBox'];
        const actionAttributesToRemove = [
            'data-hydro-click', 'data-hydro-click-hmac', 'data-ga-click', 
            'onclick', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave', 
            'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup', 'onkeypress'
        ];

        // First cleaning: remove specified tags and attributes
        let allElements = bodyElement.querySelectorAll('*');
        allElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            if (tagsToRemove.includes(tagName)) {
                element.remove();
            } else {
                attributesToRemove.forEach(attr => {
                    element.removeAttribute(attr);
                });
                actionAttributesToRemove.forEach(attr => {
                    element.removeAttribute(attr);
                });
            }
        });

        // Get the cleaned HTML after first pass
        let cleanedBodyHTML = bodyElement.innerHTML;

        // Second cleaning on a virtual DOM
        const virtualBodyElement = document.createElement('body');
        virtualBodyElement.innerHTML = cleanedBodyHTML;

        // Remove any remaining comments (unlikely, but for consistency)
        commentIterator = document.createNodeIterator(virtualBodyElement, NodeFilter.SHOW_COMMENT);
        while (commentNode = commentIterator.nextNode()) {
            commentNode.parentNode.removeChild(commentNode);
        }

        // Re-apply tag and attribute removal
        allElements = virtualBodyElement.querySelectorAll('*');
        allElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            if (tagsToRemove.includes(tagName)) {
                element.remove();
            } else {
                attributesToRemove.forEach(attr => {
                    element.removeAttribute(attr);
                });
                actionAttributesToRemove.forEach(attr => {
                    element.removeAttribute(attr);
                });
            }
        });

        // Get the final cleaned HTML
        const finalCleanedBodyHTML = virtualBodyElement.innerHTML;

        // Wrap the HTML with title and URL
        const wrappedHTML = `<WESITE TITLE>${pageTitle}</WESITE TITLE><URL_ADDRESS>${currentURL}</URL_ADDRESS><HTML OF THE WEBPAGE>${finalCleanedBodyHTML}</HTML OF THE WEBPAGE>`;
        console.log(wrappedHTML);
        return wrappedHTML;
    }

    const clearedHTML = extractClearedHTML();
    return clearedHTML;
}
