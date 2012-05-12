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
        var computedStyle = 'getComputedStyle' in window;
        var classlist = 'classList' in document.documentElement;
        return el && computedStyle && classlist;
    };

    // Handle window resize.
    app._onResize = function () {
        var appWidth = window.getComputedStyle(app.options.el).width;
        var width = window.parseInt(appWidth.replace('px', ''), 10);
        if (!isNaN(width) && width !== app.width) {
            log('app width changed to:', width);
            app.width = width;
        }
    };

    // Add event listeners.
    app._addEvents = function () {
        window.addEventListener('resize', app._onResize);
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

        app._addEvents();
        app._onResize();
    };

    // Expose the app namespace to global scope.
    window.clusterer = app;
}());
