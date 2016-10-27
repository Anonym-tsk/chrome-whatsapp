'use strict';
document.addEventListener('DOMContentLoaded', function() {
    var webview = document.querySelector('webview');

    // webview.addEventListener('consolemessage', function(e) {
    //     switch (e.message) {
    //         case 'app::loaded':
    //             webview.style.width = '0';
    //             break;
    //         case 'app::ready':
    //             webview.style.width = '100%';
    //             break;
    //     }
    // });

    webview.addEventListener('contentload', function() {
        webview.executeScript({file: 'scripts/external.js'});
        webview.insertCSS({file: 'styles/external.css'});
    });

    webview.addEventListener('permissionrequest', function(e) {
        switch (e.permission) {
            case 'media':
            case 'filesystem':
            case 'geolocation':
                e.request.allow();
                break;
        }
    });

    webview.addEventListener('newwindow', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(e.targetUrl);
    });
});