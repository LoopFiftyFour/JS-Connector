import axios from "axios";
import cookies from "./cookies.js";

let core = {

	versions: {
		libVersion: "2.0.0",
		apiVersion: "V3"
	},

	setUserId: function () {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 10; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		cookies.setItem("Loop54User", text, 365);
		return text;
	},

	getUserId: function () {
		var existing = cookies.getItem("Loop54User");
		if (existing) {
			return existing;
		}
		return core.setUserId();
	},

	call: function (endpoint, path, body, method, callback) {
		var userId = core.getUserId();
		body = {
			...body
		};
		var request = axios({
				method: method ? method : "post",
				url: core.ensureProtocol(endpoint) + path,
				headers: {
					"user-id": userId,
					"lib-version": core.versions.libVersion,
					"api-version": core.versions.apiVersion,
				},
				responseType: "json",
				data: body
			})
			.then(function (response) {
				
				var ret = {
					status: response.status,
					data: response.data
				};
				
				if(response.status === 200)
					return ret;
				else {
					throw new Error({
						error: ret
					});
				}
			})
			.catch (function (response) {
				var ret = {
						status: response.status,
						data: response.data
					};
				return Promise.reject(ret);
			});

		if (callback) {
			request.then(callback).catch(function(response){callback(response);});
		} else {
			return request;
		}
	},

	ensureProtocol: function (url) {

		if (!url.startsWith("http"))
			url = "https://" + url;

		if (!url.endsWith("/"))
			url = url + "/";

		return url;

	},

	returnError: function (debug, message, callback) {
		if (callback) {
			if (debug) {
				console.error(message);
			}
			return callback(message);
		} else {
			if (debug) {
				console.error(message);
			}
			return message;
		}
	},

	getOptionsAndCallback: function (args, numRequiredParameters) {

		if (args.length < numRequiredParameters)
			return {
				error: "Expected at least " + numRequiredParameters + " parameters."
			};

		//no options or parameter
		if (args.length == numRequiredParameters)
			return {};

		if (args.length > numRequiredParameters + 2)
			return {
				error: "Expected at most " + (numRequiredParameters + 2) + " parameters."
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
	}
}

export default core;