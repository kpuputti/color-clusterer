/*jslint white: true, devel: true, onevar: false, undef: true, nomen: false,
  regexp: true, plusplus: false, bitwise: true, newcap: true, maxerr: 50,
  indent: 4 */
/*global window: false, document: false, Modernizr: false, Image: false, _: false */

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
    var app = {
        settings: {
            maxColors: 10,
            maxImageDimension: 500
        }
    };

    // Detect the needed feature support for the app.
    app._canRun = function (options) {
        var el = !!options.el;
        var computedStyle = 'getComputedStyle' in window;
        return el &&
            computedStyle &&
            Modernizr.classlist &&
            Modernizr.canvas;
    };

    // Get the current style property value.
    app._getComputedStyleProperty = function (el, prop) {
        return window.getComputedStyle(el).getPropertyValue(prop);
    };

    app._getImageDataMatrix = function (imageData) {
        var data = imageData.data;
        var width = imageData.width;
        var height = imageData.height;
        var matrix = [];
        for (var i = 0; i < height; ++i) {
            matrix.push([]);
        }

        var getColorAt = function (row, col) {
            var offset = ((row * (width * 4)) + col * 4);
            return {
                r: data[offset],
                g: data[offset + 1],
                b: data[offset + 2],
                a: data[offset + 3]
            };
        };

        for (var row = 0; row < height; ++row) {
            for (var col = 0; col < width; ++col) {
                matrix[row][col] = getColorAt(row, col);
            }
        }
        return matrix;
    };

    // Handle window resize.
    app._onResize = function () {
        var appWidth = app._getComputedStyleProperty(app.el, 'width');
        document.querySelector('.width span').innerHTML = appWidth;
        if (typeof appWidth !== 'string') {
            log('cannot get app width');
            return;
        }
        var width = window.parseInt(appWidth.replace('px', ''), 10);
        if (!isNaN(width) && width !== app.width) {
            app.width = width;

            // Set the width class based on which width class element
            // is shown with the CSS media queries.
            var els = app.el.querySelectorAll('.width-class');
            var spans = Array.prototype.slice.call(els);
            var visible = spans.filter(function (s) {
                return app._getComputedStyleProperty(s, 'display') === 'inline';
            });
            if (visible.length === 1) {
                app.widthClass = visible[0].innerHTML;
            } else {
                log('could not get width class');
            }
        }
    };

    app._getColors = function (matrix) {
        var groups = _.groupBy(_.flatten(matrix), function (color) {
            return 'rgba(' +
                color.r + ', ' +
                color.g + ', ' +
                color.b + ', ' +
                color.a + ')';
        });
        var groupLengths = _.map(groups, function (val, key) {
            return {
                color: key,
                length: val.length
            };
        });
        var sorted =  _.sortBy(groupLengths, function (group) {
            return group.length;
        });
        sorted.reverse();
        return sorted;
    };

    app.handleImage = function (img, width, height) {
        log('handling image: ', img.src);
        app.canvas.width = width;
        app.canvas.height = height;
        var context = app.canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        var imageData = context.getImageData(0, 0, width, height);
        var matrix = app._getImageDataMatrix(imageData);
        var colors = app._getColors(matrix);

        var fragment = document.createDocumentFragment();
        colors.slice(0, app.settings.maxColors).forEach(function (color) {
            var li = document.createElement('li');
            var percentage = Math.round(color.length / (width * height) * 100);
            var span = document.createElement('span');
            span.style.backgroundColor = color.color;
            li.innerHTML = color.color + ': ' + percentage + '%';
            li.appendChild(span);
            fragment.appendChild(li);
        });
        app.colorList.appendChild(fragment);
    };

    app.setImageUrl = function (imgUrl) {
        log('set image from URL:', imgUrl);

        // Clear current iamge info.
        app.imgWrapper.innerHTML = '';
        app.colorList.innerHTML = '';

        var img = new Image();
        img.src = imgUrl;
        app.imgWrapper.appendChild(img);
        img.onload = function () {
            var width = app._getComputedStyleProperty(img, 'width');
            var height = app._getComputedStyleProperty(img, 'height');
            var w = window.parseInt(width.replace('px', ''), 10);
            var h = window.parseInt(height.replace('px', ''), 10);
            log('image loaded:', img.src, 'width:', w, 'heigth:', h);
            var maxDimension = app.settings.maxImageDimension;
            if (w > maxDimension || h > maxDimension) {
                app.imgWrapper.innerHTML = '';
                app.canvas.width = 0;
                app.canvas.height = 0;
                alert('Image too big.');
                return;
            }
            app.handleImage(img, w, h);
        };
    };

    app._addEvents = function () {
        window.addEventListener('resize', app._onResize);
        app.urlInputForm.addEventListener('submit', function (e) {
            e.preventDefault();
            app.setImageUrl(app.urlInput.value);
        });
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

        var content = app.el.querySelector('.content');
        app.content = content;
        app.imgWrapper = content.querySelector('.img-wrapper');
        app.canvas = content.querySelector('canvas');
        app.colorList = content.querySelector('.color-list');
        app.urlInputForm = content.querySelector('.set-image form');
        app.urlInput = app.urlInputForm.querySelector('input');

        app._addEvents();
        app._onResize();

        app.setImageUrl(app.urlInput.value);
    };

    // Expose the app namespace to global scope.
    window.clusterer = app;
}());
