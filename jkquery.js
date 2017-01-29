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
     * @returns element
     *
     */

    jkQuery.select = function (query) {

        var element = false;

        // Test if an object was supplied rather than a string
        if (query === document || query === window) {

            query = 'html';
            element = document.querySelectorAll(query);

        } else if (typeof query === 'object') {

            element = query;

        } else if (typeof query === 'string') {

            // Test if entire query already exists
            var querySelectorAll = document.querySelectorAll(query);

            if (querySelectorAll.length) {
                element = querySelectorAll;
            } else {
                element = [ jkQuery.build(query, document) ];
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

            for (var fns in jkQuery.fn) {
                if (jkQuery.fn.hasOwnProperty(fns)) {
                    jkQuery.each(element, fns);
                }
            }

        }

        return element;

    };
    /***/


    /* jkQuery.build()
     *
     * Node builder called from jkQuery.select() or fn.append()
     *
     * @private
     * @param string query
     * @param object node
     * @returns element
     *
     */

    jkQuery.build = function (query, node) {

        var element = false,
            parent  = node;

        // Separate parent/child selectors if present
        var nodes = query.split(' ');

        // Query each node
        for (var i = 0; i < nodes.length; i++) {

            var exists = parent.querySelector(nodes[i]);

            if (exists) {

                parent = element = exists;

            } else {

                // Default element if not specified
                element = document.createElement('div');

                // Default parent container if not further specified
                if (parent === document) {
                    parent = document.body;
                }

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

                parent = element;

            }

        }

        return element;

    };
    /***/


    /* jkQuery.each()
     *
     * Pass each function and its arguments to the individual elements
     *
     * @private
     * @param array elements
     * @param string fn
     * @returns array
     *
     */

    jkQuery.each = function (elements, fn) {

        elements[fn] = function (args) {
            for (var i = 0; i < elements.length; i++) {
                elements[i][fn].apply(elements[i], arguments);
            }
            return elements;
        };

        return elements;

    };
    /***/


    // Group public methods
    jkQuery.fn = {};


    /* this.each()
     *
     * Call user function on each selected element
     *
     * @public
     * @callback
     * @returns element
     *
     */

    jkQuery.fn.each = function (callback) {

        if (typeof callback === 'function') {
            callback(this);
        }

        return this;

    };
    /***/


    /* this.on()
     *
     * Chain method to bind an event listener
     *
     * @public
     * @param string type
     * @callback
     * @returns element
     *
     */

    jkQuery.fn.on = function (type, callback) {

        var element = this;

        var bind = function (on) {
            element.addEventListener(on, function (e) {
                callback.call(this, e);
            });
        };

        var event = type.split(' ');

        for (var i = 0; i < event.length; i++) {
            bind(event[i]);
        }

        return this;

    };
    /***/


    /* this.class()
     *
     * Chain method to add/remove class
     *
     * @public
     * @param string toggle
     * @param string classname
     * @returns element
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
     * @public
     * @param string property
     * @returns number
     *
     */

    jkQuery.fn.get = function (property) {

        var value = getComputedStyle(this).getPropertyValue(property);

        return value;

    };
    /***/


    /* this.impress()
     *
     * Chain method to bind an event on click or touchstart, but not both in succession
     *
     * @public
     * @callback
     * @returns element
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


    /* this.append()
     *
     * Chain method to bind an event on click or touchstart, but not both in succession
     *
     * @public
     * @param string string
     * @returns element
     *
     */

    jkQuery.fn.append = function (string) {

        if (string.indexOf('<') > -1) {
            var html = this.innerHTML;
            this.innerHTML = html + string;
        } else {
            jkQuery.build(string, this);
        }

        return this;

    };
    /***/


    // Expose constructor function
    window.jkQuery = jkQuery.select;

})();
