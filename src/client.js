import core from './core.js';

/**
 * Returns a client that can be used to communicate with the engine.
 * @param {string} endpoint The complete URL to the engine.
*/
function getLoop54Client (endpoint, userId, apiKey) {

    if (typeof endpoint !== 'string' || endpoint.length === 0) {
        throw new Error("Parameter \"endpoint\" must be present and have a non-zero length.");
    }

    return {

        /**
         * The engine endpoint this client communicates with.
         */
        endpoint: endpoint,
        
        /**
         * The user ID to use for communications. If left falsy, cookies will be used to track user ID.
         */
        userId: userId,
        
        /**
         * The api key to use for communications. This is required for administrative operations.
         */
        apiKey: apiKey,

        /**
         * Used for performing autocomplete requests to the engine.
         * @param {string} searchTerm The query to find suggestions.
         */
        autoComplete: function (query) {

            var args = core.getOptionsAndCallback(arguments, 1);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            if (typeof(query) != "string" || query.length == 0) {
                return core.returnError("query is either missing or not a string", callback);
            }

            var req = core.call(this.endpoint, "/autoComplete", {
                    query: query,
                    queriesOptions: core.deleteCustomData(options),
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        },

        /**
         * Used for tracking a user interaction
         * @param {string} eventType The type of event. Typically "click", "addtocart" or "purchase"
         * @param {object} entity The entity that was interacted with. Must have properties "type" and "id"
         * @param {string} orderId The id of the order. Typically only used with purchase events.
         * @param {number} quantity The quantity of this product in the order. Typically only used with purchase events.
         * @param {number} revenue The revenue for this product in the order. Typically only used with purchase events.
         */
        createEvent: function (eventType, entity, orderId, quantity, revenue, callback) {

            var event = {
                type: eventType,
                entity: entity
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
            
            var error = core.validateEvent(event,callback);
            
            if(error)
                return core.returnError(error,callback);

            var req = core.call(this.endpoint, "/createEvents", {
                events: [event]
            },null,callback, userId, apiKey);
            
            return req;
        },

        /**
         * Used for tracking a multiple user interactions, for instance when purchasing multiple products at once.
         * @param {array} events The events to push. See createEvent for detailed information about events.
         */
        createEvents: function (events,callback) {
            
            if (!Array.isArray(events) || events.length === 0) {
                return core.returnError("Events must be a non-empty array",callback);
            }

            if (events.some(core.validateEvent)) {
                return core.returnError(
                    "Malformed event errors: [" + events.map(core.validateEvent).filter(function (e) {
                            return e;
                        }).map(function (e) {
                                return "\"" + e + "\"";
                            }).join(",") + "]",
                    callback
                )
            }

            var req = core.call(this.endpoint, "/createEvents", {
                events: events
            },null,callback, userId, apiKey);
            
            return req;
        },

        /**
         * Used for performing getRelatedEntities requests to the engine.
         * @param {object} entity The entity for which to find related entities
         */
        getRelatedEntities: function (entity) {

            var args = core.getOptionsAndCallback(arguments, 1);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate entity
            if (typeof(entity) != "object" || !entity.type || !entity.id) {
                return core.returnError("entity must be an object with properties \"type\" and \"id\".", callback);
            }
            
            var req = core.call(this.endpoint, "/getRelatedEntities", {
                    entity: entity,
                    resultsOptions: core.deleteCustomData(options),
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        },

        /**
         * Used for performing getEntitiesByAttribute requests to the engine.
         * @param {string} attributeName The name of the attribute for which to get entities
         * @param {any} attributeValue The value of the attribute for which to get entitites
         */
        getEntitiesByAttribute: function (attributeName, attributeValue) {

            var args = core.getOptionsAndCallback(arguments, 2);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate arguments
            if (typeof(attributeName) != "string") {
                return core.returnError("Missing argument attributeName or attributeName was not of type string.", callback);
            }
            
            var req = core.call(this.endpoint, "/getEntitiesByAttribute", {
                    attribute: {
                        name: attributeName,
                        value: attributeValue
                    },
                    resultsOptions: core.deleteCustomData(options),
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        },

        /**
         * Used for performing getEntities requests to the engine.
         */
        getEntities: function () {

            var args = core.getOptionsAndCallback(arguments, 0);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            var req = core.call(this.endpoint, "/getEntities", {
                    resultsOptions: core.deleteCustomData(options),
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        },

        /**
         * Used for performing search requests to the engine.
         * @param {string} query The query to search for
         */
        search: function (query) {

            var args = core.getOptionsAndCallback(arguments, 1);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate input
            if (typeof(query) != "string" || query.length == 0) {
                return core.returnError("query is either missing or not a string", callback);
            }

            var req = core.call(this.endpoint, "/search", {
                    query: query,
                    relatedResultsOptions: options.relatedResultsOptions,
                    spellingSuggestionsOptions: options.spellingSuggestionsOptions,
                    relatedQueriesOptions: options.relatedQueriesOptions,
                    resultsOptions:{
                        sortBy: options.sortBy,
                        filter: options.filter,
                        take: options.take,
                        skip: options.skip,
                        facets: options.facets
                    },
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        },
        
        /**
         * Used for telling the engine to re-sync the catalog.
         */
        sync: function () {

            var args = core.getOptionsAndCallback(arguments, 0);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;
            
            var req = core.call(this.endpoint, "/sync", {
                    customData:options.customData
                }, null, callback, userId, apiKey);

            return req;
        }
    }
}

export default getLoop54Client;
