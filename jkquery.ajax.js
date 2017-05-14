(function (jkQuery, XMLHttpRequest) {

    'use strict';


    /* jkQuery.ajax()
     *
     * Expose AJAX constructor as a jkQuery method
     *
     * @public
     * @param {string} file
     * @returns {object} new AJAX
     *
     */

    jkQuery.ajax = function (file) {
        return new AJAX(file);
    };
    /***/


    /* jkQuery.ajax()
     *
     * Construct a new AJAX request
     *
     * @public
     * @param {string} file
     * @returns {object} jkQuery.ajax()
     *
     */

    var AJAX = function (file) {

        // Validate file argument
        this._file = (typeof file === 'string') ? file : false;

        // Empty function to default to if a valid promise is not provided
        this._onError = function () { return false; };

        return this;

    };
    /***/


    /* jkQuery.ajax().request()
     *
     * Fetch and process the requested file
     *
     * @public
     * @param {string} file
     * @param {function} successCallback
     * @param {function} errorCallback
     * @returns {object} jkQuery.ajax()
     *
     */

    AJAX.prototype.request = function (file, successCallback, errorCallback) {

        // Create new XMLHttpRequest
        var httpRequest = new XMLHttpRequest();

        // Throw error and die if XMLHttpRequest or file path is not available
        if (!httpRequest || !file || !successCallback) {
            errorCallback.call(httpRequest, httpRequest);
            return false;
        }

        // Attach error callback to httpRequest's native error handler
        httpRequest.onerror = function () {
            return errorCallback.call(httpRequest, httpRequest);
        };

        // Listen for success state and deliever the success callback
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var response = httpRequest.responseText;
                    if (httpRequest.getResponseHeader('content-type').indexOf('json') > -1) {
                        response = JSON.parse(httpRequest.responseText);
                    }
                    return successCallback.call(httpRequest, response);
                }
                // Throw error if file did not return a 200 status
                return errorCallback.call(httpRequest, httpRequest);
            }
        };

        // Create and send the request
        httpRequest.open('GET', file);
        httpRequest.send();

        return this;

    };
    /***/


    /* jkQuery.ajax().success()
     *
     * Employ the success function as a promise and create a request using the
     * file specified in the AJAX constructor.
     *
     * @public
     * @param {function} callback
     * @returns {object} jkQuery.ajax().request()
     *
     */

    AJAX.prototype.success = function (callback) {
        if (typeof callback === 'function') {
            this._onSuccess = callback;
            return this.request(this._file, this._onSuccess, this._onError);
        }
        return this;
    };
    /***/


    /* jkQuery.ajax().error()
     *
     * Accept a user error function as a promise.
     *
     * @public
     * @param {string} file
     * @param {function} callback
     * @returns {object} jkQuery.ajax()
     *
     */

    AJAX.prototype.error = function (callback) {
        if (typeof callback === 'function') {
            this._onError = callback;
        }
        return this;
    };
    /***/


})(window.jkQuery, window.XMLHttpRequest);
