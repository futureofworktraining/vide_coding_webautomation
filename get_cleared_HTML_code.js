
export default function extractClearedHTMLFunction()
{   
    function isUIElement(element) {
        if (!element) return false;
        // Check for common non-UI tags (you can extend this list)
        const nonUITags = ['template', 'script', 'style', 'meta', 'link', 'head', 'noscript'];
        if (nonUITags.includes(element.tagName.toLowerCase())) {
        return false;
        }
        // Check if the element is hidden or not rendered (basic visibility check)
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
        }
        // Check if the element or any of its parents has \`display: none\` or \`visibility: hidden\`
        let currentElement = element;
        while (currentElement) {
            const currentStyle = getComputedStyle(currentElement);
            if (currentStyle.display === 'none' || currentStyle.visibility === 'hidden') {
                return false;
            }
            currentElement = currentElement.parentElement;
        }
        return true; // If it passes the checks, consider it a UI element
    }
    
    function extractClearedHTML() {
    
        const pageTitle = document.title;
        const currentURL = window.location.href;
        let bodyElement = document.body.cloneNode(true);
    
        // --- First Cleaning and Filtering for UI Elements ---
    
        // 1. Remove HTML comments
        let commentIterator = document.createNodeIterator(
        bodyElement,
        NodeFilter.SHOW_COMMENT,
        null,
        false
        );
        let commentNode;
        while (commentNode = commentIterator.nextNode()) {
        commentNode.parentNode.removeChild(commentNode);
        }
        // 2. Define tags and attributes to remove (make it configurable here if needed)
        const tagsToRemove = ['script', 'svg', 'path', 'template'];
        const attributesToRemove = ['style', 'd', 'viewBox'];
        // 2.1 Define attributes related to actions/scripts to remove
        const actionAttributesToRemove = ['data-hydro-click', 'data-hydro-click-hmac', 'data-ga-click', 'onclick', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave', 'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup', 'onkeypress']; // Add more as needed
        // 3. Select all elements within the cloned body
        let allElements = bodyElement.querySelectorAll('*');
        // 4. Iterate and process elements, filtering for UI elements
        allElements.forEach(element => {
        // Check if the element is considered a UI element (visible and not a template etc.)
        if (!isUIElement(element)) {
            element.remove(); // Remove non-UI elements directly
            return; // Skip to the next element
        }
        // Remove specified tags
        if (tagsToRemove.includes(element.tagName.toLowerCase())) {
            element.remove();
            return; // Skip to the next element after removing the current one
        }
        // Remove specified attributes
        attributesToRemove.forEach(attr => {
            if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
            }
        });
        // Remove action-related attributes
        actionAttributesToRemove.forEach(actionAttr => {
            if (element.hasAttribute(actionAttr)) {
            element.removeAttribute(actionAttr);
            }
        });
        });
        // 5. Get the first cleaned HTML (acting as virtual DOM) - now only UI elements
        let cleanedBodyHTML = bodyElement.innerHTML;
        // --- Second Cleaning (on the virtual DOM / cleaned HTML) ---
        // Create a dummy DOM element to represent the virtual DOM
        const virtualBodyElement = document.createElement('body');
        virtualBodyElement.innerHTML = cleanedBodyHTML;
        // Re-apply comment removal - although comments should be gone from innerHTML already, just for completeness
        commentIterator = document.createNodeIterator(
        virtualBodyElement,
        NodeFilter.SHOW_COMMENT,
        null,
        false
        );
        while (commentNode = commentIterator.nextNode()) {
        commentNode.parentNode.removeChild(commentNode);
        }
        // Re-apply tag and attribute removal on the virtual DOM
        allElements = virtualBodyElement.querySelectorAll('*'); // Re-query elements in the virtual DOM
        allElements.forEach(element => {
        // Double check if the element is still considered a UI element after the first round
        if (!isUIElement(element)) {
            element.remove(); // Remove non-UI elements in the virtual DOM as well
            return;
        }
        // Remove specified tags
        if (tagsToRemove.includes(element.tagName.toLowerCase())) {
            element.remove();
            return; // Skip to the next element after removing the current one
        }
        // Remove specified attributes
        attributesToRemove.forEach(attr => {
            if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
            }
        });
        // Remove action-related attributes from virtual DOM
        actionAttributesToRemove.forEach(actionAttr => {
            if (element.hasAttribute(actionAttr)) {
            element.removeAttribute(actionAttr);
            }
        });
        });
        // 6. Get the final cleaned HTML after second clearing - still only UI elements
        const finalCleanedBodyHTML = virtualBodyElement.innerHTML;
        const wrappedHTML = `<WESITE TITLE>${pageTitle}</WESITE TITLE><URL_ADDRESS>${currentURL}</URL_ADDRESS><HTML OF THE WEBPAGE>${finalCleanedBodyHTML}</HTML OF THE WEBPAGE>`;
        console.log(wrappedHTML)
        return wrappedHTML;
    }  

    const clearedHTML = extractClearedHTML();

    return clearedHTML;
}
