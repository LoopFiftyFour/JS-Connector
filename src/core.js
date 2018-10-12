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
		cookies.setItem("Loop54User", text, 365*24*60*60); //365 days
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
					"lib-version": "JS:" + core.versions.libVersion,
					"api-version": core.versions.apiVersion,
				},
				responseType: "json",
				data: body
			})
			.then(function (response) {
				
				if(response.status === 200)
					return response;
				else {
					return Promise.reject(response);
				}
			})
			.catch (function (response) {
				
				var ret = response;
				
				//if there is no data, that means something went wrong before we got a response
				//construct a "fake" response object with the same properties as an error from the engine
				if(!ret.data) {
					ret = {
						data: {
							error: { title:response.message }
						}
					};
				}
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

	returnError: function (message,callback) {
		
		//construct a "fake" response object with the same properties as an error from the engine
		var ret = {
			data: {
				error: {title:message}
			}
		};
		
		if (callback) {
			return callback(ret);
		} else {
			return Promise.reject(ret);
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
	},
	
	validateEvent: function(event) {
		
		if (!event.type || typeof(event.type)!="string" || event.type.Length==0) {
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
	
	deleteCustomData: function(options)	{
		let ret = {...options};
		delete ret.customData;
	}
}

export default core;