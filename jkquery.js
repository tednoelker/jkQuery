(function () {
    'use strict';

    var jkQuery = {};

    /* jkQuery().select()
     *
     * Lightweight, psuedo-jQuery utlity selector. Accepts query string or object
     * and builds elements from query string if not already existant.
     *
     * @private
     * @param mixed query
     * @returns object
     *
     */

    jkQuery.select = function (query) {

        var element = false;

        // Test if an object was supplied rather than a string
        if (query === document || query === window) {

            query = 'html';
            element = document.querySelectorAll(query);

        } else if (typeof query.tagName !== 'undefined') {

            element = query;

        } else if (typeof query === 'string') {

            // Test if entire query already exists
            var querySelectorAll = document.querySelectorAll(query);

            if (querySelectorAll) {
                element = querySelectorAll;
            } else {
                element = { 0: jkQuery.build(query) };
            }

        }

        // Chain event methods
        for (var i = 0; i < element.length; i++) {

            for (var fn in jkQuery.fn) {
                if (jkQuery.fn.hasOwnProperty(fn)) {
                    element[i][fn] = jkQuery.fn[fn];
                }
            }

        }

        //
        if (element.length == 1) {

            element = element[0];
            element.length = 1;

        } else {

            element.class = function (toggle, classname) {
                for (var i = 0; i < element.length; i++) {
                    jkQuery.select(query)[i].class(toggle, classname);
                }
            };

            element.get = function () {
                return element;
            };

            element.impress = function (callback) {
                for (var i = 0; i < element.length; i++) {
                    jkQuery.select(query)[i].impress(callback);
                }
            };

            element.on = function (type, callback) {
                for (var i = 0; i < element.length; i++) {
                    jkQuery.select(query)[i].on(type, callback);
                }
            };

        }

        return element;

    };
    /***/


    /* jkQuery.build()
     *
     * Node builder called from jkQuery.select()
     *
     * @private
     * @param string query
     * @returns object
     *
     */

    jkQuery.build = function (query) {

        var element = false;

        // Separate parent/child selectors if present
        var nodes = query.split(' ');

        // Query each node
        for (var i = 0; i < nodes.length; i++) {

            var elders = query.split(nodes[i])[0],
                parent = document.querySelector(elders),
                exists = parent.querySelector(nodes[i]);

            if (exists) {

                element = exists;

            } else {

                // Default element if not specified
                element = document.createElement('div');

                // Split id, class and element delimiters
                var selectors = nodes[i].match(/\#[^.]*|\.[^.#]*|^[^.#]*/g);

                // Append attributes by type
                for (var a = 0; a < selectors.length; a++) {

                    var attr = selectors[a];

                    if (attr.indexOf('#') > -1) {
                        element.setAttribute('id', attr.split('#')[1]);
                    } else if (attr.indexOf('.') > -1) {
                        element.classList.add(attr.split('.')[1]);
                    } else if (attr == 'svg' || attr == 'circle' || attr == 'ellipse' || attr == 'line' || attr == 'path' || attr == 'polyline' || attr == 'polygon' || attr == 'rect') {
                        element = document.createElementNS('http://www.w3.org/2000/svg', attr);
                    } else {
                        element = document.createElement(attr);
                    }

                }

                parent.appendChild(element);

            }

        }

        return element;

    };
    /***/


    // Group public methods
    jkQuery.fn = {};

    /* this.event()
     *
     * Chain method to bind an event listener
     *
     * @private
     * @param string type
     * @callback
     * @returns object
     *
     */

    jkQuery.fn.on = function (type, callback) {

        var event = type.split(' ');

        for (var i = 0; i < event.length; i++) {

            this.addEventListener(event[i], function (e) {
                callback.call(this, e);
            });

        }

        return this;

    };
    /***/


    /* this.class()
     *
     * Chain method to add/remove class
     *
     * @private
     * @param string toggle
     * @param string classname
     * @returns object
     *
     */

    jkQuery.fn.class = function (toggle, classname) {

        this.classList[toggle](classname);

        return this;

    };
    /***/


    /* this.get()
     *
     * Chain method to calculate property value
     *
     * @private
     * @param string property
     * @returns number
     *
     */

    jkQuery.fn.get = function (property) {

        var value = getComputedStyle(this).getPropertyValue(property);

        return parseFloat(value);

    };
    /***/


    /* this.impress()
     *
     * Chain method to bind an event on click or touchstart, but not both in succession
     *
     * @private
     * @callback
     * @returns object
     *
     */

    jkQuery.fn.impress = function (callback) {

        var trackTouch = {};

        this.addEventListener('touchstart', function (e) {
            trackTouch.x = e.touches[0].pageX;
            trackTouch.y = e.touches[0].pageY;
        });

        this.addEventListener('touchend', function (e) {
            var scrollX = Math.abs(trackTouch.x - e.changedTouches[0].pageX),
                scrollY = Math.abs(trackTouch.y - e.changedTouches[0].pageY);
            if ( (scrollX < 10) && (scrollY < 10) ) {
                callback.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
        });

        this.addEventListener('click', function (e) {
            callback.call(this, e);
            e.preventDefault();
        });

        return this;

    };
    /***/


    // Expose constructor function
    window.jkQuery = jkQuery.select;

})();
