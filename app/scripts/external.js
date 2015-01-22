'use strict';
(function() {
    setTimeout(function appChecker() {
        var app = document.querySelector('.app');
        if (app) {
            console.log('app::loaded');
            var listener = function() {
                app.removeEventListener('animationend', listener);
                app.removeEventListener('webkitAnimationEnd', listener);
                console.log('app::ready');
            };
            app.addEventListener('animationend', listener);
            app.addEventListener('webkitAnimationEnd', listener);
        } else {
            setTimeout(appChecker, 100);
        }
    }, 100);
})();
