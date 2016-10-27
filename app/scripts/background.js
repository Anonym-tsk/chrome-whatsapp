'use strict';
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: 'okmessages',
        innerBounds: {
            width: 900,
            height: 700,
            minWidth: 885,
            minHeight: 450
        },
        frame: 'chrome',
        resizable: true
    });
});