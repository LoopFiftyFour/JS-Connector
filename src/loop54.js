import core from "./core.js";

global.Loop54 = (function () {

	var getClient = function (endpoint) {

		return {

			endpoint: endpoint,

			autoComplete: function (searchTerm) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				if (typeof(searchTerm) != "string" || searchTerm.length == 0) {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "Search term is either missing or not a string"
						}
					}, callback);
				}

				var req = core.call(this.endpoint, "/autoComplete", {
						query: searchTerm,
						queriesOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			trackEvent: function (eventType, type, id, orderId, quantity, revenue) {
				// purchase, addToCart, click

				if (!eventType) {
					return core.returnError("eventType needs to be set, our standard events are \"click\", \"addtocart\" and \"purchase\"");
				}
				if (!type) {
					return core.returnError("All entities needs to have a \"type\" set, usually this is \"Product\" but can basically be anything");
				}
				if (!id) {
					return core.returnError("All entities needs to have an \"id\" provided, this is usually the productId");
				}

				var event = {
					type: eventType,
					entity: {
						type: type,
						id: id
					}
				};

				// purchase event extra attributes
				if (orderId) {
					event.orderId = orderId;
				}
				if (quantity) {
					event.quantity = parseFloat(quantity);
				}
				if (revenue) {
					event.revenue = parseFloat(revenue);
				}

				core.call(this.endpoint, "/createEvents", {
					events: [event]
				});
			},

			trackEvents: function (events) {
				// purchase, addToCart, click

				core.call(this.endpoint, "/createEvents", {
					events: events
				});
			},

			getRelatedEntities: function (entity) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				var req = core.call(this.endpoint, "/getRelatedEntities", {
						entity: entity,
						resultsOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			getEntitiesByAttribute: function (attributeName, attributeValue) {

				var args = core.getOptionsAndCallback(arguments, 2);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				var req = core.call(this.endpoint, "/getEntitiesByAttribute", {
						attribute: {
							name: attributeName,
							value: attributeValue
						},
						resultsOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			getEntities: function () {

				var args = core.getOptionsAndCallback(arguments, 0);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				var req = core.call(this.endpoint, "/getEntities", {
						resultsOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			search: function (searchTerm) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args,args.callback);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				/*
				 * Make sure there is a searchTerm added and check the formatting (needs to be string)
				 */
				if (typeof(searchTerm) != "string" || searchTerm.length == 0) {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "Search term is either missing or not a string"
						}
					}, callback);
				}

				//copy over options from provided options to resultsOptions on the parameter object
				//TODO: is this needed?
				var parameters = {};
				if (options) {
					if (options.relatedResultsOptions) {
						parameters = {
							...parameters,
							relatedResultsOptions: options.relatedResultsOptions
						};
					}

					if (options.spellingSuggestionsOptions) {
						parameters = {
							...parameters,
							spellingSuggestionsOptions: options.spellingSuggestionsOptions
						};
					}

					if (options.relatedQueriesOptions) {
						parameters = {
							...parameters,
							relatedQueriesOptions: options.relatedQueriesOptions
						};
					}

					if (options.sortBy) {
						parameters["resultsOptions"] = {
							...parameters["resultsOptions"],
							sortBy: options.sortBy
						};
					}

					if (options.filters) {
						parameters["resultsOptions"] = {
							...parameters["resultsOptions"],
							filters: options.filters
						};
					}

					if (options.take) {
						parameters["resultsOptions"] = {
							...parameters["resultsOptions"],
							take: options.take
						};
					}

					if (options.skip) {
						parameters["resultsOptions"] = {
							...parameters["resultsOptions"],
							skip: options.skip
						};
					}

					if (options.facets) {
						parameters["resultsOptions"] = {
							...parameters["resultsOptions"],
							facets: options.facets
						};
					}
				}

				var req = core.call(this.endpoint, "/search", {
						query: searchTerm,
						...parameters
					}, null, callback);

				if (!callback) { // if callback is missing, return a promise
					return req;
				}
			}
		}
	}

	return {
		getClient: getClient
	}
})();
