(function () {

    'use strict';


    /* jkQuery()
     *
     * jQuery-esque utlity function
     *
     * @public
     * @version 1.0.1
     * @param {mixed} query
     * @returns {object} new jkQuery element
     *
     */

    var jkQuery = function (query) {
        return new jkQuery.select(query);
    };
    /***/




    /* _bindEvent()
     *
     * Attach event to element
     *
     * @private
     * @param {string} on
     * @param {object} element
     * @callback {jkQuery~_bindEventCallback}
     * @returns {object} element
     *
     * @callback jkQuery~_bindEventCallback
     * @this {object} element
     * @param {object} eventData
     *
     */

    var _bindEvent = function (on, element, callback) {

        element.addEventListener(on, function (e) {
            callback.call(this, e);
        });

        return element;

    };
    /***/


    /* _buildElement()
     *
     * Query string node builder
     *
     * @private
     * @param string query
     * @param object parent
     * @returns {object} element
     *
     */

    var _buildElement = function (query, parent) {

        var element = false;

        // Separate parent/child selectors if present
        var nodes = query.split(' ');

        // Query each node
        jkQuery.for(nodes, function (i) {

            var exists = parent.querySelector(nodes[i]);

            if (exists) {

                // Update the parent node for subsequent element queries
                parent = element = exists;

            } else {

                // Default element if not specified
                element = document.createElement('div');

                // Split id, class and element delimiters
                var selectors = nodes[i].match(/\#[^.]*|\.[^.#]*|^[^.#]*/g);

                // Create attributes by type
                jkQuery.for(selectors, function () {

                    if (this.indexOf('#') > -1) {
                        element.setAttribute('id', this.split('#')[1]);
                    } else if (this.indexOf('.') > -1) {
                        element.classList.add(this.split('.')[1]);
                    } else if (this == 'svg' || this == 'circle' || this == 'ellipse' || this == 'line' || this == 'path' || this == 'polyline' || this == 'polygon' || this == 'rect') {
                        element = document.createElementNS('http://www.w3.org/2000/svg', this);
                    } else {
                        element = document.createElement(this);
                    }

                });

                // Append inside parent
                parent.appendChild(element);

                // Update the parent node for subsequent element queries
                parent = element;

            }

        });

        return element;

    };
    /***/




    /* jkQuery.for()
     *
     * Loop through an array (or object with defined length)
     *
     * @public
     * @param {array|object} obj
     * @callback {jkQuery~forCallback}
     * @returns {object} jkQuery
     *
     * @callback jkQuery~forCallback
     * @this {mixed} key-value
     * @param {number} index
     * @param {number} key-value
     *
     */

    jkQuery.for = function (obj, callback) {

        for (var i = 0; i < obj.length; i++) {
            callback.call(obj[i], i, obj[i]);
        }

        return this;

    };
    /***/


    /* jkQuery.forIn()
     *
     * Loop through an object
     *
     * @public
     * @param {object} obj
     * @callback {jkQuery~forInCallback}
     * @returns {object} jkQuery
     *
     * @callback jkQuery~forInCallback
     * @this {mixed} key-value
     * @param {number} key-value
     *
     */

    jkQuery.forIn = function (obj, callback) {

        for (var val in obj) {
            if ( obj.hasOwnProperty(val) ) {
                callback.call(val, val);
            }
        }

        return this;

    };
    /***/


    /* jkQuery.select()
     *
     * Element selection / constructor function
     *
     * @public
     * @param {mixed} query
     * @returns {object} jkQuery element
     *
     */

    jkQuery.select = function (query) {

        // Test if an object was supplied rather than a string
        if (query === document || query === window) {

            this[0] = document.querySelector('html');
            this.length = 1;

        } else if (typeof query.tagName !== 'undefined') {

            this[0] = query;
            this.length = 1;

        } else if (typeof query === 'string') {

            var elements = document.querySelectorAll(query);

            this.length = elements.length;

            var self = this;

            jkQuery.for(elements, function (i) {
                self[i] = this;
            });

        }

        return this;

    };
    /***/




    // Shorthand to bind event methods to element selector
    jkQuery.fn = jkQuery.select.prototype;


    /* this.append()
     *
     * Chain method to bind an event on click or touchstart, but not both in succession
     *
     * @public
     * @param {string} string
     * @returns {object} jkQuery element
     *
     */

    jkQuery.fn.append = function (string) {

        jkQuery.for(this, function () {

            if (string.indexOf('<') > -1) {
                var html = this.innerHTML;
                this.innerHTML = html + string;
            } else {
                _buildElement(string, this);
            }

        });

        return this;

    };
    /***/


    /* this.class()
     *
     * Chain method to add/remove class
     *
     * @public
     * @param {string} toggle
     * @param {string} classname
     * @returns {object} jkQuery element
     *
     */

    jkQuery.fn.class = function (toggle, classname) {

        jkQuery.for(this, function () {
            this.classList[toggle](classname);
        });

        return this;

    };
    /***/


    /* this.css()
     *
     * Chain method to calculate property value
     *
     * @public
     * @param {string} property
     * @returns {mixed}
     *
     */

    jkQuery.fn.css = function (property) {

        var value = getComputedStyle(this[0]).getPropertyValue(property);

        return value;

    };
    /***/


    /* this.each()
     *
     * Call user function on each selected element
     *
     * @public
     * @callback {jkQuery~fnEachCallback}
     * @returns {object} jkQuery element
     *
     * @callback jkQuery~fnEachCallback
     * @this {object} element
     * @param {object} jkQuery element
     * @param {number} index
     *
     */

    jkQuery.fn.each = function (callback) {

        jkQuery.for(this, function (index) {
            if (typeof callback === 'function') {
                callback.call(this, jkQuery(this), index);
            }
        });

        return this;

    };
    /***/


    /* this.on()
     *
     * Chain method to bind an event listener
     *
     * @public
     * @param {string} eventName
     * @callback {jkQuery~_bindEventCallback}
     * @returns {object} jkQuery element
     *
     */

    jkQuery.fn.on = function (eventList, callback) {

        var events = eventList.split(' ');

        jkQuery.for(this, function () {

            var element = this;

            jkQuery.for(events, function () {
                _bindEvent(this, element, callback);
            });

        });

        return this;

    };
    /***/


    /* this.press()
     *
     * Chain method to bind an event on click or touchstart, but not both in succession
     *
     * @public
     * @callback {jkQuery~_bindEventCallback}
     * @returns {object} jkQuery element
     *
     */

    jkQuery.fn.press = function (callback) {

        jkQuery.for(this, function () {

            var touch = {};

            _bindEvent('touchstart', this, function (e) {
                touch.x = e.touches[0].pageX;
                touch.y = e.touches[0].pageY;
            });

            _bindEvent('touchend', this, function (e) {
                var scrollX = Math.abs(touch.x - e.changedTouches[0].pageX),
                    scrollY = Math.abs(touch.y - e.changedTouches[0].pageY);

                if ( (scrollX < 10) && (scrollY < 10) ) {
                    callback.call(this, e);
                }
            });

            _bindEvent('click', this, function (e) {
                if (typeof touch.x === 'undefined') {
                    callback.call(this, e);
                }
            });

        });

        return this;

    };
    /***/




    // Expose public helper functions and selection methods
    window.jkQuery = jkQuery;

})();
