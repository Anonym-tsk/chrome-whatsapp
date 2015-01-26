'use strict';
(function() {
    function init(app) {
        console.log('app::loaded');
        var listener = function() {
            app.removeEventListener('animationend', listener);
            app.removeEventListener('webkitAnimationEnd', listener);
            console.log('app::ready');
        };
        app.addEventListener('animationend', listener);
        app.addEventListener('webkitAnimationEnd', listener);
        app.style.borderRadius = '0';
    }

    function removeMic() {
        var footer = document.querySelector('.block-compose'),
            divs = footer && footer.querySelectorAll('div');
        if (divs) {
            footer.style.paddingRight = '10px';
            divs[divs.length - 1].style.display = 'none';
        }
    }

    var observer = new MutationObserver(function(mutationRecords) {
        Array.prototype.forEach.call(mutationRecords, function(record) {
            Array.prototype.forEach.call(record.addedNodes, function(node) {
                var classList = node.classList;
                if (classList) {
                    // Ready main app
                    if (classList.contains('app')) {
                        init(node);
                    }
                    // Ready chat
                    if (classList.contains('pane-chat')) {
                        removeMic();
                    }
                }
            });
            Array.prototype.forEach.call(record.removedNodes, function(node) {
                var classList = node.classList;
                if (classList) {
                    if (classList.contains('icon-send')) {
                        // Removed text in textarea
                        removeMic();
                    }
                }
            });
        });
    });
    observer.observe(document, {subtree: true, childList: true});
})();
