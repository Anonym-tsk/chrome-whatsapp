'use strict';
(function() {
    // Запрещаем правый клик
    // document.addEventListener('contextmenu', function(e) {
    //     e.preventDefault();
    // });

    // Открываем порт в приложение
    var port = chrome.runtime.connect({name: 'proxy'});

    // Слушаем сообщения со страницы и отправляем их приложению
    window.addEventListener('message', function(event) {
        if (event.source !== window) {
            return;
        }
        if (event.data.hasOwnProperty('type') && event.data.type.toString() === 'proxy') {
            port.postMessage(event.data);
        }
    }, false);

    // Добавляем код на страницу с доступом к локальным переменным
    var code = '(' + function(id) {
        window.okmessages = {
            extensionId: id,
            sendMessage: function(action, data) {
                window.postMessage({type: 'proxy', action: action, data: data}, '*');
            }
        };
        window.Notification = function(title, options, callback) {
            window.okmessages.sendMessage('notification', {title: title, options: options, callback: callback});
        };
        window.Notification.permission = 'granted';
        window.Notification.requestPermission = function(callback) {
            callback('granted');
        };
    } + ')(\'' + chrome.runtime.id + '\');';
    var script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

    // Слушаем изменения на странице и отправляем нотификации приложению
    var observer = new MutationObserver(function(mutationRecords) {
        Array.prototype.forEach.call(mutationRecords, function(record) {
            Array.prototype.forEach.call(record.addedNodes, function(node) {
                var classList = node.classList;
                if (classList) {
                    if (classList.contains('__unread')) {
                        port.postMessage({type: 'proxy', action: 'attention'});
                    }
                }
            });
        });
    });
    observer.observe(document, {subtree: true, childList: true});

    // Запрещаем закрытие по ESC
    document.body.addEventListener('keydown', function(e) {
        if (e.which === 27) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    });
})();
