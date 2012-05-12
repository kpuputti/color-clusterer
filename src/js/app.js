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

    // Detect the needed feature support for the app.
    app._canRun = function (options) {
        var el = !!options.el;
        var classlist = 'classList' in document.documentElement;
        return el && classlist;
    };

    // Initialize the app with the given options.
    app.init = function (options) {
        if (!app._canRun(options)) {
            alert('Cannot run app in your browser.');
            return;
        }
        app.options = options || {};
        var now = new Date();
        var el = app.options.el;
        log('init app at:', now, 'in element:', el);
    };

    // Expose the app namespace to global scope.
    window.clusterer = app;
}());
