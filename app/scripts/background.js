'use strict';
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: 'whatsapp',
        innerBounds: {
            width: 900,
            height: 720
        },
        frame: 'chrome',
        resizable: false
    });
});