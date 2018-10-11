import core from "./core.js";

/**
 * Used for communicating with a Loop54 engine
 */
global.Loop54 = (function () {

	var getClient = function (endpoint) {

		if(!endpoint || endpoint.Length==0)
			throw new Error("Parameter \"endpoint\" must be present and have a non-zero length.");
	
		return {

			/**
			 * The engine endpoint this client communicates with.
			 */
			endpoint: endpoint,

			/**
			 * Used for performing autocomplete requests to the engine.
			 * @param {string} searchTerm The query to find suggestions.
			 */
			autoComplete: function (query) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				if (typeof(query) != "string" || query.length == 0) {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "query is either missing or not a string"
						}
					}, callback);
				}

				var req = core.call(this.endpoint, "/autoComplete", {
						query: query,
						queriesOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			/**
			 * Used for tracking a user interaction
			 * @param {string} eventType The type of event. Typically "click", "addtocart" or "purchase"
			 * @param {string} type The type of entity that was interacted with. Typically "Product"
			 * @param {string} id The id of the entity that was interacted with. 
			 * @param {string} orderId The id of the order. Typically only used with purchase events.
			 * @param {number} quantity The quantity of this product in the order. Typically only used with purchase events.
			 * @param {number} revenue The revenue for this product in the order. Typically only used with purchase events.
			 */
			trackEvent: function (eventType, type, id, orderId, quantity, revenue) {

				if (!eventType) {
					return core.returnError("eventType needs to be set, standard events are \"click\", \"addtocart\" and \"purchase\".");
				}
				if (!type) {
					return core.returnError("All entities needs to have a \"type\" set, usually this is \"Product\".");
				}
				if (!id) {
					return core.returnError("All entities needs to have an \"id\" provided, this is usually the productId.");
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

			/**
			 * Used for tracking a multiple user interactions, for instance when purchasing multiple products at once.
			 * @param {array} events The events to push. See trackEvent for detailed information about events.
			 */
			trackEvents: function (events) {
				// purchase, addToCart, click

				core.call(this.endpoint, "/createEvents", {
					events: events
				});
			},

			/**
			 * Used for performing getRelatedEntities requests to the engine.
			 * @param {object} entity The entity for which to find related entities
			 */
			getRelatedEntities: function (entity) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				//validate entity
				if (typeof(entity) != "object" || !entity.type || !entity.id) {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "entity must be an object with properties \"type\" and \"id\"."
						}
					}, callback);
				}
				
				var req = core.call(this.endpoint, "/getRelatedEntities", {
						entity: entity,
						resultsOptions: options
					}, null, callback);

				if (!callback) {
					// if callback is missing, return a promise
					return req;
				}
			},

			/**
			 * Used for performing getEntitiesByAttribute requests to the engine.
			 * @param {string} attributeName The name of the attribute for which to get entities
			 * @param {any} attributeValue The value of the attribute for which to get entitites
			 */
			getEntitiesByAttribute: function (attributeName, attributeValue) {

				var args = core.getOptionsAndCallback(arguments, 2);
				if (args.error) {
					return core.returnError(args);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				//validate arguments
				if (typeof(attributeName) != "string") {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "Missing argument attributeName or attributeName was not of type string."
						}
					}, callback);
				}
				
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

			/**
			 * Used for performing getEntities requests to the engine.
			 */
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

			/**
			 * Used for performing search requests to the engine.
			 * @param {string} query The query to search for
			 */
			search: function (query) {

				var args = core.getOptionsAndCallback(arguments, 1);
				if (args.error) {
					return core.returnError(args,args.callback);
				}

				var options = args.options ? args.options : {};
				var callback = args.callback ? args.callback : null;

				//validate input
				if (typeof(query) != "string" || query.length == 0) {
					return core.returnError({
						error: {
							type: "ArgumentError",
							data: "query is either missing or not a string"
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
						query: query,
						...parameters
					}, null, callback);

				if (!callback) { // if callback is missing, return a promise
					return req;
				}
			}
		}
	}

	return {
		/**
		 * Returns a client that can be used to communicate with the engine.
		 * @param {string} endpoint The complete URL to the engine.
		*/
		getClient: getClient
	}
})();
