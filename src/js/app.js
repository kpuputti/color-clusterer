/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4 */
/*global window: false, document: false, Modernizr: false */

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
        return el && computedStyle && Modernizr.classlist;
    };

    // Handle window resize.
    app._onResize = function () {
        var appWidth = window.getComputedStyle(app.el).getPropertyValue('width');
        document.querySelector('.width span').innerHTML = appWidth;
        if (typeof appWidth !== 'string') {
            log('cannot get app width');
            return;
        }
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
        options = options || {};
        if (!app._canRun(options)) {
            alert('Cannot run app in your browser.');
            return;
        }
        var now = new Date();
        app.options = options;
        app.el = options.el;
        log('init app at:', now, 'in element:', app.el);

        app._addEvents();
        app._onResize();
    };

    // Expose the app namespace to global scope.
    window.clusterer = app;
}());
