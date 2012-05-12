/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4 */
/*global window: false, document: false */

(function () {

    // Helper function for debug console logging.
    var log = function () {
        if (window.console && console.log && console.log.apply) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('Clusterer:');
            console.log.apply(console, args);
        }
    };

    // Application namespace.
    var app = {};

    app.init = function () {
        log('init app');
    };

    // Expose namespace to global scope.
    window.app = app;

}());
