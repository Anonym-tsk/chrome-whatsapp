'use strict';
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: 'whatsapp',
        innerBounds: {
            width: 884,
            height: 700
        },
        frame: 'chrome',
        resizable: false
    });
});