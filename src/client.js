import core from './core.js';

/**
 * Returns a client that can be used to communicate with the engine.
 * @param {string} endpoint The complete URL to the engine.
*/
function getLoop54Client (endpoint, userId, apiKey, customHeaders) {

    if (typeof endpoint !== 'string' || endpoint.length === 0) {
        throw new Error("Parameter \"endpoint\" must be present and have a non-zero length.");
    }

    const currentUserPlaceholder = "(CurrentUser)";

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
         * Object of custom headers to be set with the calls.
         */
        customHeaders: customHeaders,

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
                }, null, callback, userId, apiKey, customHeaders);

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
        createEvent: function (eventType, entity, orderId, quantity, revenue) {

            var args = core.getOptionsAndCallback(arguments, 2, 7);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

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
                events: [event],
                customData:options.customData
            },null,callback, userId, apiKey, customHeaders);
            
            return req;
        },

        /**
         * Used for tracking a multiple user interactions, for instance when purchasing multiple products at once.
         * @param {array} events The events to push. See createEvent for detailed information about events.
         */
        createEvents: function (events) {
            
            var args = core.getOptionsAndCallback(arguments, 1);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;
            
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
                events: events,
                customData:options.customData
            },null,callback, userId, apiKey, customHeaders);
            
            return req;
        },

        /**
         * Used for performing getRelatedEntities requests to the engine.
         * @param {object} entity The entity for which to find related entities
         */
        getRelatedEntities: function (entity) {

            var args = core.getOptionsAndCallback(arguments, 1, 4);
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
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getComplementaryEntities requests to the engine.
         * @param {object} entity The entity for which to find complmentary entities
         */
        getComplementaryEntities: function (entity) {

            var args = core.getOptionsAndCallback(arguments, 1, 4);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate entity
            if (typeof(entity) != "object" || !entity.type || !entity.id) {
                return core.returnError("entity must be an object with properties \"type\" and \"id\".", callback);
            }
            
            var req = core.call(this.endpoint, "/getComplementaryEntities", {
                    entity: entity,
                    resultsOptions: core.deleteCustomData(options),
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getBasketRecommendations requests to the engine.
         * @param {object[]} entities The set of entities in the basket to get recommendations for.
         */
        getBasketRecommendations: function (entities) {

            var args = core.getOptionsAndCallback(arguments, 1, 4);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate entities
            if (!Array.isArray(entities) || entities.filter(entity => entity.type && entity.id).length !== entities.length) {
                return core.returnError("entities must be a non-empty array where each item is an object with properties \"type\" and \"id\".", callback);
            }

            var req = core.call(this.endpoint, "/getBasketRecommendations", {
                    entities: entities,
                    resultsOptions: core.deleteCustomData(options),
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getRecommendedEntities requests to the engine.
         */
        getRecommendedEntities: function () {
            var args = core.getOptionsAndCallback(arguments, 0, 2);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            var req = core.call(this.endpoint, "/getRecommendedEntities", {
                    resultsOptions: core.deleteCustomData(options),
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getRecentEntities requests to the engine for the current user.
         * @param {string} behaviorType The interaction or navigation type to include (such as "click", "purchase" or "search").
         * @param {string[]} [entityType] The entity types to include (such as "Product" or "Query") or null for all.
         */
        getRecentEntitiesForCurrentUser: function (behaviorType, entityType) {
            return this.getRecentEntities(behaviorType, currentUserPlaceholder, entityType);
        },

        /**
         * Used for performing getRecentEntities requests to the engine.
         * @param {string} behaviorType The interaction or navigation type to include (such as "click", "purchase" or "search").
         * @param {string} [forUserId] User ID (normally the same as the one in the User-Id header) to retrieve the most recent entities for that user, null or undefined to retrieve the globally most recent entities.
         * @param {string[]} [entityType] The entity types to include (such as "Product" or "Query") or null for all.
         */
        getRecentEntities: function (behaviorType, forUserId, entityType) {
            var argumentsArray = Array.prototype.slice.call(arguments);
            
            if (typeof forUserId !== "string" && forUserId !== null) {
                argumentsArray.splice(1, 0, null);
                forUserId = null;
            }
            if (!Array.isArray(entityType) && entityType !== null) {
                argumentsArray.splice(2, 0, null);
                entityType = null;
            }

            var args = core.getOptionsAndCallback(argumentsArray.slice(2), 1);
            if (args.error) {
                return core.returnError(args.error, args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            var req = core.call(this.endpoint, "/getRecentEntities", {
                    behaviorType,
                    forUserId,
                    entityType,
                    resultsOptions: core.deleteCustomData(options),
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getPopularEntities requests to the engine for the current user.
         * @param {string} behaviorType The interaction or navigation type to include (such as "click", "purchase" or "search").
         * @param {string[]} [entityType] The entity types to include (such as "Product" or "Query") or null for all.
         */
        getPopularEntitiesForCurrentUser: function (behaviorType, entityType) {
            return this.getPopularEntities(behaviorType, currentUserPlaceholder, entityType);
        },

        /**
         * Used for performing getPopularEntities requests to the engine.
         * @param {string} behaviorType The interaction or navigation type to include (such as "click", "purchase" or "search").
         * @param {string} [forUserId] User ID (normally the same as the one in the User-Id header) to retrieve the most common entities for that user, null or undefined to retrieve the globally most common entities.
         * @param {string[]} [entityType] The entity types to include (such as "Product" or "Query") or null for all.
         */
        getPopularEntities: function (behaviorType, forUserId, entityType) {
            var argumentsArray = Array.prototype.slice.call(arguments);
            
            if (typeof forUserId !== "string" && forUserId !== null) {
                argumentsArray.splice(1, 0, null);
                forUserId = null;
            }
            if (!Array.isArray(entityType) && entityType !== null) {
                argumentsArray.splice(2, 0, null);
                entityType = null;
            }
            
            var args = core.getOptionsAndCallback(argumentsArray.slice(2), 1);
            if (args.error) {
                return core.returnError(args.error, args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            var req = core.call(this.endpoint, "/getPopularEntities", {
                    behaviorType,
                    forUserId,
                    entityType,
                    resultsOptions: core.deleteCustomData(options),
                    customData: options.customData,
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for performing getEntitiesByAttribute requests to the engine.
         * @param {string} attributeName The name of the attribute for which to get entities
         * @param {any} attributeValues The value of the attribute for which to get entitites. This can be a single value, or an array of values.
         */
        getEntitiesByAttribute: function (attributeName, attributeValues) {

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
            
            //copy alias to separate variable and remove it from options
            var alias = options.requestAlias;
            if(alias)
                delete options.requestAlias;
        
            var req = core.call(this.endpoint, "/getEntitiesByAttribute", {
                    attribute: {
                        name: attributeName,
                        value: attributeValues
                    },
                    requestAlias: alias,
                    resultsOptions: core.deleteCustomData(options),
                    customData:options.customData
                }, null, callback, userId, apiKey, customHeaders);

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
                }, null, callback, userId, apiKey, customHeaders);

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
                }, null, callback, userId, apiKey, customHeaders);

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
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },
        
        /**
         * Used to perform a request to get information about attributes, indexed and non-indexed.
         */
        getIndexedAttributes:  function () {

            var args = core.getOptionsAndCallback(arguments, 0);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;
            
            var req = core.call(this.endpoint, "/getIndexedAttributes", {
                    customData:options.customData
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },
        
        /**
         * Used to perform a request to get a list of all unique values that are indexed for the provided attribute.
         * @param {string} attributeName The name of the attribute for which to fetch indexed values.
         */
        getIndexedAttributeValues: function (attributeName) {

            var args = core.getOptionsAndCallback(arguments, 1);
            if (args.error) {
                return core.returnError(args.error,args.callback);
            }

            var options = args.options ? args.options : {};
            var callback = args.callback ? args.callback : null;

            //validate input
            if (typeof(attributeName) != "string" || attributeName.length == 0) {
                return core.returnError("attributeName is either missing or not a string", callback);
            }

            var req = core.call(this.endpoint, "/getIndexedAttributeValues", {
                    attributeName: attributeName,
                    customData:options.customData
                }, null, callback, userId, apiKey, customHeaders);

            return req;
        },

        /**
         * Used for removing current userId cookie and setting a new one.
         */
        generateNewUserId: function () {

            core.removeUserId();
            return core.setUserId();
        }
    }
}

export default getLoop54Client;
