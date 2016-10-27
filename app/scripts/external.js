'use strict';
(function() {
    // function init(app) {
    //     console.log('app::loaded');
    //     var listener = function() {
    //         app.removeEventListener('animationend', listener);
    //         app.removeEventListener('webkitAnimationEnd', listener);
    //         console.log('app::ready');
    //     };
    //     app.addEventListener('animationend', listener);
    //     app.addEventListener('webkitAnimationEnd', listener);
    //     app.style.borderRadius = '0';
    // }
    //
    // var observer = new MutationObserver(function(mutationRecords) {
    //     Array.prototype.forEach.call(mutationRecords, function(record) {
    //         Array.prototype.forEach.call(record.addedNodes, function(node) {
    //             var classList = node.classList;
    //             if (classList) {
    //                 // Ready main app
    //                 if (classList.contains('app')) {
    //                     init(node);
    //                     observer.disconnect();
    //                 }
    //             }
    //         });
    //     });
    // });
    // observer.observe(document, {subtree: true, childList: true});

    // document.addEventListener('contextmenu', function(e) {
    //     e.preventDefault();
    // });

    document.querySelector('html').style.overflow = 'hidden';
})();
