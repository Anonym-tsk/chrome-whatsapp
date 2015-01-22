'use strict';
document.addEventListener('DOMContentLoaded', function() {
    var webview = document.querySelector('webview');

    webview.addEventListener('consolemessage', function(e) {
        switch (e.message) {
            case 'app::loaded':
                webview.style.width = '0';
                break;
            case 'app::ready':
                webview.style.width = '100%';
                break;
        }
    });

    webview.addEventListener('contentload', function() {
        webview.executeScript({file: 'scripts/external.js'});
    });
});