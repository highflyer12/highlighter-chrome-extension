document.getElementsByTagName("body")[0].onmouseup = activateExtension();

var highlights = {};
var url = window.location.href.toString();
var text, range, hTag, savedText, querySelector, hex;

function grabSelectedText() {
    text = window.getSelection();
    range = window.getSelection().getRangeAt(0);
    hTag = text.anchorNode.parentElement;
    savedText = text;
    text.removeAllRanges();
    text.addRange(range);
};

function assignQuerySelector() {
    if (!hTag.className) {
        querySelector = hTag.tagName.toLowerCase();
    } else {
        querySelector = hTag.tagName.toLowerCase() + "." + hTag.className;
    }
};

function saveHighlight() {
    chrome.storage.local.get('highlights', (results) => { 
        highlights = results.highlights
        // if no stored highlights for URL, initialize empty obj for text: qS value pairs
        if (!results.highlights[url]) {
            highlights[url] = {};            
        } else {
            highlights[url] = results.highlights;
        }
        assignQuerySelector();
        highlights[url][savedText.anchorNode.parentElement.innerHTML] = [querySelector, hTag.innerText.indexOf(savedText.toString().trim()), hTag.innerHTML.indexOf(savedText.toString().trim())];
        chrome.storage.local.set({highlights}, () => {
        });
    });
};

function removeHighlight() {
    hTag.style.backgroundColor = 'transparent';
        chrome.storage.local.get('highlights', (results) => {            
        highlights = results.highlights;        
        delete highlights[url][savedText.anchorNode.textContent]
        chrome.storage.local.set({highlights}, () => { 
        });
    });
};

function executeHighlight() {
    document.execCommand("HiliteColor", false, '#C7FFD8');
}

function activateExtension() {
    document.designMode = "on";
    grabSelectedText();

    if (hTag.style.backgroundColor == 'rgb(199, 255, 216)') {
        removeHighlight();
    } else {
        executeHighlight();
        saveHighlight();
    }

    document.designMode = "off";
};