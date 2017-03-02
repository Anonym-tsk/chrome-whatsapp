'use strict';
document.addEventListener('DOMContentLoaded', function() {
    var webview = document.querySelector('webview'),
        loader = document.querySelector('.loader'),
        isFocused = true;

    webview.addEventListener('contentload', function() {
        webview.executeScript({file: 'scripts/external.js'});
        webview.insertCSS({file: 'styles/external.css'});

        webview.style.width = '100%';
        loader.style.display = 'none';
    });

    webview.addEventListener('permissionrequest', function(e) {
        switch (e.permission) {
            case 'media':
            case 'filesystem':
            case 'geolocation':
            case 'fullscreen':
                e.request.allow();
                break;
        }
    });

    webview.addEventListener('newwindow', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(e.targetUrl);
    });

    chrome.app.window.current().contentWindow.addEventListener('focus', function() {
        chrome.app.window.current().clearAttention();
        isFocused = true;
    });

    chrome.app.window.current().contentWindow.addEventListener('blur', function() {
        isFocused = false;
    });

    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(message) {
            if (message.type === 'proxy' && message.action) {
                switch (message.action) {
                    case 'attention':
                        if (!isFocused) {
                            chrome.app.window.current().drawAttention();
                        }
                        break;

                    case 'notification':
                        var data = message.data,
                            icon = data.options.icon.startsWith('//') ? 'https:' + data.options.icon : data.options.icon,
                            xhr = new XMLHttpRequest();
                        xhr.open('GET', icon, true);
                        xhr.responseType = 'blob';
                        xhr.onload = function() {
                            var url = window.URL.createObjectURL(this.response);
                            chrome.notifications.create(data.options.tag, {
                                type: 'basic',
                                title: data.title,
                                iconUrl: url,
                                message: data.options.body
                            });
                        };
                        xhr.send();
                        break;
                }
            }
        });
    });
});