import axios from "axios";
import cookies from "./cookies.js";

let core = {

    versions: {
        libVersion: "1.7.5454545454-build-number", //"5454545454-build-number" will be replaced by teamcity. also in package.json
        apiVersion: "V3"
    },

    userIdCookieKey: "Loop54User",
    userIdCookiePath: "/",

    setUserId: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        cookies.setItem(core.userIdCookieKey, text, 365 * 24 * 60 * 60, core.userIdCookiePath); //365 days
        return text;
    },

    getUserId: function () {
        var existing = cookies.getItem(core.userIdCookieKey);
        if (existing) {
            return existing;
        }
        return core.setUserId();
    },

    removeUserId: function () {
        return cookies.removeItem(core.userIdCookieKey, core.userIdCookiePath);
    },

    call: function (endpoint, path, body, method, callback, userId, apiKey, customHeaders) {

        if(!userId)
            userId = core.getUserId();

        body = JSON.parse(JSON.stringify(body));

        var url = core.ensureProtocol(endpoint) + path;

        var headers = {
            "user-id": userId,
            "lib-version": "JS:" + core.versions.libVersion,
            "api-version": core.versions.apiVersion,
        }

        if(customHeaders){
            for (const key in customHeaders) {
                headers[key] = customHeaders[key];
            }
        }

        if(apiKey)
            headers["Loop54-key"] = apiKey;

        var cancellationSource = axios.CancelToken.source();
        var request = axios({
            method: method ? method : "post",
            url: url,
            headers: headers,
            responseType: "json",
            data: body,
            cancelToken: cancellationSource.token
        })
        .then(function (response) {

            if(response.status === 200)
                return response;
            else {
                return Promise.reject(response);
            }
        })
        .catch(function (error) {

            if (axios.isCancel(error)) {
                return { cancelled:true };
            }
        
            var ret = error;

            //if there is no data, that means something went wrong before we got a response
            //construct a "fake" response object with the same properties as an error from the engine
            if(!ret.response || !ret.response.data) {
                ret = {
                    data: {
                        error: {
                            title: error.message
                        }
                    }
                };
            }
            return Promise.reject(ret);
        });
        
        request.cancel = function () {
            cancellationSource.cancel();
            return request;
        }
        
        if (callback) {
            request.then(callback).catch(function(response){
                callback(response);
            });
        }
            
        return request;
    },

    ensureProtocol: function (url) {

        //make sure it starts with http or https
        if (!url.startsWith("http://") && !url.startsWith("https://"))
            url = "https://" + url;

        //make sure it doesnt end with slash
        while (url.endsWith("/"))
            url = url.substring(0, url.length - 1);

        return url;

    },

    returnError: function (message, callback) {

        //construct a "fake" response object with the same properties as an error from the engine
        var ret = {
            data: {
                error: {
                    title: message
                }
            }
        };

        if (callback) {
            return callback(ret);
        } else {
            return Promise.reject(ret);
        }
    },

    getOptionsAndCallback: function (args, numRequiredParameters, maxNumParameters) {

        //too few parameters
        if (args.length < numRequiredParameters)
            return {
                error: "Expected at least " + numRequiredParameters + " parameters."
            };

        //no options or other extra parameter
        if (args.length == numRequiredParameters)
            return {};
        
        if(!maxNumParameters)
            maxNumParameters = numRequiredParameters + 2;

        //too many parameters
        if (args.length > maxNumParameters)
            return {
                error: "Expected at most " + (maxNumParameters) + " parameters."
            };

        var options;
        var callback;

        //loop through the last parameters to find options and callback
        for (var i = numRequiredParameters; i < args.length; i++) {
            if (typeof(args[i]) === "function")
                callback = args[i];
            else if (typeof(args[i]) === "object")
                options = args[i];
        }

        return {
            options: options,
            callback: callback
        };
    },

    validateEvent: function(event) {
        if (typeof event !== 'object') {
            return "event needs to be an object.";
        }
        if (typeof event.type !== "string" || event.type.length === 0) {
            return "type needs to be set, standard events are \"click\", \"addtocart\" and \"purchase\".";
        }
        if(!event.entity) {
            return "entity needs to be set.";
        }
        if (!event.entity.type) {
            return "entity needs to have a \"type\" set, usually this is \"Product\".";
        }
        if (!event.entity.id) {
            return "entity needs to have an \"id\" provided, this is usually the productId.";
        }

        return null;
    },

    deleteCustomData: function(options){
        let ret = JSON.parse(JSON.stringify(options));
        delete ret.customData;

        return ret;
    }
}

export default core;
