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
		
		var url = core.ensureProtocol(endpoint) + path;
		
		var request = axios({
				method: method ? method : "post",
				url: url,
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

		//make sure it starts with http or https
		if (!url.startsWith("http://") && !url.startsWith("https://"))
			url = "https://" + url;

		//make sure it doesnt end with slash
		while (url.endsWith("/"))
			url = url.substring(0,url.Length-1);

		return url;

	},

	returnError: function (errorObject,callback) {
		if (callback) {
			console.error(errorObject);
			return callback(errorObject);
		} else {
			console.error(errorObject);
			return Promise.reject(errorObject);
		}
	},

	getOptionsAndCallback: function (args, numRequiredParameters) {

		//too few parameters
		if (args.length < numRequiredParameters)
			return {
				error: "Expected at least " + numRequiredParameters + " parameters."
			};

		//no options or other extra parameter
		if (args.length == numRequiredParameters)
			return {};

		//too many parameters
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