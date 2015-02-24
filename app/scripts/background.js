'use strict';
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: 'whatsapp',
        innerBounds: {
            width: 900,
            height: 704,
            minWidth: 900,
            minHeight: 704,
            maxWidth: 900,
            maxHeight: 704
        },
        frame: 'chrome',
        resizable: false
    });
});