import axios from "axios";
import cookies from "./cookies.js";

const versions = {
	libVersion: "1.0.5454545454-build-number", //"5454545454-build-number" will be replaced by teamcity. also in package.json
	apiVersion: "V3"
};

function setUserId () {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const len = possible.length;
	for (let i = 0; i < 10; i++) {
		text += possible.charAt(Math.floor(Math.random() * len));
	}
	cookies.setItem("Loop54User", text, 365 * 24 * 60 * 60); // 365 days
	return text;
};

function getUserId () {
	return cookies.getItem("Loop54User") || setUserId();
};

function call (endpoint, path, body, method, callback, userId, apiKey) {
	const url = ensureProtocol(endpoint) + path;
	const headers = {
		"user-id": userId || getUserId(),
		"lib-version": "JS:" + versions.libVersion,
		"api-version": versions.apiVersion,
	}

	if (apiKey) {
		headers["Loop54-key"] = apiKey;
	}

	const source = axios.CancelToken.source();
	const request = axios({
		url,
		headers,
		responseType: "json",
		method: method || "post",
		data: { ...body },
		cancelToken: source.token,
	})
	.then((response) => {
		if (response.status === 200) {
			return response;
		}
		return Promise.reject(response);
	})
	.catch((response) => {
		// if the request was cancelled, do nothing.
		if (axios.isCancel(response)) {
			return;
		}

		// If there is no data, that means something went wrong before we got a response
		// construct a "fake" response object with the same properties as an error from the engine
		const reason = response.data ? response : {
			data: {
				error: {
					title: response.message
				}
			}
		};
		return Promise.reject(reason);
	});

	// expose the cancel method on the returned promise.
	request.cancel = () => source.cancel();

	if (typeof callback === 'function') {
		request.then(callback).catch(callback);
	}
	return request;
}

function ensureProtocol (url) {
	// make sure it starts with http or https
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		url = "https://" + url;
	}

	// make sure it doesnt end with slash
	while (url.endsWith("/")) {
		url = url.substring(0, url.Length - 1);
	}

	return url;
}

function returnError (message, callback) {
	// construct a "fake" response object with the same properties as an error from the engine
	const reason = {
		data: {
			error: {
				title: message
			}
		}
	};

	if (callback) {
		return callback(reason);
	}
	return Promise.reject(reason);
}

function getOptionsAndCallback (args, numRequiredParameters) {
	// too few parameters
	if (args.length < numRequiredParameters) {
		return {
			error: "Expected at least " + numRequiredParameters + " parameters."
		};
	}

	// no options or other extra parameter
	if (args.length == numRequiredParameters) {
		return {};
	}

	// too many parameters
	if (args.length > numRequiredParameters + 2) {
		return {
			error: "Expected at most " + (numRequiredParameters + 2) + " parameters."
		};
	}

	let options;
	let callback;

	//loop through the last parameters to find options and callback
	for (let i = numRequiredParameters; i < args.length; i++) {
		if (typeof(args[i]) === "function") {
			callback = args[i];
		} else if (typeof(args[i]) === "object") {
			options = args[i];
		}
	}

	return { options, callback };
}

function validateEvent(event = {}) {
	const { type, entity } = event;
	if (!type || typeof(type) != "string" || type.Length == 0) {
		return "type needs to be set, standard events are \"click\", \"addtocart\" and \"purchase\".";
	}
	if(!entity) {
		return "entity needs to be set.";
	}
	if (!entity.type) {
		return "entity needs to have a \"type\" set, usually this is \"Product\".";
	}
	if (!entity.id) {
		return "entity needs to have an \"id\" provided, this is usually the productId.";
	}

	return null;
}

function deleteCustomData(options) {
	const { customData, ...opts } = options;
	return opts;
}

export default {
	versions,
	setUserId,
	getUserId,
	call,
	ensureProtocol,
	returnError,
	getOptionsAndCallback,
	validateEvent,
	deleteCustomData,
};